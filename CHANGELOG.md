# Changelog

All notable changes to the Adjust Post Body Inspector will be documented in this file.

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
