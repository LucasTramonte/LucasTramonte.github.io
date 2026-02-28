# Logs (optional)

This folder contains local audit notes and build logs.

For content-only edits, this folder can be ignored.

Suggested conventions:
- `build.log` for build output snapshots.
- `runtime.log` for local runtime checks.
- `qa-notes.md` for manual validation notes.

Only documentation files should be committed. Runtime `.log` files are ignored by Git.

## Build audit logs

Run from the repository root:

- `npm run build:audit` → creates `logs/build_production_<timestamp>.log`
- `npm run dev:audit` → creates `logs/build_development_<timestamp>.log`

Each line uses an ISO-8601 timestamp.

## Runtime diagnostics (optional)

The project includes a small debug logger for key events:
- `theme:init`
- `theme:toggle`
- `modal:open`
- `modal:close-all`
- runtime errors (`runtime:error`, `runtime:unhandledrejection`)

Enable in browser console:

`localStorage.setItem('debug', '1')`

Disable:

`localStorage.removeItem('debug')`

Important:
- Runtime diagnostics are shown in browser DevTools console, not as files in this folder.
- File logs in this folder are created only by `build:audit` and `dev:audit` scripts.
- If Node/npm is not installed, build audit scripts cannot run.
