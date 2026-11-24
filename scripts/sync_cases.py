import datetime
import html
import json
import os
import re
import sys
import time
import urllib.request

BASE_URL = "https://bluelaw.co.kr/bbs/board.php?bo_table=case&page={page}"
TARGET_PATH = os.path.join("public", "cases.json")
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
ITEM_RE = re.compile(
    r'<li[^>]*class="main-case-slide[^"]*"[^>]*>.*?<a\s+href="([^"]*wr_id=(\d+)[^"]*)"[^>]*>.*?'
    r'<div\s+class="cate">\s*(.*?)\s*</div>\s*'
    r'<p\s+class="subject">\s*(.*?)\s*</p>',
    re.S,
)
MAX_RETRIES = 3


def fetch_page_html(page):
    url = BASE_URL.format(page=page)
    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                if resp.status != 200:
                    raise RuntimeError(f"HTTP {resp.status}")
                return resp.read().decode("utf-8", errors="replace")
        except Exception as err:
            last_err = err
            print(
                f"Warning: page {page} attempt {attempt}/{MAX_RETRIES} failed: {err}",
                file=sys.stderr,
            )
            if attempt < MAX_RETRIES:
                time.sleep(2 * attempt)
    raise RuntimeError(f"Failed to fetch page {page} after {MAX_RETRIES} attempts: {last_err}")


def fetch_all_cases():
    items = []
    seen_ids = set()
    page = 1
    while True:
        body = fetch_page_html(page)
        matches = ITEM_RE.findall(body)
        if not matches:
            break
        new_count = 0
        for _, wr_id, cate, subject in matches:
            if wr_id in seen_ids:
                continue
            seen_ids.add(wr_id)
            new_count += 1
            items.append(
                {
                    "id": int(wr_id),
                    "type": html.unescape(re.sub(r"<[^>]+>", "", cate)).strip(),
                    "title": html.unescape(re.sub(r"<[^>]+>", "", subject)).strip(),
                    "url": f"https://bluelaw.co.kr/bbs/board.php?bo_table=case&wr_id={wr_id}",
                }
            )
        if new_count == 0:
            break
        page += 1
    return items


def load_existing_count(path):
    if not os.path.exists(path):
        return 0
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return len(data) if isinstance(data, list) else 0
    except Exception:
        return 0


def main():
    try:
        items = fetch_all_cases()
    except Exception as err:
        print(f"Sync aborted due to fetch error: {err}", file=sys.stderr)
        sys.exit(1)

    existing_count = load_existing_count(TARGET_PATH)
    min_expected = max(50, int(existing_count * 0.9))

    if len(items) < min_expected:
        print(
            f"Safety gate triggered: fetched {len(items)} cases, expected >= {min_expected} "
            f"(existing: {existing_count}). Keeping existing {TARGET_PATH}.",
            file=sys.stderr,
        )
        sys.exit(1)

    os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)
    with open(TARGET_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open("last_synced.txt", "w", encoding="utf-8") as f:
        f.write(f"last_synced: {now}\ntotal_cases: {len(items)}\n")

    print(f"Successfully synced {len(items)} cases at {now}")


if __name__ == "__main__":
    main()
