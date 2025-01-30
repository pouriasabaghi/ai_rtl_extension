function setAutoDirection(resultSelector) {
  const elements = document.querySelectorAll(resultSelector);
  elements.forEach((element) => {
    if (!element.hasAttribute("dir")) {
      element.setAttribute("dir", "auto");
    }
  });
}

function stopObserverAndReset(observer) {
  if (observer) {
    observer.disconnect();
  }

  const elements = document.querySelectorAll('[dir="auto"]');
  elements.forEach((element) => {
    element.removeAttribute("dir");
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
    pre{
        direction:ltr;
    }
    code{
        direction:ltr;
    }
    </stye>`
  );

  let observer;
console.log(request.resultSelector);

  if (request.action === "rtl") {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          setAutoDirection(request.resultSelector);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setAutoDirection(request.resultSelector);
  } else {
    stopObserverAndReset(observer);
  }
});
