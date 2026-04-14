import { parseSelection } from "./src/parser.js";
import { convertPrice, getRates } from "./src/rates.js";

const input = document.getElementById("input");
const status = document.getElementById("status");
const result = document.getElementById("result");
const source = document.getElementById("source");
const cny = document.getElementById("cny");
const usd = document.getElementById("usd");
const rub = document.getElementById("rub");

document.getElementById("read-selection").addEventListener("click", async () => {
  setStatus("正在读取当前页选中内容...");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setStatus("未找到当前标签页");
      return;
    }

    const [resultItem] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() ?? "",
    });

    input.value = resultItem?.result ?? "";
    setStatus(input.value ? "已读取当前选中内容" : "当前页没有选中文本");
  } catch (error) {
    console.error(error);
    setStatus("读取选中内容失败");
  }
});

document.getElementById("convert").addEventListener("click", async () => {
  const parsed = parseSelection(input.value);
  if (!parsed) {
    hideResult();
    setStatus("未识别到可转换的金额格式");
    return;
  }

  setStatus("正在获取汇率...");

  try {
    const rates = await getRates();
    const converted = convertPrice(parsed, rates);

    source.textContent = `来源: ${parsed.amount} ${parsed.currency}${parsed.assumed ? " (default)" : ""}`;
    cny.textContent = `CNY ${formatAmount(converted.values.CNY)}`;
    usd.textContent = `USD ${formatAmount(converted.values.USD)}`;
    rub.textContent = `RUB ${formatAmount(converted.values.RUB)}`;
    result.hidden = false;
    setStatus("换算完成");
  } catch (error) {
    console.error(error);
    hideResult();
    setStatus("汇率获取失败");
  }
});

function formatAmount(value) {
  return value.toFixed(value >= 100 ? 1 : 2);
}

function hideResult() {
  result.hidden = true;
}

function setStatus(message) {
  status.textContent = message;
}
