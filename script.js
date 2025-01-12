document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector(".switch__checkbox");
  const switchLabel = document.querySelector(".switch");

  const lastDirection = localStorage.getItem("direction") || "ltr" ;
  
  if(lastDirection === "rtl"){

    checkbox.checked = true;
    switchLabel.classList.add("active");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "rtl",
      });
    });
  }

  checkbox.addEventListener("change", handleDirection);
  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const direction = !checkbox.checked ? "ltr" : "rtl";

    localStorage.setItem("direction", direction);

    const request = {
      action: direction,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }
});
