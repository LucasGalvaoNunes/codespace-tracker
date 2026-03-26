const vscode = require('vscode');
const { state, saveState } = require('./state');
const { getConfig } = require('./config');
const { PLAN_LIMITS, CORES_MAP } = require('./constants');
const { getTodayStr, fmtTime } = require('./utils');
const { t } = require('./i18n');

function getCoreHoursUsed(seconds) {
  const cfg = getConfig();
  const cores = CORES_MAP[cfg.machineType] || 2;
  return (seconds / 3600) * cores;
}

/**
 * Checks thresholds and fires real notifications based on current state.
 * @param {() => void} openDashboard
 */
function checkAndAlert(openDashboard) {
  const cfg = getConfig();
  const limitCore = PLAN_LIMITS[cfg.plan] || 180;
  const coreHoursUsed = getCoreHoursUsed(state.monthSeconds);
  const pct = Math.round((coreHoursUsed / limitCore) * 100);

  for (const threshold of [cfg.alertThreshold, 90, 100]) {
    if (pct >= threshold && !state.alreadyAlertedPercents.has(threshold)) {
      state.alreadyAlertedPercents.add(threshold);
      saveState();

      const msg = threshold >= 100
        ? t('alert.overLimit', { limit: limitCore, plan: cfg.plan.toUpperCase() })
        : t('alert.monthlyThreshold', { pct: threshold, used: coreHoursUsed.toFixed(1), limit: limitCore });

      openDashboard();
      _postAlert(msg, threshold >= 100 ? 'over' : 'warn');

      vscode.window.showWarningMessage(`Codespace Tracker: ${msg}`, t('alert.close'));
    }
  }

  const dailyLimitSec = cfg.hoursPerDay * 3600;
  const todayPct = Math.round((state.todaySeconds / dailyLimitSec) * 100);
  const dailyKey = `daily_${getTodayStr()}_${cfg.alertThreshold}`;

  if (todayPct >= cfg.alertThreshold && !state.alreadyAlertedPercents.has(dailyKey)) {
    state.alreadyAlertedPercents.add(dailyKey);
    saveState();
    const remaining = Math.max(0, dailyLimitSec - state.todaySeconds);
    const msg = t('alert.dailyUsage', {
      today: fmtTime(state.todaySeconds),
      planned: cfg.hoursPerDay,
      remaining: fmtTime(remaining)
    });

    openDashboard();
    _postAlert(msg, 'warn');
    vscode.window.showInformationMessage(`Codespace Tracker: ${msg}`, t('alert.close'));
  }
}

/**
 * Posts an alert banner message to the dashboard webview (if open).
 * Uses a short delay to allow the panel to finish loading when freshly opened.
 * @param {string} message
 * @param {'warn' | 'over'} severity
 */
function _postAlert(message, severity) {
  const send = () => {
    if (state.dashboardPanel) {
      state.dashboardPanel.webview.postMessage({ type: 'alertBanner', message, severity });
    }
  };
  // Give the webview time to initialize if it was just opened
  setTimeout(send, 150);
}

/**
 * Fires a simulated alert notification + auto-opens dashboard (for dev tools).
 * @param {number} threshold  80 | 90 | 100
 * @param {() => void} openDashboard
 */
function triggerAlert(threshold, openDashboard) {
  const cfg = getConfig();
  const limitCore = PLAN_LIMITS[cfg.plan] || 180;
  const coreHoursUsed = getCoreHoursUsed(state.monthSeconds);

  const msg = threshold >= 100
    ? t('dev.simOverLimit', { limit: limitCore, used: coreHoursUsed.toFixed(1) })
    : t('dev.simThreshold', { threshold, used: coreHoursUsed.toFixed(1), limit: limitCore });

  openDashboard();
  _postAlert(msg, threshold >= 100 ? 'over' : 'warn');
  vscode.window.showWarningMessage(`Codespace Tracker: ${msg}`, t('alert.close'));
}

/**
 * Fires a simulated daily usage alert + auto-opens dashboard (for dev tools).
 * @param {() => void} openDashboard
 */
function triggerDailyAlert(openDashboard) {
  const cfg = getConfig();
  const dailyLimitSec = cfg.hoursPerDay * 3600;
  const remaining = Math.max(0, dailyLimitSec - state.todaySeconds);
  const msg = t('dev.simDailyUsage', {
    today: fmtTime(state.todaySeconds),
    planned: cfg.hoursPerDay,
    remaining: fmtTime(remaining)
  });

  openDashboard();
  _postAlert(msg, 'warn');
  vscode.window.showInformationMessage(`Codespace Tracker: ${msg}`, t('alert.close'));
}

module.exports = { getCoreHoursUsed, checkAndAlert, triggerAlert, triggerDailyAlert };
