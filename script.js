document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector(".switch__checkbox");
  const trigger = document.querySelector(".switch__trigger");

  checkbox.addEventListener("change", handleDirection);

  function handleDirection(e) {
    e.target.closest(".switch").classList.toggle("active");

    const request = {
      action: !checkbox.checked ? "ltr" : "rtl",
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request);
    });
  }
});
