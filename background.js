/**
 * @typedef {Object} Platform
 * @property {string} key - Unique key of the platform
 * @property {string} aiResponseSelector - CSS selector to find AI responses
 * @property {string} [rtlConflictFixerStyle] - Optional inline style to fix RTL conflicts
 * @property {string} [promptInputSelector] - Optional CSS selector for prompt input
 * @property {string} url - Link to the platform's website
 */

/** @type {Platform[]} */
let platforms = [
  {
    key: "deepseek",
    aiResponseSelector: ".ds-markdown",
    rtlConflictFixerStyle: ` <style>code{ display:inline-block; }</style>`,
    promptInputSelector: "#chat-input",
    url: "https://chat.deepseek.com/",
  },
  {
    key: "chatgpt",
    aiResponseSelector: ".markdown",
    promptInputSelector: "#prompt-textarea",
    url: "https://chatgpt.com/",
  },
  {
    key: "copilot",
    aiResponseSelector: "[data-content='ai-message'] div",
    rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`,
    url: "https://copilot.microsoft.com/",
  },
  {
    key: "aistudio",
    aiResponseSelector: ".chat-turn-container",
    promptInputSelector: "textarea.textarea",
    url: "https://aistudio.google.com/",
  },
  {
    key: "grok",
    aiResponseSelector: ".response-content-markdown p",
    url: "https://grok.com/",
  },
  {
    key: "claude",
    aiResponseSelector: ".font-claude-response-body",
    url: "https://claude.ai/",
  },
  {
    key: "monica",
    aiResponseSelector: ".__markdown",
    url: "https://monica.im/",
  },
  {
    key: "qwen",
    aiResponseSelector: "#response-content-container *:not(.code-cntainer):not(.code-cntainer *)",
    rtlConflictFixerStyle: `<style>#response-content-container *:not(.code-cntainer):not(.code-cntainer *){ unicode-bidi: embed;}</style>`,
    promptInputSelector: "#chat-input",
    url: "https://chat.qwen.ai/",
  },
  {
    key: "arena",
    aiResponseSelector: ".prose",
    rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`,
    promptInputSelector: "textarea[name='message']x",
    url: "https://arena.ai/",
  },
];

chrome.storage.local.get(["platforms"], async function (result) {
  const storedPlatforms = result.platforms || [];

  // Default to enabled (rtl: true) so the extension works out of the box.
  // Platforms already configured by the user keep their stored value,
  // new platforms (not yet in storage) default to enabled.
  platforms = platforms.map((platform) => {
    const storedPlatform = storedPlatforms.find((p) => p.key === platform.key);
    return {
      ...platform,
      rtl: storedPlatform ? storedPlatform.rtl : true,
    };
  });

  // Custom sites added by the user aren't part of the static list above,
  // keep them as-is so they survive this normalization pass.
  const customPlatforms = storedPlatforms.filter((p) => p.isCustom);
  platforms = [...platforms, ...customPlatforms];

  // Save the updated platforms back to storage
  chrome.storage.local.set({ platforms: platforms }, function () {});
});
