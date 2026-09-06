function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

async function render() {
  const { timeByDomain = {} } = await chrome.storage.local.get("timeByDomain");
  const sites = document.getElementById("sites");
  const empty = document.getElementById("empty");

  const entries = Object.entries(timeByDomain)
    .sort(([, a], [, b]) => b - a);

  empty.hidden = entries.length > 0;

  for (const [domain, milliseconds] of entries) {
    const row = document.createElement("div");
    row.className = "site-row";

    const name = document.createElement("span");
    name.className = "domain";
    name.textContent = domain;

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = formatDuration(milliseconds);

    row.append(name, time);
    sites.appendChild(row);
  }
}

render();
