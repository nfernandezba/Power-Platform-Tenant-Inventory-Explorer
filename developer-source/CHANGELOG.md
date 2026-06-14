# Changelog

All public releases remain identified as **v1.0** unless the repository owner explicitly requests a version change.

## v1.0 — Power Platform API HTTP 400 compatibility update

- Replaced the mandatory Overview aggregation with the Microsoft-documented summary pattern grouped by resource type and region.
- Moved the Environment ID aggregation into an optional, isolated query so its failure cannot block the main Overview.
- Clamped all Inventory API query-option page sizes to the Azure Resource Graph maximum of 1,000 records.
- Added query names to all Inventory API calls.
- Added safe diagnostics for failed queries: service message, endpoint, correlation ID, query name, and submitted JSON body.
- Confirmed that diagnostics never include access tokens or authorisation headers.
- Added automated tests covering HTTP 400 diagnostics, page-size clamping, and the non-fatal environment aggregation fallback.
- Fixed `overview-environments` by sorting on the simple `displayNameSort` alias before projecting nested environment properties.
- Applied the same alias-before-projection pattern to recent-resource and per-resource-type date sorting to prevent equivalent tenant-side `InvalidExpressionKey` errors.
- Replaced the Copilot Studio book thumbnails with the supplied Spanish and English cover artwork.
- Changed web and PDF cover thumbnails to a full 4:5 aspect ratio and non-cropping image fit.
- Kept the public and package versions fixed at v1.0 / 1.0.0.
