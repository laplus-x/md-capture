# Background Service Worker for Testing

## Why introduced
The Playwright fixture `e2e/fixtures.ts` discovers the extension ID by querying `context.serviceWorkers()`. This requires the loaded MV3 extension to register a service worker, which only happens when a background entrypoint exists.

Without a background service worker:
- `context.serviceWorkers()` returns empty
- Extension ID cannot be determined deterministically
- Popup URL `chrome-extension://<id>/popup.html` cannot be constructed

## Product contract impact
`entrypoints/background.ts` exports `defineBackground(() => {})` – a no-op.
- No permissions are requested
- No network requests are made
- No UI changes are introduced
- Manifest `permissions` remain `['activeTab']` only

The service worker is technically present in the build but does not alter user-facing behavior, conversion logic, or CSP.

## Alternative considered
Discover extension ID via `chrome.runtime.id` evaluated inside the popup page. This would eliminate the need for a background worker but requires restructuring fixtures and tests to open the popup before ID resolution, increasing test complexity and coupling.

Current approach is minimal and documented. Removal is possible if fixture logic is refactored.
