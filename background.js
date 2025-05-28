let platforms = [
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
  {
    key: "qwen",
    aiResponseSelector: "#response-content-container",
    rtlConflictFixerStyle: ``,
  },
];

chrome.storage.local.get(["platforms"], async function (result) {
  if (result.platforms) {
    // Update rtl values from storage
    platforms = platforms.map(platform => {
      const storedPlatform = result.platforms.find(p => p.key === platform.key);
      return {
        ...platform,
        rtl: storedPlatform ? storedPlatform.rtl : false
      };
    });
  }
  
  // Save the updated platforms back to storage
  chrome.storage.local.set({ platforms: platforms }, function () {});
});
