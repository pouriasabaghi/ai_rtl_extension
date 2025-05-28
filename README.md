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
- Automatic rtl

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

Contributing to this project is very easy there is only few steps

- 1 - You need duplicated one of sections in index.html and give it a unique class name:

```html
<section class="custom-ai">...</section>
```

- 2 - Add your ai unique class name as key to platforms array in background.js

```javascript
  let platforms = [
    {
      key: "custom-ai",
    },
  ];
```

- 3 - You need to find right selector for ai response for example in chatgpt is .markdown and add it to aiResponseSelector

```javascript
  let platforms = [
    {
      key: "custom-ai",
      aiResponseSelector: ".custom-ai-markdown", // this can be any valid selector
    },
  ];
```

- 4 - Maybe after changing page direction we need some fixing style for better experience you can add your style to rtlConflictFixerStyle

```javascript
  let platforms = [
    {
      key: "custom-ai",
      aiResponseSelector: ".custom-ai-markdown",
      rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`,
    },
  ];
```

- 5 - Styling is optional step but you can create a logo for your custom ai and add it to logo directory and link it to your section in style.css and change modifiers

```css
/* ===== MODIFIERS ===== */

/* CustomAI */
.custom-ai {
  background-image: url(./logo/custom-ai-logo.svg);
}
.custom-ai .switch.active {
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 78%);
}
.custom-ai .switch__status {
  color: #000;
}
.custom-ai .switch.active .switch__trigger {
  background-color: #000;
}
```

Feel free to fork the repository and submit pull requests for any enhancements or bug fixes. Contributions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
