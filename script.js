document.addEventListener("DOMContentLoaded", rtlManger);

function rtlManger() {
  const handler = {
    deepseek: deepseekRTL,
    chatgpt: chatgptRTL,
    copilot: copilotRTL,
  };

  for (const key in handler) {
    handler[key]();
  }
}

function deepseekRTL() {
  const CONTAINER_SELECTOR = ".deepseek";
  const RESULT_SELECTOR = ".ds-markdown";
  const DIRECTION_STORAGE_KEY = "deepseek_direction";

  const container = document.querySelector(CONTAINER_SELECTOR);
  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  const rtlConflictFixerStyle = `
  <style>
    pre{
        direction:ltr;
        text-align:left !important;
    }
    code{
        direction:ltr;
        display:inline-block;
        text-align:left !important;
    }
  </stye>`;


  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        resultSelector: RESULT_SELECTOR,
        origin: "deepseek",
        rtlConflictFixerStyle
      });
    });
  }

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    const request = {
      action: direction,
      resultSelector: RESULT_SELECTOR,
      origin: "deepseek",
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

  const container = document.querySelector(CONTAINER_SELECTOR);
  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  const rtlConflictFixerStyle = `
  <style>
    pre{
        direction:ltr !important;
        text-align:left !important;
    }
    code{
        direction:ltr !important;
        text-align:left !important;
    }
  </stye>`;

  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        resultSelector: RESULT_SELECTOR,
        origin: "chatgpt",
      });
    });
  }

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    const request = {
      action: direction,
      resultSelector: RESULT_SELECTOR,
      origin: "chatgpt",
      rtlConflictFixerStyle
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }

  checkbox.addEventListener("change", handleDirection);
}

function copilotRTL() {
  const CONTAINER_SELECTOR = ".copilot";
  const RESULT_SELECTOR = "[data-content='ai-message'] div";
  const DIRECTION_STORAGE_KEY = "copilot_direction";

  const container = document.querySelector(CONTAINER_SELECTOR);
  const checkbox = container.querySelector(".switch__checkbox");
  const switchLabel = container.querySelector(".switch");

  const lastDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";

  const rtlConflictFixerStyle = `
  <style>
    pre{
        direction:ltr;
        text-align:left !important;
    }
    code{
        direction:ltr;
        display:inline-block;
        text-align:left !important;
    }
  </stye>`;

  if (lastDirection === "rtl") {
    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
        resultSelector: RESULT_SELECTOR,
        origin: "copilot",
      });
    });
  }

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);

    const request = {
      action: direction,
      resultSelector: RESULT_SELECTOR,
      origin: "copilot",
      rtlConflictFixerStyle
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }

  checkbox.addEventListener("change", handleDirection);
}
