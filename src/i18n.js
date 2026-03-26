const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const SUPPORTED_LOCALES = ['pt-BR', 'en'];
const DEFAULT_LOCALE = 'en';

let _strings = null;

/**
 * Returns the full translations object for the current VSCode locale.
 * Result is cached after the first call.
 * @returns {Record<string, string>}
 */
/**
 * Detects the active locale. Prefers VSCODE_NLS_CONFIG (injected by VSCode into
 * the Extension Host process, respects --locale flag) over vscode.env.language.
 */
function detectLang() {
  // Dev override — set via launch.json env for locale testing
  if (process.env.CODESPACE_TRACKER_LOCALE) {
    return process.env.CODESPACE_TRACKER_LOCALE.toLowerCase();
  }
  return (vscode.env.language || DEFAULT_LOCALE).toLowerCase();
}

function getLocale() {
  if (_strings) return _strings;

  const lang = detectLang();

  // Exact match first (e.g. 'pt-br' → 'pt-BR'), then language prefix (e.g. 'pt' → 'pt-BR')
  let locale = SUPPORTED_LOCALES.find(l => l.toLowerCase() === lang);
  if (!locale) {
    const prefix = lang.split('-')[0];
    locale = SUPPORTED_LOCALES.find(l => l.toLowerCase().startsWith(prefix));
  }
  if (!locale) locale = DEFAULT_LOCALE;

  const nlsPath = path.join(__dirname, 'nls', `${locale}.json`);
  _strings = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  return _strings;
}

/**
 * Translates a key, optionally interpolating named variables.
 * @param {string} key
 * @param {Record<string, string|number>} [vars]
 * @returns {string}
 */
function t(key, vars) {
  const strings = getLocale();
  let str = strings[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

module.exports = { t, getLocale };
