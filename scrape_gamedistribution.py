#!/usr/bin/env python3
"""Utilities for scraping game metadata from gamedistribution.com.

The script fetches the public game detail pages, extracts useful metadata
and downloads the exposed icon assets.  Results are merged into a JSON
dataset so that subsequent runs can keep the file up to date.

Example
-------
```
python scrape_gamedistribution.py \
    --urls https://gamedistribution.com/games/hawaii-match-5/ \
    --output data/games.json --img-dir img
```
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import mimetypes
import os
import re
import sys
from dataclasses import dataclass, field
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib import parse, request


DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9," "*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


class _MetadataParser(HTMLParser):
    """Minimal HTML parser that gathers meta/link/script content."""

    def __init__(self) -> None:
        super().__init__()
        self.meta_tags: List[Dict[str, str]] = []
        self.link_tags: List[Dict[str, str]] = []
        self.jsonld_blocks: List[str] = []
        self._capture_jsonld = False

    def handle_starttag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        attrs_dict: Dict[str, str] = {
            name.lower(): (value or "") for name, value in attrs
        }

        if tag.lower() == "meta":
            self.meta_tags.append(attrs_dict)
        elif tag.lower() == "link":
            self.link_tags.append(attrs_dict)
        elif tag.lower() == "script":
            script_type = attrs_dict.get("type", "").lower()
            if script_type == "application/ld+json":
                self._capture_jsonld = True
            else:
                self._capture_jsonld = False

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "script":
            self._capture_jsonld = False

    def handle_data(self, data: str) -> None:
        if self._capture_jsonld and data.strip():
            self.jsonld_blocks.append(data.strip())


@dataclass
class GameIcon:
    url: str
    path: str


@dataclass
class GameMetadata:
    slug: str
    title: Optional[str] = None
    description: Optional[str] = None
    categories: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    publisher: Optional[str] = None
    developer: Optional[str] = None
    language: Optional[str] = None
    age_rating: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[GameIcon] = None

    def to_dict(self) -> Dict[str, object]:
        data: Dict[str, object] = {
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "categories": self.categories,
            "tags": self.tags,
            "publisher": self.publisher,
            "developer": self.developer,
            "language": self.language,
            "age_rating": self.age_rating,
            "url": self.url,
        }
        if self.icon:
            data["icon"] = dataclasses.asdict(self.icon)
        else:
            data["icon"] = None
        return data


def _determine_slug(url_or_slug: str) -> str:
    if "://" not in url_or_slug:
        return url_or_slug.strip("/")

    parsed = parse.urlparse(url_or_slug)
    parts = [segment for segment in parsed.path.split("/") if segment]
    if not parts:
        raise ValueError(f"Cannot extract slug from URL: {url_or_slug!r}")
    if "games" in parts:
        idx = parts.index("games")
        if idx + 1 >= len(parts):
            raise ValueError(f"URL does not contain a slug: {url_or_slug!r}")
        return parts[idx + 1]
    return parts[-1]


def _build_game_url(url_or_slug: str) -> str:
    if "://" in url_or_slug:
        base = url_or_slug
    else:
        base = f"https://gamedistribution.com/games/{url_or_slug.strip('/')}/"

    parsed = parse.urlparse(base)
    if not parsed.scheme:
        parsed = parsed._replace(scheme="https")
    if not parsed.netloc:
        parsed = parsed._replace(netloc="gamedistribution.com")
    if not parsed.path.endswith("/"):
        parsed = parsed._replace(path=parsed.path + "/")
    return parse.urlunparse(parsed)


def _http_get(url: str, timeout: float = 30.0) -> tuple[str, Dict[str, str]]:
    req = request.Request(url, headers=DEFAULT_HEADERS)
    with request.urlopen(req, timeout=timeout) as resp:  # type: ignore[arg-type]
        content_type = resp.headers.get("Content-Type", "")
        encoding = "utf-8"
        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1].split(";")[0].strip()
        data = resp.read()
    return data.decode(encoding, errors="replace"), dict(resp.headers.items())


def _download_binary(url: str, target_path: Path, timeout: float = 30.0) -> None:
    req = request.Request(url, headers=DEFAULT_HEADERS)
    with request.urlopen(req, timeout=timeout) as resp:  # type: ignore[arg-type]
        target_path.write_bytes(resp.read())


def _extract_keywords(value: Optional[str]) -> List[str]:
    if not value:
        return []
    parts = [segment.strip() for segment in re.split(r"[,;]", value) if segment.strip()]
    return sorted(set(parts), key=str.lower)


def _parse_jsonld_blocks(blocks: Iterable[str]) -> Dict[str, object]:
    for block in blocks:
        text = block.strip()
        if not text:
            continue
        try:
            parsed = json.loads(unescape(text))
        except json.JSONDecodeError:
            continue

        candidates: List[Dict[str, object]] = []
        if isinstance(parsed, dict):
            candidates.append(parsed)
        elif isinstance(parsed, list):
            candidates.extend([item for item in parsed if isinstance(item, dict)])

        for candidate in candidates:
            type_value = candidate.get("@type")
            if isinstance(type_value, list):
                type_names = [t.lower() for t in type_value if isinstance(t, str)]
            elif isinstance(type_value, str):
                type_names = [type_value.lower()]
            else:
                type_names = []
            if any(t in {"videogame", "game"} for t in type_names):
                return candidate
    return {}


def _meta_lookup(
    meta_tags: Iterable[Dict[str, str]], *, attr: str, value: str
) -> Optional[str]:
    value_lower = value.lower()
    for attrs in meta_tags:
        candidate = attrs.get(attr.lower())
        if candidate and candidate.lower() == value_lower:
            return attrs.get("content") or attrs.get("value")
    return None


def _find_icon_url(
    jsonld: Dict[str, object],
    meta_tags: Iterable[Dict[str, str]],
    link_tags: Iterable[Dict[str, str]],
) -> Optional[str]:
    image_value = jsonld.get("image") if isinstance(jsonld, dict) else None
    if isinstance(image_value, str):
        return image_value
    if isinstance(image_value, list):
        for item in image_value:
            if isinstance(item, str):
                return item

    og_image = _meta_lookup(meta_tags, attr="property", value="og:image")
    if og_image:
        return og_image

    for attrs in link_tags:
        rel = attrs.get("rel", "").lower()
        if rel in {"icon", "shortcut icon", "apple-touch-icon"}:
            href = attrs.get("href")
            if href:
                return href
    return None


def _normalise_url(url: str, base: str) -> str:
    return parse.urljoin(base, url)


def scrape_game(url_or_slug: str, *, timeout: float = 30.0) -> GameMetadata:
    slug = _determine_slug(url_or_slug)
    game_url = _build_game_url(url_or_slug)
    html, _headers = _http_get(game_url, timeout=timeout)

    parser = _MetadataParser()
    parser.feed(html)

    jsonld = _parse_jsonld_blocks(parser.jsonld_blocks)

    metadata = GameMetadata(slug=slug, url=game_url)

    metadata.title = (
        jsonld.get("name")
        if isinstance(jsonld, dict)
        else _meta_lookup(parser.meta_tags, attr="property", value="og:title")
    )
    if not metadata.title:
        metadata.title = _meta_lookup(parser.meta_tags, attr="name", value="title")

    description = None
    if isinstance(jsonld, dict):
        description = jsonld.get("description") or jsonld.get("abstract")
    if not isinstance(description, str):
        description = _meta_lookup(parser.meta_tags, attr="name", value="description")
    metadata.description = description

    categories: List[str] = []
    if isinstance(jsonld, dict):
        category_value = jsonld.get("applicationCategory") or jsonld.get("genre")
        if isinstance(category_value, str):
            categories.extend(_extract_keywords(category_value))
        elif isinstance(category_value, list):
            categories.extend(
                [str(item).strip() for item in category_value if str(item).strip()]
            )
    metadata.categories = sorted(set(categories), key=str.lower)

    keywords: List[str] = []
    if isinstance(jsonld, dict):
        keywords.extend(_extract_keywords(jsonld.get("keywords")))
        audience = jsonld.get("audience")
        if isinstance(audience, dict):
            audience_name = audience.get("audienceType")
            if isinstance(audience_name, str):
                keywords.extend(_extract_keywords(audience_name))
    keywords.extend(
        _extract_keywords(
            _meta_lookup(parser.meta_tags, attr="name", value="keywords")
        )
    )
    metadata.tags = sorted(set(keywords), key=str.lower)

    if isinstance(jsonld, dict):
        publisher = jsonld.get("publisher")
        if isinstance(publisher, dict):
            metadata.publisher = publisher.get("name")  # type: ignore[assignment]
        elif isinstance(publisher, str):
            metadata.publisher = publisher

        provider = jsonld.get("provider")
        if isinstance(provider, dict) and not metadata.publisher:
            metadata.publisher = provider.get("name")  # type: ignore[assignment]

        metadata.developer = None
        developer = jsonld.get("creator") or jsonld.get("author")
        if isinstance(developer, dict):
            metadata.developer = developer.get("name")  # type: ignore[assignment]
        elif isinstance(developer, list):
            for item in developer:
                if isinstance(item, dict) and item.get("@type"):
                    metadata.developer = item.get("name")  # type: ignore[assignment]
                    break
        elif isinstance(developer, str):
            metadata.developer = developer

        in_language = jsonld.get("inLanguage")
        if isinstance(in_language, str):
            metadata.language = in_language

        age_rating = jsonld.get("contentRating") or jsonld.get("ageRating")
        if isinstance(age_rating, str):
            metadata.age_rating = age_rating

    icon_url = _find_icon_url(jsonld, parser.meta_tags, parser.link_tags)
    if icon_url:
        metadata.icon = GameIcon(url=_normalise_url(icon_url, metadata.url or game_url), path="")

    return metadata


def _ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def _determine_icon_path(img_dir: Path, slug: str, icon_url: str) -> Path:
    parsed = parse.urlparse(icon_url)
    extension = Path(parsed.path).suffix
    if not extension:
        guessed = mimetypes.guess_extension(
            mimetypes.guess_type(parsed.path or icon_url)[0] or "image/png"
        )
        extension = guessed or ".png"
    return img_dir / f"{slug}{extension}"


def _load_existing_dataset(path: Path) -> Dict[str, Dict[str, object]]:
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
    except json.JSONDecodeError:
        raise RuntimeError(f"Existing dataset at {path} is not valid JSON")

    if isinstance(data, list):
        result = {}
        for entry in data:
            if isinstance(entry, dict) and "slug" in entry:
                result[str(entry["slug"])] = entry
        return result
    if isinstance(data, dict):
        return {
            str(slug): value
            for slug, value in data.items()
            if isinstance(value, dict)
        }
    raise RuntimeError("Unsupported JSON structure in dataset; expected list or object")


def _save_dataset(path: Path, data: Dict[str, Dict[str, object]]) -> None:
    ordered = [data[key] for key in sorted(data.keys())]
    with path.open("w", encoding="utf-8") as fh:
        json.dump(ordered, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def collect_urls(args: argparse.Namespace) -> List[str]:
    urls: List[str] = []
    if args.urls:
        urls.extend(args.urls)
    if args.input_file:
        for line in Path(args.input_file).read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            urls.append(stripped)
    return urls


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--urls",
        nargs="*",
        help="One or more game URLs or slugs to scrape.",
    )
    parser.add_argument(
        "--input-file",
        help="Path to a text file that contains additional URLs/slugs (one per line).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data") / "games.json",
        help="Path of the JSON dataset to update.",
    )
    parser.add_argument(
        "--img-dir",
        type=Path,
        default=Path("img"),
        help="Directory where downloaded icons will be stored.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30.0,
        help="HTTP timeout in seconds.",
    )

    parsed_args = parser.parse_args(argv)
    urls = collect_urls(parsed_args)
    if not urls:
        parser.error("Please provide at least one URL or slug using --urls or --input-file")

    dataset = _load_existing_dataset(parsed_args.output)

    _ensure_directory(parsed_args.output.parent)
    _ensure_directory(parsed_args.img_dir)

    for target in urls:
        try:
            metadata = scrape_game(target, timeout=parsed_args.timeout)
        except Exception as exc:  # noqa: BLE001 - propagate as friendly message
            print(f"[error] Failed to scrape {target}: {exc}", file=sys.stderr)
            continue

        if metadata.icon and metadata.icon.url:
            icon_url = metadata.icon.url
            if not icon_url.startswith("http"):
                icon_url = _normalise_url(icon_url, metadata.url or "")

            icon_path = _determine_icon_path(parsed_args.img_dir, metadata.slug, icon_url)
            try:
                _download_binary(icon_url, icon_path, timeout=parsed_args.timeout)
            except Exception as exc:  # noqa: BLE001
                print(
                    f"[warn] Could not download icon for {metadata.slug} ({icon_url}): {exc}",
                    file=sys.stderr,
                )
            else:
                metadata.icon.path = str(icon_path)

        dataset[metadata.slug] = metadata.to_dict()
        print(f"[info] Captured metadata for {metadata.slug}")

    _save_dataset(parsed_args.output, dataset)
    print(f"[info] Stored dataset to {parsed_args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
