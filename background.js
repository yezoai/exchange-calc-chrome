import { formatResultText } from "./src/formatter.js";
import { parseSelection } from "./src/parser.js";
import { convertPrice, getRates } from "./src/rates.js";
import { getCacheTtlMs, getSettings } from "./src/settings.js";

const MENU_ID = "exchange-calc-convert";
const DEFAULT_MENU_TITLE = "转换选中金额";

void ensureMenu();

if (chrome.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    void ensureMenu();
  });
}

if (chrome.runtime?.onStartup) {
  chrome.runtime.onStartup.addListener(() => {
    void ensureMenu();
  });
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "exchange-calc:selection-changed") {
    return;
  }

  void updateMenuFromSelection(message.selection ?? "", sender.tab?.id);
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const settings = await getSettings();
  const parsed = parseSelection(info.selectionText ?? "", settings);
  if (!parsed) {
    await showNotification("未识别到可转换的金额");
    return;
  }

  let resultText = "";
  try {
    const rates = await getRates({ cacheTtlMs: getCacheTtlMs(settings) });
    resultText = formatResultText(convertPrice(parsed, rates));
  } catch (error) {
    console.error("Failed to compute conversion on click", error);
    await showNotification("汇率暂不可用，请稍后重试");
    return;
  }

  await showNotification(resultText);

  if (!tab?.id) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (text) => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }
      },
      args: [resultText],
    });
  } catch (error) {
    console.error("Failed to copy conversion result", error);
  }
});

async function ensureMenu() {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: MENU_ID,
    title: DEFAULT_MENU_TITLE,
    contexts: ["selection"],
    visible: true,
    enabled: true,
  });
}

async function showNotification(message) {
  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
      title: "Exchange Calc",
      message,
    });
  } catch (error) {
    console.error("Failed to show notification", error);
  }
}

async function updateMenuFromSelection(selection, _tabId) {
  const settings = await getSettings();
  const parsed = parseSelection(selection, settings);
  if (!parsed) {
    await updateMenuTitle(DEFAULT_MENU_TITLE);
    return;
  }

  try {
    const rates = await getRates({ cacheTtlMs: getCacheTtlMs(settings) });
    const converted = convertPrice(parsed, rates);
    const title = buildMenuTitle(converted.values);
    await updateMenuTitle(title);
  } catch (error) {
    console.error("Failed to update menu title", error);
    await updateMenuTitle(DEFAULT_MENU_TITLE);
  }
}

async function updateMenuTitle(title) {
  try {
    await chrome.contextMenus.update(MENU_ID, {
      title,
      enabled: true,
      visible: true,
    });
  } catch (error) {
    console.error("Failed to update menu", error);
  }
}

function buildMenuTitle(values) {
  const text = [
    `CNY ${formatAmount(values.CNY)}`,
    `USD ${formatAmount(values.USD)}`,
    `RUB ${formatAmount(values.RUB)}`,
  ].join(" | ");

  return text.length > 64 ? `${text.slice(0, 61)}...` : text;
}

function formatAmount(value) {
  return value.toFixed(value >= 100 ? 1 : 2);
}
