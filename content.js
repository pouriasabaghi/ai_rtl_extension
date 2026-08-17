document.head.insertAdjacentHTML(
  "beforeend",
  `<style>
    pre,code{ direction:ltr !important;text-align:left !important;} 
  </style>`
);

function setAutoDirection({ aiResponseSelector, promptInputSelector }) {
  const elements = document.querySelectorAll(aiResponseSelector);
  elements.forEach((element) => {
    if (!element.hasAttribute("dir") || element.getAttribute("dir") !== "rtl") {
      element.setAttribute("dir", "rtl");
    }
  });

  promptInputSelector &&
  document.querySelector(promptInputSelector)?.setAttribute("dir", "auto");
}

const observersByPlatform = new Map();

function stopObserverAndReset(platform) {
  const observer = observersByPlatform.get(platform);
  if (observer) {
    observer.disconnect();
    observersByPlatform.delete(platform);
  }

  const elements = document.querySelectorAll('[dir="rtl"]');
  elements.forEach((element) => {
    element.removeAttribute("dir");
  });
}

async function getPlatforms() {
  return new Promise(async function (res, rej) {
    chrome.storage.local.get(["platforms"], async function (result) {
      const platforms = result.platforms;
      res(platforms);
    });
  });
}

function createObserver(request) {
  const existing = observersByPlatform.get(request.platform);
  if (existing) {
    existing.disconnect();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        setAutoDirection(request);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setAutoDirection(request);

  request.rtlConflictFixerStyle &&
    document.head.insertAdjacentHTML(
      "beforeend",
      request.rtlConflictFixerStyle
    );

  observersByPlatform.set(request.platform, observer);

  return observer;
}

async function autoRTL() {
  const platforms = await getPlatforms();
  platforms.forEach(
    ({ key, aiResponseSelector, rtlConflictFixerStyle, rtl, promptInputSelector }) => {
      if (rtl) {
        createObserver({ platform: key, aiResponseSelector, rtlConflictFixerStyle, promptInputSelector });
      }
    }
  );
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "rtl") {
    createObserver(request);
  } else {
    stopObserverAndReset(request.platform);
  }
});

window.addEventListener("load", autoRTL);
