import fs from 'node:fs';

/**
 * @param {number} num
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * @param {string} description
 */
export function formatDescription(description) {
  return description.replace(/^"|"$/g, '');
}

/**
 * @param {string} path
 */
export function createDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}
