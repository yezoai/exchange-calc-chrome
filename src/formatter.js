function formatAmount(value) {
  return value.toFixed(value >= 100 ? 1 : 2);
}

export function formatMenuTitle(result) {
  const text = [
    `CNY ${formatAmount(result.values.CNY)}`,
    `USD ${formatAmount(result.values.USD)}`,
    `RUB ${formatAmount(result.values.RUB)}`,
  ].join(" | ");

  return text.length > 64 ? `${text.slice(0, 61)}...` : text;
}

export function formatResultText(result) {
  const source = result.source.assumed
    ? `${result.source.amount} ${result.source.currency} (default)`
    : `${result.source.amount} ${result.source.currency}`;

  return [
    `Source: ${source}`,
    `CNY ${formatAmount(result.values.CNY)}`,
    `USD ${formatAmount(result.values.USD)}`,
    `RUB ${formatAmount(result.values.RUB)}`,
  ].join(" | ");
}
