const vscode = require('vscode');
const { state, saveState } = require('../state');
const { saveConfig } = require('../config');
const { updateStatusBar } = require('../statusBar');
const { triggerAlert, triggerDailyAlert } = require('../alerts');
const { getDashboardHtml } = require('./html');

/**
 * Opens (or reveals) the Codespace Tracker dashboard.
 * @param {import('vscode').Uri} extensionUri
 */
function openDashboard(extensionUri) {
  if (state.dashboardPanel) {
    state.dashboardPanel.reveal();
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'codespaceTracker',
    'Codespace Tracker',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
    }
  );

  state.dashboardPanel = panel;
  panel.webview.html = getDashboardHtml(panel, extensionUri);

  panel.webview.onDidReceiveMessage(async msg => {
    switch (msg.type) {

      case 'saveConfig':
        await saveConfig({
          plan:           msg.plan,
          machineType:    msg.machineType,
          hoursPerDay:    msg.hoursPerDay,
          daysPerWeek:    msg.daysPerWeek,
          storageGB:      msg.storageGB,
          alertThreshold: msg.alertThreshold
        });
        panel.webview.postMessage({ type: 'configSaved' });
        updateStatusBar();
        break;

      case 'resetToday':
        state.todaySeconds = 0;
        saveState();
        panel.webview.postMessage({ type: 'resetDone' });
        updateStatusBar();
        break;

      // ── Dev tools ────────────────────────────────────────────────────────
      case 'devSimulate':
        handleDevSimulate(msg.action, extensionUri);
        break;

      case 'devSetSeconds':
        if (msg.monthSeconds !== undefined) state.monthSeconds = msg.monthSeconds;
        if (msg.todaySeconds  !== undefined) state.todaySeconds  = msg.todaySeconds;
        saveState();
        updateStatusBar();
        panel.webview.postMessage({
          type: 'devStateUpdated',
          monthSeconds:  state.monthSeconds,
          todaySeconds:  state.todaySeconds,
          sessionSeconds: state.sessionSeconds
        });
        break;
    }
  });

  panel.onDidDispose(() => { state.dashboardPanel = null; });
}

/**
 * @param {string} action
 * @param {import('vscode').Uri} extensionUri
 */
function handleDevSimulate(action, extensionUri) {
  const open = () => openDashboard(extensionUri);

  switch (action) {
    case 'alert80':
      triggerAlert(80, open);
      break;
    case 'alert90':
      triggerAlert(90, open);
      break;
    case 'alert100':
      triggerAlert(100, open);
      break;
    case 'alertDaily':
      triggerDailyAlert(open);
      break;
    case 'alertWithOpen':
      triggerAlert(80, open);
      break;
    case 'addHour':
      state.monthSeconds += 3600;
      state.todaySeconds += 3600;
      saveState();
      updateStatusBar();
      postTick();
      break;
    case 'addDayHour':
      state.todaySeconds += 3600;
      saveState();
      updateStatusBar();
      postTick();
      break;
    case 'resetAll':
      state.monthSeconds  = 0;
      state.todaySeconds  = 0;
      state.sessionSeconds = 0;
      state.alreadyAlertedPercents = new Set();
      saveState();
      updateStatusBar();
      postTick();
      break;
  }
}

function postTick() {
  if (!state.dashboardPanel) return;
  state.dashboardPanel.webview.postMessage({
    type: 'devStateUpdated',
    monthSeconds:  state.monthSeconds,
    todaySeconds:  state.todaySeconds,
    sessionSeconds: state.sessionSeconds
  });
}

module.exports = { openDashboard };
