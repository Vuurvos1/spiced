export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDescription(description) {
  return description.replace(/^"|"$/g, '');
}
