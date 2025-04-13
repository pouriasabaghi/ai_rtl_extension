document.addEventListener("DOMContentLoaded", rtlManager);

function rtlManager() {
  const platforms = [
    {
      key: "deepseek",
      aiResponseSelector: ".ds-markdown",
      rtlConflictFixerStyle: ` <style>code{ display:inline-block; }</style>`,
    },
    {
      key: "chatgpt",
      aiResponseSelector: ".markdown",
      rtlConflictFixerStyle: null,
    },
    {
      key: "copilot",
      aiResponseSelector: "[data-content='ai-message'] div",
      rtlConflictFixerStyle: `<style>code{ display:inline-block; }</style>`,
    },
    {
      key: "aistudio",
      aiResponseSelector: ".chat-turn-container",
      rtlConflictFixerStyle: ``,
    },
    {
      key: "grok",
      aiResponseSelector: ".message-bubble",
      rtlConflictFixerStyle: ``,
    },
    {
      key: "claude",
      aiResponseSelector: "[data-is-streaming]",
      rtlConflictFixerStyle: ``,
    },
    {
      key: "thebai",
      aiResponseSelector: "#html2canvas",
      rtlConflictFixerStyle: ``,
    },
    {
      key: "monica",
      aiResponseSelector: ".__markdown",
      rtlConflictFixerStyle: ``,
    },
  ];

  platforms.forEach(({ key, aiResponseSelector, rtlConflictFixerStyle }) => {
    setupRTL(key, aiResponseSelector, rtlConflictFixerStyle);
  });
}

/**
 * Setup the RTL switch for the given platform.
 * @param {string} platform - The platform key, e.g. it need to be the same as  section class name in index.html like "deepseek", "chatgpt".
 * @param {string} aiResponseSelector - The CSS selector for the AI response element.
 * @param {string} rtlConflictFixerStyle - The CSS to inject to fix RTL conflicts if needed.
 */
function setupRTL(platform, aiResponseSelector, rtlConflictFixerStyle) {
  const DIRECTION_STORAGE_KEY = `${platform}_direction`;

  const container = document.querySelector(`.${platform}`);
  if (!container) return;

  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        platform,
        aiResponseSelector,
        rtlConflictFixerStyle,
      });
    });
  }

  checkbox.addEventListener("change", function (e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = checkbox.checked ? "rtl" : "ltr";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: direction,
        platform,
        aiResponseSelector,
        rtlConflictFixerStyle,
      });
    });
  });
}
