document.addEventListener("DOMContentLoaded", init);

/**
 * Normalize a user-entered URL down to its bare origin (protocol + host,
 * no path/query/hash), e.g. "https://monica.im/chat/page?x=1" -> "https://monica.im/".
 * This must happen before any permission request or key generation so
 * unrelated paths/queries never affect what access we ask for.
 */
function normalizeToOrigin(urlValue) {
  const parsed = new URL(urlValue);
  if (parsed.protocol !== "https:") {
    throw new Error("https-only");
  }
  return parsed.origin + "/";
}

function makeCustomKey(originUrl) {
  const host = new URL(originUrl).hostname.replace(/^www\./, "");
  return "custom-" + host.replace(/[^a-z0-9]/gi, "-");
}

function originPatternFor(originUrl) {
  const u = new URL(originUrl);
  return `${u.protocol}//${u.hostname}/*`;
}

function getPlatforms() {
  return new Promise((res) => {
    chrome.storage.local.get(["platforms"], (result) => res(result.platforms || []));
  });
}

function setPlatforms(platforms) {
  return new Promise((res) => {
    chrome.storage.local.set({ platforms }, res);
  });
}

function init() {
  const form = document.getElementById("customForm");
  const cancel = document.getElementById("customCancel");
  const errorEl = document.getElementById("customFormError");
  const submitBtn = document.getElementById("customSubmit");

  cancel.addEventListener("click", () => {
    window.close();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const name = document.getElementById("customName").value.trim();
    const urlValue = document.getElementById("customUrl").value.trim();
    const aiResponseSelector = document.getElementById("customResponseSelector").value.trim();
    const promptInputSelector = document.getElementById("customPromptSelector").value.trim();

    let originUrl;
    try {
      originUrl = normalizeToOrigin(urlValue);
    } catch {
      showError("آدرس سایت باید با https شروع شود و معتبر باشد.");
      return;
    }

    submitBtn.disabled = true;
    try {
      await addCustomSite({
        name,
        url: originUrl,
        aiResponseSelector,
        promptInputSelector,
      });
      window.close();
    } catch (err) {
      showError(err.message || "افزودن سایت با خطا مواجه شد.");
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

async function addCustomSite({ name, url, aiResponseSelector, promptInputSelector }) {
  const originPattern = originPatternFor(url);
  const key = makeCustomKey(url);

  const platforms = await getPlatforms();
  if (platforms.some((p) => p.key === key)) {
    throw new Error("این سایت قبلا اضافه شده است.");
  }

  const granted = await chrome.permissions.request({ origins: [originPattern] });
  if (!granted) {
    throw new Error("دسترسی به این سایت تایید نشد.");
  }

  await chrome.scripting.registerContentScripts([
    {
      id: key,
      matches: [originPattern],
      js: ["content.js"],
      runAt: "document_idle",
    },
  ]);

  const newPlatform = {
    key,
    name,
    url,
    aiResponseSelector,
    promptInputSelector: promptInputSelector || undefined,
    isCustom: true,
    rtl: true,
  };

  await setPlatforms([...platforms, newPlatform]);

  // registerContentScripts only affects future page loads/navigations of
  // matching tabs. If a tab for this domain is already open, inject the
  // script into it right away so the site works without a manual reload.
  await injectIntoOpenTabs(originPattern);
}

async function injectIntoOpenTabs(originPattern) {
  let tabs = [];
  try {
    tabs = await chrome.tabs.query({ url: originPattern });
  } catch {
    return;
  }

  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    } catch {
      // Ignore tabs where injection isn't possible (e.g. not yet loaded).
    }
  }
}
