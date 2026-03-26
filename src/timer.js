const { state, saveState } = require('./state');
const { getTodayStr } = require('./utils');

let _timer = null;

/**
 * @param {() => void} onTick  Called every second; responsible for updating UI and alerts.
 */
function startTimer(onTick) {
  if (_timer) return;
  _timer = setInterval(() => {
    const today = getTodayStr();
    if (today !== state.lastDate) {
      state.todaySeconds = 0;
      state.lastDate = today;
      state.alreadyAlertedPercents = new Set(
        [...state.alreadyAlertedPercents].filter(k => !k.startsWith('daily_'))
      );
    }
    state.sessionSeconds++;
    state.monthSeconds++;
    state.todaySeconds++;
    onTick();
    if (state.monthSeconds % 60 === 0) {
      saveState();
    }
  }, 1000);
}

function stopTimer() {
  if (_timer) { clearInterval(_timer); _timer = null; }
  saveState();
}

module.exports = { startTimer, stopTimer };
