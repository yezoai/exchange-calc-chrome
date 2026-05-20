import { DEFAULT_SETTINGS, getSettings, saveSettings } from "./src/settings.js";

const defaultCurrency = document.getElementById("default-currency");
const cacheTtl = document.getElementById("cache-ttl");
const status = document.getElementById("status");

void loadSettings();

document.getElementById("save").addEventListener("click", async () => {
  setStatus("正在保存...");

  try {
    const settings = await saveSettings({
      defaultCurrency: defaultCurrency.value,
      cacheTtlMinutes: cacheTtl.value,
    });
    renderSettings(settings);
    setStatus("设置已保存");
  } catch (error) {
    console.error(error);
    setStatus("保存失败");
  }
});

document.getElementById("reset").addEventListener("click", async () => {
  setStatus("正在恢复默认值...");

  try {
    const settings = await saveSettings(DEFAULT_SETTINGS);
    renderSettings(settings);
    setStatus("已恢复默认设置");
  } catch (error) {
    console.error(error);
    setStatus("恢复失败");
  }
});

async function loadSettings() {
  setStatus("正在读取设置...");

  try {
    const settings = await getSettings();
    renderSettings(settings);
    setStatus("设置已加载");
  } catch (error) {
    console.error(error);
    renderSettings(DEFAULT_SETTINGS);
    setStatus("读取失败，已使用默认值");
  }
}

function renderSettings(settings) {
  defaultCurrency.value = settings.defaultCurrency;
  cacheTtl.value = settings.cacheTtlMinutes;
}

function setStatus(message) {
  status.textContent = message;
}
