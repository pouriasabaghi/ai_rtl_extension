document.addEventListener("DOMContentLoaded", rtlManger);

function rtlManger() {
  const handler = {
    deepseek: deepseekRTL,
    chatgpt: chatgptRTL,
  };

  for (const key in handler) {
    handler[key]();
  }
}


function deepseekRTL() {
  const CONTAINER_SELECTOR = ".deepseek";
  const RESULT_SELECTOR = ".ds-markdown";
  const DIRECTION_STORAGE_KEY = "deepseek_direction";

  const container  = document.querySelector(CONTAINER_SELECTOR);
  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        resultSelector:RESULT_SELECTOR,
      });
    });
  }

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    const request = {
      action: direction,
      resultSelector:RESULT_SELECTOR,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }

  checkbox.addEventListener("change", handleDirection);
}

function chatgptRTL() {
  const CONTAINER_SELECTOR = ".chatgpt";
  const RESULT_SELECTOR = ".markdown";
  const DIRECTION_STORAGE_KEY = "chatgpt_direction";

  const container  = document.querySelector(CONTAINER_SELECTOR);
  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        resultSelector:RESULT_SELECTOR,
      });
    });
  }

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    const request = {
      action: direction,
      resultSelector:RESULT_SELECTOR,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }

  checkbox.addEventListener("change", handleDirection);
}

