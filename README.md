# AI RTL Extension

**AI RTL** is a Chrome extension that makes the AI websites fully RTL-compatible, improving the experience for right-to-left language users.

## Screenshot

![ai rtl extension](https://raw.github.com/pouriasabaghi/ai_rtl_extension/main/screenshot.png)

## V2

- **DeepSeek RTL** we also added RTL support to the DeepSeek website.
- **ChatGPT RTL** we also added RTL support to the ChatGPT website.
- **Microsoft Copilot RTL** we also added RTL support to the Microsoft Copilot website.
- **AIStudio RTL** we also added RTL support to the AIStudio website.
- **GrokAI RTL** we also added RTL support to the Grok website.
- **Claude RTL** we also added RTL support to the Claude website.
- **TheB RTL** we also added RTL support to the TheB website.
- **Monica RTL** we also added RTL support to the Monica website.

## V3
- Automatic RTL
- Prompt input RTL

## V4
- Dark/Light theme
- Add your own custom AI site without editing any code: open the extension popup, click **"+ Add custom AI site"**, and it opens a dedicated tab (`custom-site.html`) where you can fill in:
  - **Site name** — any label you want.
  - **Site URL** — must start with `https`.
  - **AI response selector** — the CSS selector of the element that should be flipped to RTL (e.g. `.markdown`).
  - **Prompt input selector** (optional) — the CSS selector of the textbox where the user types their message.

  Submitting the form asks the browser for permission to run on that one domain only, then registers a content script for it dynamically (via `chrome.scripting.registerContentScripts`) and saves it to `chrome.storage.local`. No `manifest.json` or code changes are required, and the site shows up in the popup list with its own toggle and a remove (✕) button. This is personal to each user and isn't shared with anyone else, it's just a quick way to make a site RTL-friendly for yourself.

## Did we miss some AI website?
Feel free to open an issus

## Features

**RTL Compatibility For All AI Websites**

## Installation

- Directly install from chrome web store
  [AI RTL](https://chromewebstore.google.com/detail/ai-rtl/bnholfbcjkocimkdgnbfjhopklnedgim?hl=en-US&utm_source=ext_sidebar)

OR
- Clone this repository or [download zip file](https://github.com/pouriasabaghi/ai_rtl_extension/archive/refs/heads/main.zip)

```bash
git clone https://github.com/pouriasabaghi/ai_rtl_extention.git
```

- Open Chrome and go to the extensions page: chrome://extensions/.

- Enable Developer Mode in the top right corner.

- Click on Load unpacked and select the folder where you cloned the extension.

- The extension is now installed and ready to use!

## Contributing

Contributing a built-in AI site is simple, just a few steps:

- 1 - Add your platform's entry to the `platforms` array in `background.js`. This is the single source of truth; `key` must be a valid CSS class name and unique:

```javascript
let platforms = [
  {
    key: "custom-ai",
    aiResponseSelector: ".custom-ai-markdown", // CSS selector for the AI response element
    promptInputSelector: "#prompt-input", // optional: CSS selector for the prompt textbox
    rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`, // optional: fixes RTL rendering quirks
    url: "https://custom-ai.example.com/", // link used for the row and to open the site
  },
];
```

- 2 - Add the site's domain to `content_scripts.matches` in `manifest.json` so the content script actually runs there:

```json
"content_scripts": [
  {
    "matches": [
      "https://custom-ai.example.com/*"
    ],
    "js": ["content.js"]
  }
]
```

- 3 - Duplicate one of the `<section class="platform-row ...">` blocks in `index.html`, give it your platform's `key` as class name, and update the name shown in `.platform-row__name`:

```html
<section class="platform-row custom-ai">
  <a class="platform-row__link" target="_blank" rel="noopener noreferrer">
    <span class="platform-row__icon"></span>
    <span class="platform-row__name">Custom AI</span>
  </a>
  <label class="switch">
    <span class="switch__trigger"></span>
    <span class="switch__status">On</span>
    <input class="switch__checkbox" type="checkbox" />
  </label>
</section>
```

- 4 - Add a logo (SVG, ideally square) to the `logo/` directory and wire it up in `style.css` under `/* ===== PLATFORM ICONS ===== */`:

```css
.custom-ai .platform-row__icon {
  background-image: url(./logo/custom-ai-logo.svg);
}
```

If the logo is monochrome white (fades out on the light theme), add a fixed dark background so it stays visible in both themes:

```css
.custom-ai .platform-row__icon {
  background-image: url(./logo/custom-ai-logo.svg);
  background-color: #262a33;
}
```

If you don't have a logo yet, you can reuse the text-based fallback icon (the same one used for Arena/AI Studio) by adding your selector to that shared rule instead of writing a new one.

Feel free to fork the repository and submit pull requests for any enhancements or bug fixes. Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
