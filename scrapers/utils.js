export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPrice(price) {
  return `$${formatNumber(price)}`;
}

export function formatCurrency(currency) {
  return currency.toUpperCase();
}

export function formatDescription(description) {
  return description.replace(/^"|"$/g, '');
}
