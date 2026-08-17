chrome.storage.local.get(["theme"], function (result) {
  var theme = result.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
});
