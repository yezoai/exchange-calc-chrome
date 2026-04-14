let timer = null;
let lastSelection = "";

document.addEventListener("selectionchange", scheduleSelectionReport, true);
document.addEventListener("mouseup", scheduleSelectionReport, true);
document.addEventListener("keyup", scheduleSelectionReport, true);

function scheduleSelectionReport() {
  window.clearTimeout(timer);
  timer = window.setTimeout(reportSelection, 120);
}

function reportSelection() {
  const selection = window.getSelection()?.toString().trim() ?? "";
  if (selection === lastSelection) {
    return;
  }

  lastSelection = selection;
  chrome.runtime.sendMessage({
    type: "exchange-calc:selection-changed",
    selection,
  });
}
