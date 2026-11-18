import html
import json
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
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode("utf-8", errors="replace")
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
    if not items:
        print("No cases fetched; keeping existing cases.json", file=sys.stderr)
        sys.exit(1)
    with open("cases.json", "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Synced {len(items)} cases to cases.json")


if __name__ == "__main__":
    main()
