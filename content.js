function setAutoDirection() {
  const elements = document.querySelectorAll(".ds-markdown");
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
    </stye>`
  );

  let observer;

  if (request.action === "rtl") {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          setAutoDirection();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setAutoDirection();
  } else {
    stopObserverAndReset(observer);
  }
});
