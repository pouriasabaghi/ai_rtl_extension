document.head.insertAdjacentHTML(
  "beforeend",
  `<style>
    pre,code{ direction:ltr !important;text-align:left !important;} 
  </style>`
);

function setAutoDirection({ aiResponseSelector }) {
  const elements = document.querySelectorAll(aiResponseSelector);
  elements.forEach((element) => {
    if (!element.hasAttribute("dir") || element.getAttribute("dir") !== "rtl") {
      element.setAttribute("dir", "rtl");
    }
  });
}

function stopObserverAndReset(observer) {
  if (observer) {
    observer.disconnect();
  }

  const elements = document.querySelectorAll('[dir="rtl"]');
  elements.forEach((element) => {
    element.removeAttribute("dir");
  });
}

async function getPlatforms(){
  return new Promise(async function (res, rej) {
    chrome.storage.local.get(['platforms'], async function (result) {
        const platforms = result.platforms;        
        res(platforms);
    });
  });
}

function createObserver(request){
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

    return observer;
}

async function autoRTL(){
  const platforms = await getPlatforms();
  platforms.forEach(({ key, aiResponseSelector, rtlConflictFixerStyle, rtl }) => {
    if(rtl){
      createObserver({key, aiResponseSelector, rtlConflictFixerStyle});
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {    
  // Handle test message
  let observer;

  if (request.action === "rtl") {
    observer = createObserver(request);
  } else {
    stopObserverAndReset(observer);
  }
});

window.addEventListener('load', autoRTL);