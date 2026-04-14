const CURRENCY_SYMBOLS = {
  "¥": "CNY",
  "￥": "CNY",
  "$": "USD",
  "₽": "RUB",
};

const CURRENCY_CODES = ["CNY", "USD", "RUB"];
const DEFAULT_CURRENCY = "CNY";

export function parseSelection(rawText) {
  const text = String(rawText ?? "").replace(/\s+/g, " ").trim();
  if (!text) {
    return null;
  }

  const symbolMatch = text.match(/([¥￥$₽])\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  if (symbolMatch) {
    return buildParsedAmount(symbolMatch[2], CURRENCY_SYMBOLS[symbolMatch[1]], text);
  }

  const codeMatch = text.match(/\b(CNY|USD|RUB)\s*([0-9][0-9,]*(?:\.[0-9]+)?)\b/i);
  if (codeMatch) {
    return buildParsedAmount(codeMatch[2], codeMatch[1].toUpperCase(), text);
  }

  if (/^[0-9][0-9,]*(?:\.[0-9]+)?$/.test(text)) {
    return buildParsedAmount(text, DEFAULT_CURRENCY, text, true);
  }

  return null;
}

function buildParsedAmount(amountText, currency, rawText, assumed = false) {
  if (!CURRENCY_CODES.includes(currency)) {
    return null;
  }

  const normalizedAmount = Number.parseFloat(amountText.replace(/,/g, ""));
  if (!Number.isFinite(normalizedAmount)) {
    return null;
  }

  return {
    amount: normalizedAmount,
    currency,
    rawText,
    assumed,
  };
}
