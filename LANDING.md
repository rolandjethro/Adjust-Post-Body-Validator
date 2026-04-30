# Adjust S2S Events Inspector Landing Page Content

## 1. Hero Section
**Daam Context:** Elevate your Marketing Tech stack with Daam’s specialized precision diagnostics for Adjust S2S implementations.

**Title:** 
Instant Validation. Correct Mapping. Compliant Data.

**Description:**
Transform your raw Adjust query strings into readable, validated insights instantly. This tool helps you catch formatting errors and parameter mismatches before they impact your attribution. Ensure your server-side events are firing perfectly with zero guesswork.

---

## 2. Overview: Mastering Adjust S2S Events
Adjust's [S2S (Server-to-Server) Events API](https://dev.adjust.com/en/api/s2s-api/events/) is the backbone of modern conversion tracking, but its raw query format is notoriously difficult to debug manually. 

**The Problem:** Manually inspecting URL-encoded post bodies is time-consuming and prone to human error. Furthermore, many implementations lack **Adjust Server Callbacks**, leaving developers "in the dark" about whether an event was actually accepted or rejected by Adjust's servers.

**The Daam Solution:** We built this inspector as a critical **pre-flight validation tool**. It allows you to:
1.  **Validate before sending:** Catch errors in your sGTM or backend logic *before* the data ever reaches Adjust.
2.  **Debug without Callbacks:** If you don't have server callbacks implemented on Adjust, this tool acts as your feedback loop, showing you exactly what Adjust expects to see.

This is an essential utility for Marketing Technologists using **server-side Google Tag Manager (sGTM)** or custom backend integrations who require 100% data accuracy.


---

## 3. Key Features
*   **Intelligent Dictionary Mapping:** Upload your event list CSV to automatically map cryptic event tokens to human-readable names.
*   **Real-Time Validation:** Instant checks for mandatory Adjust parameters, device identifiers (adid, idfa, etc.), and currency formats.
*   **Persistent Session History:** Review your last 15 tests in a dual-view window showing both the raw input and the parsed results.
*   **App Token Guard:** Strict value matching for your Adjust App Token to prevent cross-app data pollution.
*   **Premium UX:** Toggle between **Dark and Light modes** for comfortable debugging in any environment.
*   **One-Click Copy:** Independent buttons to grab either the raw postbody or the formatted JSON results for your documentation.

---

## 4. How to Use: A Beginner’s Guide
Debugging your Adjust events is as easy as 1-2-3:

1.  **Set Your Dictionary:** Click the "Dictionary" button. Paste your **Adjust App Token** and upload your event tokens CSV (Token, Name) to enable smart mapping.
2.  **Paste Your Postbody:** Copy the raw query string from your sGTM preview mode or server logs and paste it into the "Raw Query String" box.
3.  **Analyze Results:** Click "Process & Validate." Review the "Compliance Alerts" at the top to see if your event is PASSED or FAILED. Any errors will be highlighted in red with clear instructions on what to fix.

---

## 5. Understanding Validation Messages
*   **"PASSED":** Your payload meets all Adjust S2S formatting and compliance requirements.
*   **"FAILED":** One or more critical errors were found that would prevent Adjust from processing this event.
*   **"Missing required parameters":** You are missing a core field like `s2s`, `app_token`, or `event_token`.
*   **"Compliance Failed: App Token mismatch":** The token in your payload does not match the token set in your dictionary—a common cause of attribution failure.
*   **"Dictionary Error: Token not found":** The event token exists in the payload but isn't in your uploaded dictionary list.
*   **"Device Identifier Warning":** No valid ID (adid, idfa, etc.) was found. While the event might fire, it won't attribute to a specific user.

---

## 6. Conclusion & Resources
Ready to streamline your Adjust implementation? Start inspecting now or contribute to the project on GitHub.

*   **[Launch Adjust S2S Events Inspector](https://daam.com.sa/tools/adjust-s2s-events-api-inspector/)**
*   **[View on GitHub](https://github.com/rolandjethro/Adjust-Post-Body-Inspector)**

---

## 7. Let’s Talk Marketing Tech
**Optimize Your Measurement Strategy**
Implementing sGTM or Adjust S2S and not seeing the results you expect? The Daam Team specializes in technical SEO, data tracking, and marketing automation.

[Check Us Out at Daam.com.sa](https://daam.com.sa/) | [Contact Our Experts](https://daam.com.sa/#contact)
