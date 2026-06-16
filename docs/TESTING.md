# Testing

## Automated source tests

The source project was validated with Vitest: **7 files and 55 tests passed**. The public package contains the test evidence rather than the development source.

## Test mode

Use either query string:

```text
?test=1
?mode=test
```

Expected behaviour:

- Authentication is bypassed.
- Demonstration inventory and administrative datasets are loaded.
- Owners use demonstration display names.
- Tenant Governance, DLP and Managed Environment Settings are available.
- The page exposes the current-report export and packaged sample-report download.

## Connection hero contract

On the unauthenticated connection screen, verify:

- Exactly one primary H1 is present.
- The local `assets/icons/coe-toolkit-logo.svg` appears directly above the H1.
- No “CoE Toolkit” text appears between the icon and title.
- The icon is 78 × 78 pixels and has no glow, shadow, background effect, filter, or animation.
- The hero is centred in a maximum-width 900px container.
- Spanish and English use the same structure and allow the title to wrap naturally.

## Evidence files

- `tests/static-validation.json`: structural, path and version checks.
- `tests/browser-flow-results.json`: headless browser flow and console results.
- `tests/sample-download-results.json`: packaged PDF availability and signature check.

## Browser execution note

The package includes a static browser-flow contract result. Chromium navigation could not be executed in the artifact sandbox because it is blocked by administrator policy. Repeat the documented test-mode flow after GitHub Pages deployment.
