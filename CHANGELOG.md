# Changelog

All notable changes to the Adjust Post Body Inspector will be documented in this file.

## [1.2.0] - 2026-04-29

### Added

- **Strict App Token Validation**: Implemented mandatory `app_token` verification. Payloads are now validated against a user-defined token in the dictionary with specific mismatch alerts.
- **Enhanced History Diagnostics**:
    - **Error Counting**: History entries now display the specific number of compliance failures (e.g., "2 Compliance issues found").
    - **Dual-View Payload Inspection**: Added a split-view for history entries, showing both the raw "Pasted Postbody" and the "JSON Formatted" result.
    - **Independent Copy Controls**: Added separate copy buttons for raw input and JSON output within history cards.
- **Branded Footer**: Integrated a site-wide footer featuring the Daam logo, professional links, and a dynamic copyright year.
- **Safety Exit Guards**: Added a warning dialog to the Dictionary modal to prevent closing when the mandatory App Token field is empty.

### Improved

- **Responsive Navigation**: Re-engineered the navbar for better mobile utility. Replaced the toggler with a centered, equal-width button row below the title on small screens.
- **UI Refinement**: 
    - Redesigned the "Clear/Reset" button with a higher-contrast, light-red theme for better visibility.
    - Optimized mobile title font sizes to ensure one-line visibility on all devices.
- **History Labeling**: Simplified status indicators to a binary "PASSED" / "FAILED" logic for clearer communication.

### Fixed

- **Branding Consistency**: Wrapped the navbar logo in a direct link to the Daam homepage.
- **Mobile Overflow**: Fixed a text overflow issue in the navbar title for narrow mobile devices.

## [1.1.0] - 2024-05-22

### Added

- **GitHub Integration**: Added a direct link to the source repository in the navigation bar.
- **Real-time Dictionary Status**: UI now proactively blocks input if no event mappings are uploaded.
- **Truncation Detection**: Added logic to catch and flag incomplete JSON strings (common in copy-paste errors).
- **ADID Clipboard Support**: Added a functional "Copy to Clipboard" feature for the Adjust ADID.
- **Visual Preview**: Updated documentation with a high-resolution interface preview.

### Fixed

- **Data Persistence Flaw**: Implemented an Angular `effect` to automatically clear the textarea and results whenever the Event Dictionary is modified or cleared.
- **Parsing Safety**: Improved the recursive JSON formatter to handle malformed URL-encoded sequences gracefully.

### Changed

- **UI Priority**: Re-structured the results header to prioritize the **Event Token** and its **Mapping Status** over secondary device identifiers.
- **Navigation**: Updated navbar branding and added a Marketing Tech Diagnostic Tool subtitle.
