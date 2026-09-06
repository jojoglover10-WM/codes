# Chrome Time Tracker

A simple Chrome extension that tracks how much time you spend on websites.

## Project structure

```text
.
├── manifest.json
├── README.md
└── src
    ├── background.js
    └── popup
        ├── popup.html
        ├── popup.css
        └── popup.js
```

## Run it in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Clone or download this repository.
4. Click **Load unpacked**.
5. Select the repository folder (the folder containing `manifest.json`).
6. Browse normally, then click the extension icon to see tracked website time.

## What each file does

- `manifest.json` — tells Chrome how the extension works and which permissions it needs.
- `src/background.js` — watches the active tab and stores elapsed time by website.
- `src/popup/popup.html` — popup structure.
- `src/popup/popup.css` — popup styling.
- `src/popup/popup.js` — reads stored usage data and displays it.

## Next ideas

Add daily resets, charts, a dashboard page, website categories, and optional time limits.
