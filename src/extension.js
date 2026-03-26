const vscode = require('vscode');
const { state, loadState } = require('./state');
const { createStatusBar, updateStatusBar } = require('./statusBar');
const { startTimer, stopTimer } = require('./timer');
const { checkAndAlert } = require('./alerts');
const { openDashboard } = require('./dashboard/panel');
const { t } = require('./i18n');

function activate(ctx) {
  loadState(ctx);

  state.isCodespace = !!(
    process.env.CODESPACE_NAME ||
    process.env.GITHUB_CODESPACE_TOKEN
  );

  createStatusBar(ctx);
  updateStatusBar();

  const open = () => openDashboard(ctx.extensionUri);

  ctx.subscriptions.push(
    vscode.commands.registerCommand('codespaceTracker.openDashboard', open),
    vscode.commands.registerCommand('codespaceTracker.resetToday', () => {
      state.todaySeconds = 0;
      const { saveState } = require('./state');
      saveState();
      updateStatusBar();
      vscode.window.showInformationMessage(t('resetToday.message'));
    })
  );

  if (state.isCodespace) {
    startTimer(() => {
      updateStatusBar();
      if (state.monthSeconds % 60 === 0) {
        checkAndAlert(open);
      }
    });
  }
}

function deactivate() {
  stopTimer();
}

module.exports = { activate, deactivate };
