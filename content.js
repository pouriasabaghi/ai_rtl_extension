function setAutoDirection({ resultSelector }) {
  const elements = document.querySelectorAll(resultSelector);
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
