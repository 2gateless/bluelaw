import datetime
import html
import json
import os
import re
import sys
import urllib.request

BASE_URL = "https://bluelaw.co.kr/bbs/board.php?bo_table=case&page={page}"
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


def fetch_all_cases():
    items = []
    seen_ids = set()
    page = 1
    while True:
        req = urllib.request.Request(BASE_URL.format(page=page), headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            print(f"Error fetching page {page}: {e}", file=sys.stderr)
            break

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


def main():
    items = fetch_all_cases()
    # Safety gate: if fetched items is unreasonably small (e.g. IP block, site maintenance), abort
    if not items or len(items) < 50:
        print(f"Safety check triggered: only {len(items)} cases fetched. Keeping existing files.", file=sys.stderr)
        sys.exit(0)

    # Save to cases.json and public/cases.json
    for target in ["cases.json", "public/cases.json"]:
        os.makedirs(os.path.dirname(target) if os.path.dirname(target) else ".", exist_ok=True)
        with open(target, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
            f.write("\n")

    # Record sync timestamp for keepalive and audit
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open("last_synced.txt", "w", encoding="utf-8") as f:
        f.write(f"last_synced: {now}\ntotal_cases: {len(items)}\n")

    print(f"Successfully synced {len(items)} cases at {now}")


if __name__ == "__main__":
    main()
