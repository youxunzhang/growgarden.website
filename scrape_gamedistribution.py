#!/usr/bin/env python3
"""Scrape public GameDistribution game pages and store structured metadata."""

from __future__ import annotations

import argparse
import dataclasses
import json
import mimetypes
import re
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib import error, parse, request, robotparser

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0 Safari/537.36"
)
DEFAULT_RATE_LIMIT_SECONDS = 0.7
DEFAULT_RETRIES = 3
DEFAULT_BACKOFF = 2.0


@dataclass
class GameRecord:
    name: Optional[str]
    slug: str
    canonical_url: str
    description: Optional[str]
    og_image: Optional[str]
    play_url: Optional[str]
    publisher: Optional[str]
    tags: Optional[List[str]]
    fetched_at: str
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, object]:
        data = dataclasses.asdict(self)
        if not data["tags"]:
            data["tags"] = None
        return data


class GamePageParser(HTMLParser):
    """Light-weight HTML parser that collects meta/link/script fields."""

    def __init__(self) -> None:
        super().__init__()
        self.meta_tags: List[Dict[str, str]] = []
        self.link_tags: List[Dict[str, str]] = []
        self.jsonld_blocks: List[str] = []
        self.iframes: List[str] = []
        self._title_chunks: List[str] = []
        self._capture_title = False
        self._capture_jsonld = False
        self.heading: Optional[str] = None
        self._capture_h1 = False
        self._h1_depth = 0
        self._h1_chunks: List[str] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        attrs_dict: Dict[str, str] = {name.lower(): (value or "") for name, value in attrs}
        tag_lower = tag.lower()
        if tag_lower == "meta":
            self.meta_tags.append(attrs_dict)
        elif tag_lower == "link":
            self.link_tags.append(attrs_dict)
        elif tag_lower == "script":
            script_type = attrs_dict.get("type", "").lower()
            if script_type == "application/ld+json":
                self._capture_jsonld = True
            else:
                self._capture_jsonld = False
        elif tag_lower == "title":
            self._capture_title = True
        elif tag_lower == "iframe":
            src = attrs_dict.get("src") or attrs_dict.get("data-src") or ""
            if src:
                self.iframes.append(src)
        elif tag_lower == "h1" and self.heading is None:
            self._capture_h1 = True
            self._h1_depth = 1
            self._h1_chunks = []
        elif self._capture_h1:
            self._h1_depth += 1

    def handle_endtag(self, tag: str) -> None:
        tag_lower = tag.lower()
        if tag_lower == "script":
            self._capture_jsonld = False
        elif tag_lower == "title":
            self._capture_title = False
        elif self._capture_h1:
            self._h1_depth -= 1
            if self._h1_depth <= 0:
                text = "".join(self._h1_chunks).strip()
                if text:
                    self.heading = text
                self._capture_h1 = False
                self._h1_chunks = []

    def handle_startendtag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_data(self, data: str) -> None:
        if self._capture_jsonld and data.strip():
            self.jsonld_blocks.append(data.strip())
        if self._capture_title:
            self._title_chunks.append(data)
        if self._capture_h1:
            self._h1_chunks.append(data)

    @property
    def title(self) -> Optional[str]:
        text = "".join(self._title_chunks).strip()
        return text or None


class GameScraper:
    def __init__(
        self,
        *,
        timeout: float,
        rate_limit: float,
        retries: int,
        backoff_factor: float,
    ) -> None:
        self.timeout = timeout
        self.rate_limit = rate_limit
        self.retries = retries
        self.backoff_factor = backoff_factor
        self._last_request: Optional[float] = None
        self._robots: Dict[str, robotparser.RobotFileParser] = {}

    # ------------------------------------------------------------------
    # Networking helpers
    # ------------------------------------------------------------------
    def _wait_for_rate_limit(self) -> None:
        if self._last_request is None:
            return
        elapsed = time.monotonic() - self._last_request
        if elapsed < self.rate_limit:
            time.sleep(self.rate_limit - elapsed)

    def _record_request(self) -> None:
        self._last_request = time.monotonic()

    def _build_headers(self) -> Dict[str, str]:
        return {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }

    def _robots_for(self, scheme: str, netloc: str) -> robotparser.RobotFileParser:
        key = f"{scheme}://{netloc}"
        if key in self._robots:
            return self._robots[key]
        robots_url = parse.urlunparse((scheme, netloc, "/robots.txt", "", "", ""))
        rp = robotparser.RobotFileParser()
        rp.set_url(robots_url)
        try:
            text, _ = self._request_text(robots_url, check_robots=False)
        except Exception:
            rp.parse([])
        else:
            rp.parse(text.splitlines())
        self._robots[key] = rp
        return rp

    def _ensure_allowed(self, url: str) -> None:
        parsed = parse.urlparse(url)
        scheme = parsed.scheme or "https"
        netloc = parsed.netloc
        if not netloc:
            return
        rp = self._robots_for(scheme, netloc)
        path = parsed.path or "/"
        if parsed.query:
            path = f"{path}?{parsed.query}"
        if not rp.can_fetch(USER_AGENT, path):
            raise PermissionError(f"robots.txt forbids accessing {url}")

    def _request_raw(
        self,
        url: str,
        *,
        check_robots: bool = True,
    ) -> Tuple[bytes, Dict[str, str]]:
        if check_robots:
            self._ensure_allowed(url)
        headers = self._build_headers()
        last_error: Optional[Exception] = None
        for attempt in range(self.retries):
            if attempt:
                time.sleep(self.backoff_factor ** (attempt - 1))
            self._wait_for_rate_limit()
            req = request.Request(url, headers=headers)
            try:
                with request.urlopen(req, timeout=self.timeout) as resp:  # type: ignore[arg-type]
                    data = resp.read()
                    headers_map = dict(resp.headers.items())
            except error.HTTPError as exc:
                last_error = exc
                if 400 <= exc.code < 500 and exc.code != 429:
                    break
                continue
            except Exception as exc:  # noqa: BLE001
                last_error = exc
                continue
            finally:
                self._record_request()
            return data, headers_map
        if last_error is None:
            raise RuntimeError(f"Failed to fetch {url}")
        raise last_error

    def _request_text(
        self,
        url: str,
        *,
        check_robots: bool = True,
    ) -> Tuple[str, Dict[str, str]]:
        data, headers_map = self._request_raw(url, check_robots=check_robots)
        encoding = "utf-8"
        content_type = headers_map.get("Content-Type", "")
        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1].split(";")[0].strip()
        text = data.decode(encoding, errors="replace")
        return text, headers_map

    def _request_binary(
        self,
        url: str,
        *,
        check_robots: bool = True,
    ) -> Tuple[bytes, Dict[str, str]]:
        return self._request_raw(url, check_robots=check_robots)

    # ------------------------------------------------------------------
    # Scraping helpers
    # ------------------------------------------------------------------
    def _download_image(
        self,
        url: str,
        target_dir: Path,
        filename_hint: str,
    ) -> Optional[Path]:
        try:
            payload, headers_map = self._request_binary(url)
        except Exception as exc:  # noqa: BLE001
            print(f"[warn] Image download failed for {url}: {exc}")
            return None

        extension = self._guess_extension(url, headers_map.get("Content-Type"))
        safe_name = sanitize_filename(filename_hint) or "image"
        target_dir.mkdir(parents=True, exist_ok=True)
        path = target_dir / f"{safe_name}{extension}"
        path.write_bytes(payload)
        return path

    @staticmethod
    def _guess_extension(url: str, content_type: Optional[str]) -> str:
        parsed_url = parse.urlparse(url)
        ext = Path(parsed_url.path).suffix
        if ext:
            return _normalise_extension(ext)
        if content_type:
            guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
            if guessed:
                return _normalise_extension(guessed)
        return ".jpg"

    def scrape(self, target: str, image_dir: Path) -> Tuple[GameRecord, Optional[Path]]:
        slug = determine_slug(target)
        game_url = build_game_url(target)
        fetched_at = datetime.now(timezone.utc).isoformat()

        try:
            html, _ = self._request_text(game_url)
        except Exception as exc:  # noqa: BLE001
            record = GameRecord(
                name=None,
                slug=slug,
                canonical_url=game_url,
                description=None,
                og_image=None,
                play_url=None,
                publisher=None,
                tags=None,
                fetched_at=fetched_at,
                error=str(exc),
            )
            return record, None

        parser = GamePageParser()
        parser.feed(html)

        jsonld = extract_game_jsonld(parser.jsonld_blocks)

        canonical_href = link_lookup(parser.link_tags, "canonical")
        canonical_url = parse.urljoin(game_url, canonical_href) if canonical_href else game_url
        name = choose_name(jsonld, parser)
        description = choose_description(jsonld, parser)
        og_image = choose_og_image(jsonld, parser, canonical_url)
        play_url = choose_play_url(parser, canonical_url)
        publisher = choose_publisher(jsonld)
        tags = choose_tags(jsonld, parser)

        record = GameRecord(
            name=name,
            slug=slug,
            canonical_url=canonical_url,
            description=description,
            og_image=og_image,
            play_url=play_url,
            publisher=publisher,
            tags=tags or None,
            fetched_at=fetched_at,
        )

        image_path: Optional[Path] = None
        if record.og_image:
            filename_hint = record.name or record.slug
            image_path = self._download_image(record.og_image, image_dir, filename_hint)
        return record, image_path


# ----------------------------------------------------------------------
# Parsing helpers
# ----------------------------------------------------------------------

def determine_slug(url_or_slug: str) -> str:
    if "://" not in url_or_slug:
        return url_or_slug.strip("/")
    parsed = parse.urlparse(url_or_slug)
    segments = [segment for segment in parsed.path.split("/") if segment]
    if not segments:
        raise ValueError(f"Cannot determine slug from {url_or_slug!r}")
    if "games" in segments:
        idx = segments.index("games")
        if idx + 1 >= len(segments):
            raise ValueError(f"URL lacks slug component: {url_or_slug!r}")
        return segments[idx + 1]
    return segments[-1]


def build_game_url(url_or_slug: str) -> str:
    if "://" in url_or_slug:
        base = url_or_slug
    else:
        base = f"https://gamedistribution.com/games/{url_or_slug.strip('/')}/"
    parsed = parse.urlparse(base)
    scheme = parsed.scheme or "https"
    netloc = parsed.netloc or "gamedistribution.com"
    path = parsed.path
    if not path.endswith("/"):
        path += "/"
    return parse.urlunparse((scheme, netloc, path, "", "", ""))


def extract_game_jsonld(blocks: Iterable[str]) -> Optional[Dict[str, object]]:
    for block in blocks:
        text = block.strip()
        if not text:
            continue
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            continue
        queue: List[Dict[str, object]] = []
        if isinstance(parsed, dict):
            queue.append(parsed)
        elif isinstance(parsed, list):
            queue.extend([item for item in parsed if isinstance(item, dict)])
        while queue:
            item = queue.pop(0)
            type_field = item.get("@type")
            type_names: List[str] = []
            if isinstance(type_field, str):
                type_names = [type_field.lower()]
            elif isinstance(type_field, list):
                type_names = [str(value).lower() for value in type_field]
            if any(name in {"videogame", "game", "softwareapplication"} for name in type_names):
                return item
            for value in item.values():
                if isinstance(value, dict):
                    queue.append(value)
                elif isinstance(value, list):
                    queue.extend([child for child in value if isinstance(child, dict)])
    return None


def link_lookup(link_tags: Iterable[Dict[str, str]], rel_value: str) -> Optional[str]:
    target = rel_value.lower()
    for attrs in link_tags:
        rel = attrs.get("rel", "").lower()
        if rel == target:
            href = attrs.get("href")
            if href:
                return href
    return None


def meta_lookup(meta_tags: Iterable[Dict[str, str]], attr: str, value: str) -> Optional[str]:
    target = value.lower()
    for attrs in meta_tags:
        if attrs.get(attr.lower(), "").lower() == target:
            content = attrs.get("content") or attrs.get("value")
            if content:
                return content
    return None


def choose_name(jsonld: Optional[Dict[str, object]], parser: GamePageParser) -> Optional[str]:
    candidates: List[str] = []
    if isinstance(jsonld, dict):
        raw = jsonld.get("name")
        if isinstance(raw, str):
            candidates.append(raw)
    if parser.title:
        candidates.append(parser.title)
    if parser.heading:
        candidates.append(parser.heading)
    for candidate in candidates:
        cleaned = clean_game_name(candidate)
        if cleaned:
            return cleaned
    return None


def clean_game_name(raw: str) -> str:
    value = raw.strip()
    suffixes = [
        " - Play Free Online Games on GameDistribution.com",
        " - Play Free Online Games | GameDistribution.com",
        " - Play Free Online Games",
        " | GameDistribution.com",
        " - GameDistribution.com",
    ]
    lower_value = value.lower()
    for suffix in suffixes:
        if lower_value.endswith(suffix.lower()):
            value = value[: -len(suffix)]
            lower_value = value.lower()
    return value.strip()


def choose_description(
    jsonld: Optional[Dict[str, object]],
    parser: GamePageParser,
) -> Optional[str]:
    if isinstance(jsonld, dict):
        description = jsonld.get("description") or jsonld.get("abstract")
        if isinstance(description, str) and description.strip():
            return description.strip()
    meta_description = meta_lookup(parser.meta_tags, "name", "description")
    if meta_description and meta_description.strip():
        return meta_description.strip()
    return None


def choose_og_image(
    jsonld: Optional[Dict[str, object]],
    parser: GamePageParser,
    base_url: str,
) -> Optional[str]:
    if isinstance(jsonld, dict):
        image_value = jsonld.get("image")
        if isinstance(image_value, str):
            return parse.urljoin(base_url, image_value)
        if isinstance(image_value, list):
            for item in image_value:
                if isinstance(item, str):
                    return parse.urljoin(base_url, item)
    og_image = meta_lookup(parser.meta_tags, "property", "og:image")
    if og_image:
        return parse.urljoin(base_url, og_image)
    image_src = meta_lookup(parser.meta_tags, "itemprop", "image")
    if image_src:
        return parse.urljoin(base_url, image_src)
    for attrs in parser.link_tags:
        rel = attrs.get("rel", "").lower()
        if rel in {"image_src", "image"}:
            href = attrs.get("href")
            if href:
                return parse.urljoin(base_url, href)
    return None


def choose_play_url(parser: GamePageParser, base_url: str) -> Optional[str]:
    for src in parser.iframes:
        absolute = parse.urljoin(base_url, src)
        netloc = parse.urlparse(absolute).netloc.lower()
        if "html5.gamedistribution.com" in netloc:
            return absolute
    if parser.iframes:
        return parse.urljoin(base_url, parser.iframes[0])
    return None


def choose_publisher(jsonld: Optional[Dict[str, object]]) -> Optional[str]:
    if not isinstance(jsonld, dict):
        return None
    publisher = jsonld.get("publisher") or jsonld.get("provider")
    if isinstance(publisher, dict):
        name = publisher.get("name")
        if isinstance(name, str):
            stripped = name.strip()
            if stripped:
                return stripped
    if isinstance(publisher, str):
        stripped = publisher.strip()
        if stripped:
            return stripped
    return None


def choose_tags(
    jsonld: Optional[Dict[str, object]],
    parser: GamePageParser,
) -> List[str]:
    tags: List[str] = []
    if isinstance(jsonld, dict):
        tags.extend(split_keywords(jsonld.get("keywords")))
        tags.extend(split_keywords(jsonld.get("genre")))
        tags.extend(split_keywords(jsonld.get("applicationCategory")))
    tags.extend(split_keywords(meta_lookup(parser.meta_tags, "name", "keywords")))
    unique: List[str] = []
    seen = set()
    for tag in tags:
        normalised = tag.strip()
        if not normalised:
            continue
        key = normalised.lower()
        if key not in seen:
            seen.add(key)
            unique.append(normalised)
    return unique


def split_keywords(value: object) -> List[str]:
    if isinstance(value, list):
        result: List[str] = []
        for item in value:
            result.extend(split_keywords(item))
        return result
    if isinstance(value, str):
        if "," in value or ";" in value:
            return [segment.strip() for segment in re.split(r"[,;]", value) if segment.strip()]
        stripped = value.strip()
        return [stripped] if stripped else []
    return []


def sanitize_filename(value: str) -> str:
    cleaned = re.sub(r"[\\/\:*?\"<>|]+", "", value)
    cleaned = re.sub(r"\s+", "_", cleaned)
    cleaned = cleaned.strip("._")
    return cleaned[:120]


def _normalise_extension(ext: str) -> str:
    cleaned = ext.lower()
    if cleaned in {".jpeg", ".jpe"}:
        return ".jpg"
    if cleaned == ".svgz":
        return ".svg"
    return cleaned


# ----------------------------------------------------------------------
# Dataset helpers
# ----------------------------------------------------------------------

def load_dataset(path: Path) -> Dict[str, Dict[str, object]]:
    if not path.exists():
        return {}
    records: Dict[str, Dict[str, object]] = {}
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if not line.strip():
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError:
                continue
            slug = entry.get("slug")
            if slug:
                records[str(slug)] = entry
    return records


def save_dataset(path: Path, records: Dict[str, Dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        for slug in sorted(records.keys()):
            json.dump(records[slug], fh, ensure_ascii=False)
            fh.write("\n")


# ----------------------------------------------------------------------
# Command-line interface
# ----------------------------------------------------------------------

def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "targets",
        nargs="*",
        help="One or more GameDistribution slugs or detail page URLs.",
    )
    parser.add_argument(
        "--input-file",
        type=Path,
        help="Optional text file that lists targets (one per line, # for comments).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("games.jsonl"),
        help="Destination JSON Lines file (default: games.jsonl).",
    )
    parser.add_argument(
        "--img-dir",
        type=Path,
        default=Path("img"),
        help="Directory used to store downloaded cover images.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30.0,
        help="HTTP timeout in seconds (default: 30).",
    )
    parser.add_argument(
        "--rate-limit",
        type=float,
        default=DEFAULT_RATE_LIMIT_SECONDS,
        help="Minimum delay between requests in seconds (default: 0.7).",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=DEFAULT_RETRIES,
        help="Maximum retry attempts per request (default: 3).",
    )
    parser.add_argument(
        "--backoff",
        type=float,
        default=DEFAULT_BACKOFF,
        help="Backoff multiplier for retries (default: 2.0).",
    )
    return parser.parse_args(argv)


def collect_targets(args: argparse.Namespace) -> List[str]:
    targets: List[str] = list(args.targets)
    if args.input_file:
        for line in args.input_file.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            targets.append(stripped)
    return targets


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    targets = collect_targets(args)
    if not targets:
        print("[error] No targets provided. Use positional arguments or --input-file.")
        return 1

    dataset = load_dataset(args.output)
    scraper = GameScraper(
        timeout=args.timeout,
        rate_limit=args.rate_limit,
        retries=args.retries,
        backoff_factor=args.backoff,
    )

    for target in targets:
        record, image_path = scraper.scrape(target, args.img_dir)
        dataset[record.slug] = record.to_dict()
        if record.error:
            print(f"[error] {record.slug}: {record.error}")
        else:
            message = f"[info] Captured {record.slug}"
            if image_path:
                message += f" (image saved to {image_path})"
            print(message)

    save_dataset(args.output, dataset)
    print(f"[info] Wrote dataset to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
