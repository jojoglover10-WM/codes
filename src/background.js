let activeTabId = null;
let activeDomain = null;
let startedAt = null;

function domainFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function saveElapsedTime() {
  if (!activeDomain || !startedAt) return;

  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs <= 0) return;

  const { timeByDomain = {} } = await chrome.storage.local.get("timeByDomain");
  timeByDomain[activeDomain] = (timeByDomain[activeDomain] || 0) + elapsedMs;

  await chrome.storage.local.set({ timeByDomain });
  startedAt = Date.now();
}

async function setActiveTab(tab) {
  await saveElapsedTime();

  activeTabId = tab?.id ?? null;
  activeDomain = domainFromUrl(tab?.url ?? "");
  startedAt = activeDomain ? Date.now() : null;
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    await setActiveTab(tab);
  } catch {
    await setActiveTab(null);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    await setActiveTab(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await saveElapsedTime();
    activeDomain = null;
    startedAt = null;
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, windowId });
  await setActiveTab(tab);
});

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state !== "active") {
    await saveElapsedTime();
    activeDomain = null;
    startedAt = null;
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await setActiveTab(tab);
});

chrome.runtime.onStartup.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await setActiveTab(tab);
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.idle.setDetectionInterval(60);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await setActiveTab(tab);
});
