document.addEventListener("DOMContentLoaded", rtlManager);

let platforms = [];
async function rtlManager() {
  platforms = await getPlatforms();

  platforms.forEach(({ key, aiResponseSelector, rtlConflictFixerStyle, rtl }) => {
    setupRTL(key, aiResponseSelector, rtlConflictFixerStyle, rtl);
  });
}

/**
 * Setup the RTL switch for the given platform.
 * @param {string} platform - The platform key, e.g. it need to be the same as  section class name in index.html like "deepseek", "chatgpt".
 * @param {string} aiResponseSelector - The CSS selector for the AI response element.
 * @param {string} rtlConflictFixerStyle - The CSS to inject to fix RTL conflicts if needed.
 * @param {boolean} rtl - The initial state of the RTL switch.
 */
function setupRTL(platform, aiResponseSelector, rtlConflictFixerStyle, rtl) {
  const container = document.querySelector(`.${platform}`);
  if (!container) return;

  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  // Set initial state based on storage
  if (rtl) {
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

    platforms.forEach(({ key }) => {
      if(key === platform){
        platforms.find(p => p.key === platform).rtl = direction === "rtl";
      }
    });
    setPlatforms(platforms);

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

async function getPlatforms(){
  return new Promise(async function (res, rej) {
    chrome.storage.local.get(['platforms'], async function (result) {
        var platforms = result.platforms;        
        res(platforms);
    });
  });
}

function setPlatforms(updatedPlatforms){
  chrome.storage.local.set({ platforms: updatedPlatforms }, function () {}); 
}