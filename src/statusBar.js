const vscode = require('vscode');
const { state } = require('./state');
const { getConfig } = require('./config');
const { PLAN_LIMITS } = require('./constants');
const { fmtTime } = require('./utils');
const { getCoreHoursUsed } = require('./alerts');
const { t } = require('./i18n');

let _item;

function createStatusBar(ctx) {
  _item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  _item.command = 'codespaceTracker.openDashboard';
  _item.show();
  ctx.subscriptions.push(_item);
}

function updateStatusBar() {
  if (!state.isCodespace) {
    _item.text = t('statusBar.local');
    _item.tooltip = t('statusBar.localTooltip');
    _item.command = 'codespaceTracker.openDashboard';
    return;
  }

  const cfg = getConfig();
  const limitCore = PLAN_LIMITS[cfg.plan] || 180;
  const coreHoursUsed = getCoreHoursUsed(state.monthSeconds);
  const pct = Math.round((coreHoursUsed / limitCore) * 100);
  const dailyLimitSec = cfg.hoursPerDay * 3600;
  const todayRemaining = Math.max(0, dailyLimitSec - state.todaySeconds);

  let icon = '$(clock)';
  if (pct >= 100) icon = '$(error)';
  else if (pct >= 80) icon = '$(warning)';

  _item.text = t('statusBar.text', {
    icon,
    today: fmtTime(state.todaySeconds),
    used: coreHoursUsed.toFixed(1),
    limit: limitCore,
    pct
  });
  _item.tooltip = [
    t('statusBar.header'),
    t('statusBar.today', { today: fmtTime(state.todaySeconds), remaining: fmtTime(todayRemaining) }),
    t('statusBar.month', { used: coreHoursUsed.toFixed(1), limit: limitCore, pct }),
    t('statusBar.click')
  ].join('\n');

  if (state.dashboardPanel) {
    state.dashboardPanel.webview.postMessage({
      type: 'tick',
      monthSeconds: state.monthSeconds,
      todaySeconds: state.todaySeconds,
      sessionSeconds: state.sessionSeconds
    });
  }
}

module.exports = { createStatusBar, updateStatusBar };
