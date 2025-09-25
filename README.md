# GameDistribution 游戏信息采集工具

该项目提供一个命令行脚本，用于抓取 [GameDistribution](https://gamedistribution.com/) 上公开游戏详情页的关键信息，并将数据写入本地 JSON Lines 文件，同时下载每款游戏的封面图到 `./img/` 目录。

## 功能概览

- 支持输入一个或多个游戏详情页 URL 或 slug。
- 自动解析标题、描述、规范化链接、封面图地址、可玩 iframe 地址等字段。
- 解析可选字段：发行方 `publisher`、页面标签 `tags`（若页面可解析）。
- 将结果写入 `games.jsonl`，同一 slug 会被最新记录覆盖。
- 下载封面图到本地 `img/` 目录，文件名自动清洗非法字符并限制长度。
- 自动遵守 `robots.txt`，并在请求之间加入速率限制，内置重试与指数退避策略。

## 安装依赖

脚本基于 Python 标准库实现，无需额外依赖。推荐使用 Python 3.10 及以上版本。

## 使用方法

```bash
python scrape_gamedistribution.py \
  hawaii-match-5 \
  https://gamedistribution.com/games/bubble-farm/ \
  --output games.jsonl \
  --img-dir img
```

或从文本文件读取待采集列表：

```bash
python scrape_gamedistribution.py --input-file urls.txt
```

其中 `urls.txt` 每行一个 URL 或 slug，支持使用 `#` 开头的注释行。

### 常用参数

| 参数 | 说明 |
| ---- | ---- |
| `--output` | 指定 JSON Lines 输出文件（默认 `games.jsonl`）。 |
| `--img-dir` | 指定封面图保存目录（默认 `img/`）。 |
| `--timeout` | 单次请求超时时间，单位秒（默认 30）。 |
| `--rate-limit` | 请求间的最小间隔，单位秒（默认 0.7）。 |
| `--retries` | 每个请求的最大重试次数（默认 3）。 |
| `--backoff` | 重试的指数退避基数（默认 2.0）。 |

## 输出格式

脚本将每个游戏写入一行 JSON 对象，字段如下：

```json
{
  "name": "Hawaii Match 5",
  "slug": "hawaii-match-5",
  "canonical_url": "https://gamedistribution.com/games/hawaii-match-5/",
  "description": "Escape to the paradise...",
  "og_image": "https://.../hawaii-match-5-og.jpg",
  "play_url": "https://html5.gamedistribution.com/.../",
  "publisher": "SOFTGAMES – Mobile Entertainment Services GmbH",
  "tags": ["match-3", "puzzle"],
  "fetched_at": "2025-09-25T11:00:00+00:00",
  "error": null
}
```

- 缺失的字段会置为 `null`。
- 如遇网络/状态码错误，`error` 字段会记录简要原因，同时跳过封面图下载。

## 注意事项

- 请遵守目标站点的 robots.txt 与使用条款，仅抓取公开可见的页面与资源。
- 初次运行后可重复执行脚本，数据文件会基于 slug 自动更新。
- 若站点限制较严格，可适当增大 `--rate-limit` 或减少输入数量。

## 许可证

本项目依据 MIT License 发布。
