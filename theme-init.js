chrome.storage.local.get(["theme"], function (result) {
  var theme = result.theme || "dark";
  document.documentElement.setAttribute("data-theme", theme);
});
