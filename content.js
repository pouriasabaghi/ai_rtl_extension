chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
    pre{
        direction:ltr;
    }
    </stye>`
  );
  if (request.action === "rtl") {
    document.body.style.direction = "rtl";
    document.body.setAttribute(dir, "rtl");
  } else {
    document.body.style.direction = "ltr";
    document.body.setAttribute(dir, "ltr");
  }
});
