document.addEventListener("DOMContentLoaded", rtlManager);
document.addEventListener("DOMContentLoaded", setupTheme);

let platforms = [];
async function rtlManager() {
  platforms = await getPlatforms();

  platforms.forEach(({ key, aiResponseSelector, rtlConflictFixerStyle, rtl, promptInputSelector, url }) => {
    setupRTL(key, aiResponseSelector, rtlConflictFixerStyle, rtl, promptInputSelector);
    setupPlatformLink(key, url);
  });
}

function setupPlatformLink(platform, url) {
  const container = document.querySelector(`.${platform}`);
  if (!container || !url) return;

  const link = container.querySelector(".platform-row__link");
  if (link) {
    link.href = url;
  }
}

async function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const stored = await getTheme();
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (systemPrefersDark ? "dark" : "light");

  applyTheme(theme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getTheme() {
  return new Promise((res) => {
    chrome.storage.local.get(["theme"], (result) => res(result.theme));
  });
}

function setTheme(theme) {
  chrome.storage.local.set({ theme });
}

/**
 * Setup the RTL switch for the given platform.
 * @param {string} platform - The platform key, e.g. it need to be the same as  section class name in index.html like "deepseek", "chatgpt".
 * @param {string} aiResponseSelector - The CSS selector for the AI response element.
 * @param {string} rtlConflictFixerStyle - The CSS to inject to fix RTL conflicts if needed.
 * @param {boolean} rtl - The initial state of the RTL switch.
 */
function setupRTL(platform, aiResponseSelector, rtlConflictFixerStyle, rtl, promptInputSelector) {
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
        promptInputSelector,
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
        promptInputSelector,
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