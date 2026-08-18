document.addEventListener("DOMContentLoaded", rtlManager);
document.addEventListener("DOMContentLoaded", setupTheme);
document.addEventListener("DOMContentLoaded", setupCustomAddButton);

let platforms = [];
async function rtlManager() {
  platforms = await getPlatforms();

  platforms.forEach((platform) => {
    if (platform.isCustom) {
      renderCustomRow(platform);
    }
  });

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
  const theme = stored || "dark";

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

/* ===== CUSTOM AI SITES ===== */

function makeCustomKey(url) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return "custom-" + host.replace(/[^a-z0-9]/gi, "-");
}

function originPatternFor(url) {
  const u = new URL(url);
  return `${u.protocol}//${u.hostname}/*`;
}

function renderCustomRow(platform) {
  const list = document.getElementById("customList");
  if (!list || document.querySelector(`.${platform.key}`)) return;

  const initial = (platform.name || platform.url || "?").trim().charAt(0);

  const section = document.createElement("section");
  section.className = `platform-row ${platform.key}`;

  const link = document.createElement("a");
  link.className = "platform-row__link";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.href = platform.url;

  const icon = document.createElement("span");
  icon.className = "custom-row__icon";
  icon.textContent = initial;

  const name = document.createElement("span");
  name.className = "platform-row__name";
  name.textContent = platform.name;

  link.append(icon, name);

  const label = document.createElement("label");
  label.className = "switch";
  label.innerHTML = `
    <span class="switch__trigger"></span>
    <span class="switch__status">On</span>
    <input class="switch__checkbox" type="checkbox" />
  `;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "custom-row__remove";
  removeBtn.title = "حذف";
  removeBtn.setAttribute("aria-label", "حذف");
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => removeCustomSite(platform.key));

  section.append(link, label, removeBtn);
  list.appendChild(section);
}

function setupCustomAddButton() {
  const openTabBtn = document.getElementById("customAddOpenTab");
  if (!openTabBtn) return;

  openTabBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("custom-site.html") });
  });
}

async function removeCustomSite(key) {
  const platform = platforms.find((p) => p.key === key);
  if (!platform) return;

  try {
    await chrome.scripting.unregisterContentScripts({ ids: [key] });
  } catch {
    // Script might not be registered (e.g. added in a previous session
    // before a browser restart cleared it); ignore and continue cleanup.
  }

  try {
    await chrome.permissions.remove({ origins: [originPatternFor(platform.url)] });
  } catch {
    // Non-fatal if the permission was already revoked elsewhere.
  }

  platforms = platforms.filter((p) => p.key !== key);
  setPlatforms(platforms);

  const row = document.querySelector(`.${key}`);
  if (row) row.remove();
}