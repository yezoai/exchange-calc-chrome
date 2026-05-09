# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chrome Extension (Manifest V3) that converts a user-selected price on any web page into CNY / USD / RUB. Selection → context-menu title preview → click to copy the full result. README is in Chinese; user-facing strings in code are also Chinese.

## Development workflow

There is no build, bundler, package manager, lint, or test setup. Source is plain ES modules loaded directly by Chrome.

- Load: `chrome://extensions` → enable Developer mode → "Load unpacked" → pick this directory.
- Reload after edits: hit the reload button on the extension card. Service-worker changes especially need this; an old worker can stay registered.
- Manual test page: open `test-page.html` directly, or `python3 -m http.server 4173` then `http://localhost:4173/test-page.html`.
- Inspect the service worker via the "service worker" link on the extension card; inspect the popup by right-clicking the popup → Inspect.

## Architecture

Three runtime surfaces share the same `src/` modules. Because the service worker is declared `"type": "module"` in `manifest.json`, every entry point uses native ESM `import` — keep all `src/*.js` as ES modules with explicit `.js` extensions in import paths (Chrome won't resolve extensionless specifiers).

- `background.js` (service worker) — owns the single context menu (`MENU_ID`). Listens for `exchange-calc:selection-changed` messages from the content script and rewrites the menu title to a live preview (`buildMenuTitle`, capped at 64 chars per Chrome's limit). On click, parses again, fetches rates, shows a notification, and uses `chrome.scripting.executeScript` to copy the result via the page's clipboard (with a `document.execCommand("copy")` fallback for pages where `navigator.clipboard` is blocked).
- `content.js` — debounces `selectionchange` / `mouseup` / `keyup` (120 ms) and posts the trimmed selection to the worker. Dedupes against `lastSelection` so we don't churn the menu.
- `popup.html` / `popup.js` — manual entry + a "read current selection" button that re-runs `window.getSelection()` in the active tab via `chrome.scripting.executeScript`.
- `options.html` / `options.js` — settings UI; declared as `options_page` in the manifest.

### `src/` modules (the conversion pipeline)

`parseSelection` → `getRates` → `convertPrice` → `formatResultText` / `formatMenuTitle`.

- `src/parser.js` — recognizes `¥/￥/$/₽` symbol-prefixed amounts, then `CNY|USD|RUB` code-prefixed amounts, then bare numbers (which fall back to `defaultCurrency` from settings and are flagged `assumed: true`). Suffix forms like `5 USD` are intentionally not supported — see README "已知限制".
- `src/rates.js` — fetches from `open.er-api.com` with `api.exchangerate-api.com` as fallback; caches in `chrome.storage.local` under `exchange-calc-rates`. Critical behavior: on fetch failure, it falls back to the *expired* cache rather than throwing, so the extension keeps working offline. All conversion routes through USD (USD is the API base, stored as `rates.USD = 1`).
- `src/settings.js` — persists user settings to `chrome.storage.sync` (syncs across browsers). `cacheTtlMinutes` is clamped to `[5, 1440]`. Note the storage split: settings in `sync`, rate cache in `local`.
- `src/formatter.js` — both formatters round to 1 decimal when `value >= 100`, else 2. `popup.js` and `background.js` each duplicate this `formatAmount` locally instead of importing it; if you change the rule, update all three.

### Adding a new currency

Currency support is hardcoded in several places — all must be updated together:

- `src/parser.js`: `CURRENCY_SYMBOLS`, `CURRENCY_CODES`, and the symbol regex character class
- `src/rates.js`: `TARGET_CURRENCIES`, `convertPrice` values, and `normalizeRates`
- `src/settings.js`: `normalizeCurrency` whitelist
- `src/formatter.js`, `background.js` (`buildMenuTitle`), `popup.js` / `popup.html`: display rows
- `options.html`: default-currency `<select>` options
