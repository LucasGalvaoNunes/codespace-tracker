const { getTodayStr } = require('./utils');

/**
 * Shared mutable state — imported by all modules.
 * @type {{
 *   ctx: import('vscode').ExtensionContext | null,
 *   dashboardPanel: import('vscode').WebviewPanel | null,
 *   isCodespace: boolean,
 *   sessionSeconds: number,
 *   monthSeconds: number,
 *   todaySeconds: number,
 *   lastDate: string,
 *   alreadyAlertedPercents: Set<any>
 * }}
 */
const state = {
  ctx: null,
  dashboardPanel: null,
  isCodespace: false,
  sessionSeconds: 0,
  monthSeconds: 0,
  todaySeconds: 0,
  lastDate: getTodayStr(),
  alreadyAlertedPercents: new Set()
};

function loadState(ctx) {
  state.ctx = ctx;
  state.monthSeconds = ctx.globalState.get('monthSeconds', 0);
  state.todaySeconds = ctx.globalState.get('todaySeconds', 0);
  state.lastDate = ctx.globalState.get('lastDate', getTodayStr());
  state.alreadyAlertedPercents = new Set(ctx.globalState.get('alertedPercents', []));

  const today = getTodayStr();
  const storedMonth = (state.lastDate || '').slice(0, 7);
  const currentMonth = today.slice(0, 7);

  if (storedMonth !== currentMonth) {
    state.monthSeconds = 0;
    state.todaySeconds = 0;
    state.alreadyAlertedPercents = new Set();
  } else if (state.lastDate !== today) {
    state.todaySeconds = 0;
  }

  state.lastDate = today;
}

function saveState() {
  if (!state.ctx) return;
  state.ctx.globalState.update('monthSeconds', state.monthSeconds);
  state.ctx.globalState.update('todaySeconds', state.todaySeconds);
  state.ctx.globalState.update('lastDate', state.lastDate);
  state.ctx.globalState.update('alertedPercents', [...state.alreadyAlertedPercents]);
}

module.exports = { state, loadState, saveState };
