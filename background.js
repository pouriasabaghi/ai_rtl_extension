/**
 * @typedef {Object} Platform
 * @property {string} key - Unique key of the platform
 * @property {string} aiResponseSelector - CSS selector to find AI responses
 * @property {string} [rtlConflictFixerStyle] - Optional inline style to fix RTL conflicts
 * @property {string} [propmtInputSelector] - Optional CSS selector for prompt input
 */

/** @type {Platform[]} */
let platforms = [
  {
    key: "deepseek",
    aiResponseSelector: ".ds-markdown",
    rtlConflictFixerStyle: ` <style>code{ display:inline-block; }</style>`,
    propmtInputSelector: "#chat-input",
  },
  {
    key: "chatgpt",
    aiResponseSelector: ".markdown",
    propmtInputSelector: "#prompt-textarea",
  },
  {
    key: "copilot",
    aiResponseSelector: "[data-content='ai-message'] div",
    rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`,
  },
  {
    key: "aistudio",
    aiResponseSelector: ".chat-turn-container",
    propmtInputSelector: "textarea.textarea",
  },
  {
    key: "grok",
    aiResponseSelector: ".response-content-markdown p",
  },
  {
    key: "claude",
    aiResponseSelector: "[data-is-streaming]",
  },
  {
    key: "thebai",
    aiResponseSelector: "#html2canvas",
  },
  {
    key: "monica",
    aiResponseSelector: ".__markdown",
  },
  {
    key: "qwen",
    aiResponseSelector: "#response-content-container *:not(.code-cntainer):not(.code-cntainer *)",
    rtlConflictFixerStyle: `<style>#response-content-container *:not(.code-cntainer):not(.code-cntainer *){ unicode-bidi: embed;}</style>`,
    propmtInputSelector: "#chat-input",
  },
];

chrome.storage.local.get(["platforms"], async function (result) {
  if (result.platforms) {
    // Update rtl values from storage
    platforms = platforms.map((platform) => {
      const storedPlatform = result.platforms.find(
        (p) => p.key === platform.key
      );
      return {
        ...platform,
        rtl: storedPlatform ? storedPlatform.rtl : false,
      };
    });
  }

  // Save the updated platforms back to storage
  chrome.storage.local.set({ platforms: platforms }, function () {});
});
