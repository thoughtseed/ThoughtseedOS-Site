# Deploy — Thoughtseed main site (Digital Wilderness)

## Production

| Item | Value |
| --- | --- |
| GitHub | `thoughtseed/ThoughtseedOS-Site` |
| Cloudflare Pages | `thoughtseed-os-site` (account personal `9d9d23…`) |
| Domains | `thoughtseed.space`, `www.thoughtseed.space`, `thoughtseed-os-site.pages.dev` |
| CI | `.github/workflows/deploy-cloudflare-pages.yml` on `main` + `workflow_dispatch` |

## Secrets (repo)

- `CLOUDFLARE_API_TOKEN` — Account **Pages Write** (+ Read)
- `CLOUDFLARE_ACCOUNT_ID` — `9d9d23b27f32e70ae3afb6a1aa2c0f10`

## Manual

```bash
npm ci && npm run pages:deploy
# unset CLOUDFLARE_API_TOKEN* if OAuth wrangler is preferred locally
```

## System test harness

This surface is the **first public canary** for skill-clusters website delivery close-out, Hermes/agent deploy checks, and future quests:

1. Change content → push `main` → Pages deploy green  
2. `curl -s https://thoughtseed.space/ \| grep Digital`  
3. Later: quest/Hermes job asserts HTTP 200 + title without human click
