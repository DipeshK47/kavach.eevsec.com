# Kavach

Standalone website copied from the EEVSEC Services template. It has its own HTML, CSS, JavaScript, assets, and local static server.

The page includes code-native explainers for the service: a Collect → Customize → Act flow, audience-specific dashboard previews, and an accessible before/after comparison. `IMAGE_PROMPTS.md` contains optional prompts for future generated visuals.

## Run locally

```sh
cd /Users/dipeshkumar/Downloads/Kavach
npm run dev
```

Open <http://127.0.0.1:8010>.

The consultation form submits directly to Web3Forms from the browser. The local server only serves static files and does not store form data.

## Privacy and consent

- `/privacy.html` is the standalone services-site Privacy and Cookie Policy.
- `/js/consent.js` records the visitor's choice in the first-party `eevsec_consent` cookie for up to 12 months.
- The site currently has no analytics or advertising scripts. The optional Preferences choice only permits remembering the light/dark theme in local storage.
- The policy and consent behavior must be reviewed whenever the form provider, security services, analytics, advertising, or retention practices change. Have qualified counsel review the policy before production publication.
