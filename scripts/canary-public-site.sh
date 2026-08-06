#!/usr/bin/env bash
# Public main-site canary for Thoughtseed Digital Wilderness.
# Exit 0 = healthy. Exit 1 = fail (noise-free, outcome-bearing).
# Safe for: GitHub Actions, Hermes cron, local agents.
set -euo pipefail

UA="${CANARY_UA:-Mozilla/5.0 (compatible; ThoughtseedSiteCanary/1.0; +https://thoughtseed.space)}"
TIMEOUT="${CANARY_TIMEOUT:-20}"
EXPECT_TITLE="${CANARY_EXPECT_TITLE:-Digital Wilderness}"
REJECT_TITLE="${CANARY_REJECT_TITLE:-Founder-Led Systems Studio}"
URLS=(
  "${CANARY_URL_APEX:-https://thoughtseed.space/}"
  "${CANARY_URL_WWW:-https://www.thoughtseed.space/}"
  "${CANARY_URL_PAGES:-https://thoughtseed-os-site.pages.dev/}"
)

failed=0
passed=0
ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "thoughtseed.public-site-canary start=$ts expect_title=$EXPECT_TITLE"

for url in "${URLS[@]}"; do
  body="$(mktemp)"
  code="$(curl -sS -L -A "$UA" --max-time "$TIMEOUT" -o "$body" -w "%{http_code}" "$url" || echo "000")"
  title="$(grep -oE '<title>[^<]*</title>' "$body" | head -1 | sed 's/<title>//;s/<\/title>//' || true)"
  err1000=0
  if grep -qiE 'Error 1000|prohibited IP' "$body"; then err1000=1; fi

  ok=1
  reason=""
  if [[ "$code" != "200" ]]; then ok=0; reason="http_$code"; fi
  if [[ "$err1000" -eq 1 ]]; then ok=0; reason="${reason:+$reason,}error_1000"; fi
  if [[ "$title" != *"$EXPECT_TITLE"* ]]; then ok=0; reason="${reason:+$reason,}title_mismatch"; fi
  if [[ -n "$REJECT_TITLE" && "$title" == *"$REJECT_TITLE"* ]]; then ok=0; reason="${reason:+$reason,}wrong_origin_redesign"; fi

  if [[ "$ok" -eq 1 ]]; then
    echo "PASS code=$code title=$(printf %q "$title") url=$url"
    passed=$((passed + 1))
  else
    echo "FAIL code=$code title=$(printf %q "$title") reason=$reason url=$url"
    failed=$((failed + 1))
  fi
  rm -f "$body"
done

echo "thoughtseed.public-site-canary end=$(date -u +%Y-%m-%dT%H:%M:%SZ) passed=$passed failed=$failed workId=program:company-website"

if [[ "$failed" -gt 0 ]]; then
  exit 1
fi
exit 0
