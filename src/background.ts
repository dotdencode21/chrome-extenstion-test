async function handleCaptureViewport(sendResponse: any) {
  try {
    const tab = await chrome.tabs.captureVisibleTab();
    sendResponse({ screenshot: tab });
  } catch (e) {
    console.error(e);
  }
}

async function handleCaptureScreen(sendResponse: any) {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const video = document.createElement("video");
    video.srcObject = mediaStream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const screenshot = canvas.toDataURL();
    sendResponse({ screenshot });

    mediaStream.getTracks().forEach((track) => track.stop());
  } catch (e) {
    console.error(e);
  }
}

async function handleMessage(message: any, sendResponse: any) {
  try {
    if (message.type === "captureViewport") {
      await handleCaptureViewport(sendResponse);
    }

    if (message.type === "captureScreen") {
      await handleCaptureScreen(sendResponse);
    }

    return true;
  } catch (e) {
    console.error(e);
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
