# Adjust S2S Events Inspector (v1.3.0)

A specialized **Marketing Tech Diagnostic Tool** designed by [Daam Team](https://daam.com.sa) to validate and inspect Adjust S2S (Server-to-Server) post bodies. This tool ensures that your event data meets Adjust's strict compliance standards before you send it to their production environment.

---

## Visual Preview

![Adjust S2S Events Inspector Interface](./public/assets/images/preview.png)

## 🔗 Live Deployment

**Access the live tool here:** [https://daam.com.sa/adjust-s2s-events-inspector/](https://daam.com.sa/adjust-s2s-events-inspector/)

## Navigation

The application is structured into four primary functional areas:

### 1. Input Panel (Left)

- **Textarea**: Paste your raw Adjust query string here.
- **Process & Validate**: Triggers the parsing and compliance check logic.
- **Reset (Icon)**: A high-contrast red button to clear all current inputs and results.

### 2. Inspector Results (Right)

- **Dictionary Required State**: A safety screen shown when no event mappings are loaded.
- **Empty State**: Prompting the user to paste a string once the dictionary is ready.
- **Compliance Alerts**: Instant feedback on App Token matching, required parameters, and device IDs.
- **Results View**: Displays the Event Token, Mapping Status, and the formatted JSON tree.

### 3. History Section (Bottom)

- **Dual-View Inspection**: Review both the **Raw Postbody** and the **JSON Formatted** data for your last 15 tests.
- **Error Counting**: See exactly how many compliance issues were found for each failed attempt.
- **Independent Copying**: Separate controls to copy raw strings or JSON results back to your clipboard.

### 4. Global Tools & Branding

- **Navbar**: Access the **Event Dictionary**, **Theme Toggle**, and **GitHub Repo**. The logo links directly to [daam.com.sa](https://daam.com.sa).

---

## Tools & Technologies Used

This application is built with a modern web stack for high performance and real-time reactivity:

- **Angular (v17+)**: Core framework utilizing **Signals** for state management.
- **Bootstrap 5.3**: Responsive layout and UI components with customized branding.
- **Bootstrap Icons**: Intuitive visual status indicators for compliance checks.
- **NgbModal**: Powers the CSV upload and dictionary management interface.
- **Animate.css**: Smooth transitions for alerts and history entries.
- **TypeScript**: Ensures strict type safety for validation logic.

---

## Key Features (v1.2.0)

- **App Token Guard**: Strict validation against a user-defined Adjust App Token to prevent cross-app testing errors.
- **Intelligent Dictionary Mapping**: Automatically maps event tokens to human-readable names via CSV upload.
- **Smart Platform Detection**: Identifies **Android** or **iOS** based on the User Agent string and enforces platform-specific rules (e.g., `gps_adid` vs `idfv`).
- **Revenue Enforcement**: Checks root-level `revenue` and `currency` for purchase events.
- **Compliance Counter**: Clearly labels the number of failures (e.g., "2 Compliance issues found") in your history logs.
- **ADID & JSON Quick-Copy**: Easy access to the data you need for further troubleshooting.

---

## How to Use

### 1. Set Up Your Dictionary (Mandatory)

1.  Click **"Dictionary"** in the navbar.
2.  **Adjust App Token**: Enter your specific app token. This is required for full validation.
3.  **Upload CSV**: Download the event's .csv file from your Adjust App account ( Example: https://suite.adjust.com/apps/<app_token>/events ). Upload that .csv file for event mapping.  
4.  The "Inspector Results" will now unlock.

### 2. Paste & Process

1.  Copy your raw Adjust post body string from your server logs or sGTM preview.
2.  Paste it into the **Raw Query String** box.
3.  Click **Process & Validate**.

### 3. Review Results

1.  **Check Status**: Look for the **PASSED** (Green) or **FAILED** (Red) badge.
2.  **Analyze Errors**: If it failed, read the specific messages (e.g., "App Token mismatch" or "Missing event_token").
3.  **Inspect History**: Scroll down to compare your current test with previous attempts using the dual-view cards.

---

## Common Validation Alerts

- **App Token Mismatch**: The token in the payload does not match the one set in your dictionary.
- **Dictionary Error**: The event token provided is not in your uploaded CSV.
- **Environment Error**: The string contains an invalid environment (expected `production` or `sandbox`).
- **Device Identifier Warning**: No valid ID (`adid`, `gps_adid`, `idfa`, `idfv`) was found.

---

Created by [Daam Team](https://daam.com.sa).
