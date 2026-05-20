const SETTINGS_KEY = "exchange-calc-settings";

export const DEFAULT_SETTINGS = {
  defaultCurrency: "CNY",
  cacheTtlMinutes: 60,
};

export async function getSettings() {
  const result = await chrome.storage.sync.get(SETTINGS_KEY);
  return normalizeSettings(result[SETTINGS_KEY] ?? {});
}

export async function saveSettings(partialSettings) {
  const nextSettings = normalizeSettings(partialSettings);
  await chrome.storage.sync.set({
    [SETTINGS_KEY]: nextSettings,
  });
  return nextSettings;
}

export function normalizeSettings(input) {
  const defaultCurrency = normalizeCurrency(input.defaultCurrency) ?? DEFAULT_SETTINGS.defaultCurrency;
  const cacheTtlMinutes = normalizeCacheTtlMinutes(input.cacheTtlMinutes);

  return {
    defaultCurrency,
    cacheTtlMinutes,
  };
}

export function getCacheTtlMs(settings) {
  return settings.cacheTtlMinutes * 60 * 1000;
}

function normalizeCurrency(currency) {
  if (typeof currency !== "string") {
    return null;
  }

  const value = currency.toUpperCase();
  return ["CNY", "USD", "RUB"].includes(value) ? value : null;
}

function normalizeCacheTtlMinutes(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return DEFAULT_SETTINGS.cacheTtlMinutes;
  }

  const rounded = Math.round(number);
  return Math.min(1440, Math.max(5, rounded));
}
