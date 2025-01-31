function openEditor(screenshot: string) {
  const url = chrome.runtime.getURL("editor.html");
  chrome.tabs.create({ url: `${url}?image=${encodeURIComponent(screenshot)}` });
}

type CaptureType = "captureViewport" | "captureScreen";
async function handleCapture(type: CaptureType) {
  chrome.runtime.sendMessage({ type }, (response) => {
    openEditor(response.screenshot);
  });
}

document.getElementById("captureViewport")?.addEventListener("click", () => handleCapture("captureViewport"));

document.getElementById("captureScreen")?.addEventListener("click", () => handleCapture("captureScreen"));
