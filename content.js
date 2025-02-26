function setAutoDirection({ aiResponseSelector }) {
  const elements = document.querySelectorAll(aiResponseSelector);
  elements.forEach((element) => {
    if (!element.hasAttribute("dir")) {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let observer;
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
      pre{ direction:ltr !important;text-align:left !important;} 
      code{ direction:ltr; text-align:left !important;}
    </style>`
  );
  if (request.action === "rtl") {
    observer = new MutationObserver((mutations) => {
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
  } else {
    stopObserverAndReset(observer);
  }
});
