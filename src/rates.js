const CACHE_KEY = "exchange-calc-rates";
const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000;
const TARGET_CURRENCIES = ["USD", "CNY", "RUB"];
const FALLBACK_ENDPOINTS = [
  "https://open.er-api.com/v6/latest/USD",
  "https://api.exchangerate-api.com/v4/latest/USD",
];

export async function getRates(options = {}) {
  const cacheTtlMs = normalizeCacheTtl(options.cacheTtlMs);
  const cached = await readCachedRates();
  if (cached && !isExpired(cached.updatedAt, cacheTtlMs)) {
    return cached.rates;
  }

  for (const endpoint of FALLBACK_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rates = normalizeRates(data?.rates ?? {});
      await writeCachedRates(rates);
      return rates;
    } catch (error) {
      console.warn("Rate fetch failed", endpoint, error);
    }
  }

  if (cached?.rates) {
    return cached.rates;
  }

  throw new Error("No exchange rates available");
}

export function convertPrice(parsed, rates) {
  const amountInUsd = parsed.currency === "USD" ? parsed.amount : parsed.amount / rates[parsed.currency];

  return {
    source: parsed,
    values: {
      CNY: amountInUsd * rates.CNY,
      USD: amountInUsd,
      RUB: amountInUsd * rates.RUB,
    },
  };
}

function normalizeRates(inputRates) {
  const rates = { USD: 1 };

  for (const currency of TARGET_CURRENCIES) {
    if (currency === "USD") {
      continue;
    }

    const value = Number(inputRates[currency]);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Missing rate for ${currency}`);
    }

    rates[currency] = value;
  }

  return rates;
}

async function readCachedRates() {
  const result = await chrome.storage.local.get(CACHE_KEY);
  return result[CACHE_KEY] ?? null;
}

async function writeCachedRates(rates) {
  await chrome.storage.local.set({
    [CACHE_KEY]: {
      rates,
      updatedAt: Date.now(),
    },
  });
}

function isExpired(updatedAt, cacheTtlMs) {
  return !updatedAt || Date.now() - updatedAt > cacheTtlMs;
}

function normalizeCacheTtl(cacheTtlMs) {
  if (!Number.isFinite(cacheTtlMs) || cacheTtlMs <= 0) {
    return DEFAULT_CACHE_TTL_MS;
  }

  return cacheTtlMs;
}
