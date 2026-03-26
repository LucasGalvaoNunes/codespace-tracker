// @ts-nocheck
(function () {
  'use strict';

  const vscode = acquireVsCodeApi();

  // ── Initial data injected by the host ───────────────────────────────────────
  const /** @type {any} */ init = window.__csTrackerData;
  const C = init.constants;
  const CORES_MAP    = C.CORES_MAP;
  const COMPUTE_PRICE = C.COMPUTE_PRICE;
  const PLAN_LIMITS  = C.PLAN_LIMITS;
  const STORAGE_LIMIT = C.STORAGE_LIMIT;
  const STORAGE_PRICE = C.STORAGE_PRICE;
  const PLAN_COST     = C.PLAN_COST;

  let monthSec   = init.monthSeconds;
  let todaySec   = init.todaySeconds;
  let sessionSec = init.sessionSeconds;

  // ── i18n ─────────────────────────────────────────────────────────────────────
  const _i18n = init.i18n || {};

  function t(key, vars) {
    let str = _i18n[key] || key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      }
    }
    return str;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function fmtTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return h + 'h ' + String(m).padStart(2, '0') + 'm';
    return m + 'm ' + String(sec).padStart(2, '0') + 's';
  }

  function el(id) { return document.getElementById(id); }

  // ── Init form controls from config ──────────────────────────────────────────
  function initControls() {
    const cfg = init.cfg;
    el('cfgPlan').value    = cfg.plan;
    el('cfgMachine').value = cfg.machineType;
    el('cfgHours').value   = cfg.hoursPerDay;
    el('cfgDays').value    = cfg.daysPerWeek;
    el('cfgStorage').value = cfg.storageGB;
    el('cfgAlert').value   = cfg.alertThreshold;
    el('cfgHoursVal').textContent   = cfg.hoursPerDay + t('ui.suffix.hoursPerDay');
    el('cfgDaysVal').textContent    = cfg.daysPerWeek + t('ui.suffix.days');
    el('cfgStorageVal').textContent = cfg.storageGB + t('ui.suffix.gb');
    el('cfgAlertVal').textContent   = cfg.alertThreshold + '%';
  }

  // ── Main UI update (called every tick and on config change) ──────────────────
  function updateUI() {
    const plan    = el('cfgPlan').value;
    const machine = el('cfgMachine').value;
    const hDay    = parseInt(el('cfgHours').value);
    const storGB  = parseInt(el('cfgStorage').value);

    const limitCore = PLAN_LIMITS[plan] || 180;
    const cores     = CORES_MAP[machine] || 2;
    const coreUsed  = (monthSec / 3600) * cores;
    const pctCompute = Math.min(100, Math.round((coreUsed / limitCore) * 100));
    const dailySec   = hDay * 3600;
    const pctToday   = Math.min(100, Math.round((todaySec / dailySec) * 100));

    // Session / today / daily limit
    el('mSession').textContent    = fmtTime(sessionSec);
    el('mToday').textContent      = fmtTime(todaySec);
    el('mDailyLimit').textContent = hDay + 'h';

    // Today bar
    const todayBar = el('todayBar');
    todayBar.style.width      = pctToday + '%';
    todayBar.style.background = pctToday <= 70 ? '#4ec9b0' : pctToday < 100 ? '#ce9178' : '#f44747';
    const todayRemain = Math.max(0, dailySec - todaySec);
    el('todayPctLabel').textContent = t('ui.todayBar', { used: fmtTime(todaySec), remaining: fmtTime(todayRemain) });

    // Monthly compute
    el('mLimitLabel').textContent = t('dashboard.metric.limitPlan', { plan: plan.toUpperCase() });
    el('mLimit').textContent      = limitCore + t('ui.suffix.coreHours');
    const marginVal = Math.max(0, limitCore - coreUsed);
    el('mCoreUsed').textContent = coreUsed.toFixed(1);
    const marginEl = el('mMargin');
    marginEl.textContent = marginVal.toFixed(1) + t('ui.suffix.coreHours');
    marginEl.className = 'metric-value ' + (marginVal > 0 ? 'green' : 'red');

    const computeBar = el('computeBar');
    computeBar.style.width      = pctCompute + '%';
    computeBar.style.background = pctCompute <= 70 ? '#4ec9b0' : pctCompute < 100 ? '#ce9178' : '#f44747';
    el('computePctLabel').textContent = t('ui.computePctLabel', {
      used: coreUsed.toFixed(1),
      limit: limitCore,
      pct: pctCompute
    });

    // Status box
    const box = el('statusBox');
    if (pctCompute >= 100) {
      box.className = 'status-box status-over';
      box.textContent = t('status.overLimit');
    } else if (pctCompute >= 80) {
      box.className = 'status-box status-warn';
      box.textContent = t('status.warning', { pct: pctCompute, margin: marginVal.toFixed(1) });
    } else {
      box.className = 'status-box status-ok';
      const diasRestantes = cores > 0 && hDay > 0 ? Math.floor((marginVal / cores) / hDay) : 0;
      box.textContent = t('status.ok', { days: diasRestantes });
    }

    // Cost estimate
    const storExtra = Math.max(0, storGB - STORAGE_LIMIT);
    const storCost  = parseFloat((storExtra * STORAGE_PRICE).toFixed(2));
    const extraCore = Math.max(0, coreUsed - limitCore);
    const compCost  = parseFloat((extraCore * COMPUTE_PRICE[machine]).toFixed(2));
    const total     = parseFloat((PLAN_COST + compCost + storCost).toFixed(2));

    el('rPlanCost').textContent = '$' + PLAN_COST.toFixed(2);

    const rComp = el('rCompute');
    rComp.textContent = compCost > 0 ? '$' + compCost.toFixed(2) : t('ui.free');
    rComp.className   = compCost > 0 ? 'red' : 'green';

    const rStor = el('rStorage');
    rStor.textContent = storCost > 0 ? '$' + storCost.toFixed(2) : t('ui.free');
    rStor.className   = storCost > 0 ? 'red' : 'green';
    el('rStorageRowLabel').textContent = t('dashboard.row.storage', { gb: storGB });

    const rTot = el('rTotal');
    rTot.textContent = '$' + total.toFixed(2) + t('ui.perMonth');
    rTot.className   = (compCost + storCost) > 0 ? 'amber' : 'green';

    // Config projection warning
    updateProjection();
  }

  // ── Projection warning in config section ────────────────────────────────────
  function updateProjection() {
    const plan    = el('cfgPlan').value;
    const machine = el('cfgMachine').value;
    const hDay    = parseInt(el('cfgHours').value);
    const dWeek   = parseInt(el('cfgDays').value);

    const limitCore        = PLAN_LIMITS[plan] || 180;
    const cores            = CORES_MAP[machine] || 2;
    const projHoursMonth   = hDay * dWeek * 4.33;   // avg weeks per month
    const projCoreHours    = projHoursMonth * cores;
    const projBox          = el('projectionBox');

    if (projCoreHours > limitCore) {
      const excess    = projCoreHours - limitCore;
      const extraCost = (excess * COMPUTE_PRICE[machine]).toFixed(2);
      projBox.className = 'status-box status-warn';
      projBox.innerHTML = t('projection.warning', {
        projected: '<strong>' + projCoreHours.toFixed(0) + '</strong>',
        limit: limitCore,
        excess: '<strong>' + excess.toFixed(0) + '</strong>',
        cost: '<strong>$' + extraCost + '</strong>'
      });
    } else {
      const pct = Math.round((projCoreHours / limitCore) * 100);
      const cls = pct >= 70 ? 'status-warn' : 'status-ok';
      projBox.className = 'status-box ' + cls;
      const emoji = pct >= 70 ? '⚠️' : '✓';
      const status = pct >= 70 ? t('projection.nearLimit') : t('projection.withinPlan');
      projBox.textContent = t('projection.ok', {
        emoji,
        projected: projCoreHours.toFixed(0),
        pct,
        limit: limitCore,
        status
      });
    }
  }

  // ── Slider / select event binding ───────────────────────────────────────────
  const SLIDER_SUFFIXES = {
    cfgHours:   t('ui.suffix.hoursPerDay'),
    cfgDays:    t('ui.suffix.days'),
    cfgStorage: t('ui.suffix.gb'),
    cfgAlert:   '%'
  };
  ['cfgHours', 'cfgDays', 'cfgStorage', 'cfgAlert'].forEach(id => {
    const input = el(id);
    const out   = el(id + 'Val');
    if (!input || !out) return;
    input.addEventListener('input', () => {
      out.textContent = input.value + (SLIDER_SUFFIXES[id] || '');
      updateUI();
    });
  });
  el('cfgPlan').addEventListener('change', updateUI);
  el('cfgMachine').addEventListener('change', updateUI);

  // ── Save config ──────────────────────────────────────────────────────────────
  el('btnSave').addEventListener('click', () => {
    vscode.postMessage({
      type: 'saveConfig',
      plan:          el('cfgPlan').value,
      machineType:   el('cfgMachine').value,
      hoursPerDay:   parseInt(el('cfgHours').value),
      daysPerWeek:   parseInt(el('cfgDays').value),
      storageGB:     parseInt(el('cfgStorage').value),
      alertThreshold: parseInt(el('cfgAlert').value)
    });
  });

  // ── Reset today ──────────────────────────────────────────────────────────────
  el('btnReset').addEventListener('click', () => {
    vscode.postMessage({ type: 'resetToday' });
  });

  // ── Dev tools toggle ─────────────────────────────────────────────────────────
  el('devToggle').addEventListener('click', () => {
    const panel   = el('devPanel');
    const chevron = el('devChevron');
    const isOpen  = !panel.classList.contains('hidden');
    panel.classList.toggle('hidden', isOpen);
    chevron.classList.toggle('open', !isOpen);
  });

  // ── Dev tools buttons ────────────────────────────────────────────────────────
  function devPost(action) {
    vscode.postMessage({ type: 'devSimulate', action });
  }

  el('devAlert80').addEventListener('click',       () => devPost('alert80'));
  el('devAlert90').addEventListener('click',       () => devPost('alert90'));
  el('devAlert100').addEventListener('click',      () => devPost('alert100'));
  el('devAlertDaily').addEventListener('click',    () => devPost('alertDaily'));
  el('devAlertWithOpen').addEventListener('click', () => devPost('alertWithOpen'));
  el('devAddHour').addEventListener('click',    () => devPost('addHour'));
  el('devAddDayHour').addEventListener('click', () => devPost('addDayHour'));
  el('devResetAll').addEventListener('click', () => {
    const btn = el('devResetAll');
    if (btn.dataset.confirm === '1') {
      btn.dataset.confirm = '0';
      btn.textContent = t('dev.btn.resetAll');
      btn.style.opacity = '1';
      devPost('resetAll');
    } else {
      btn.dataset.confirm = '1';
      btn.textContent = t('dev.btn.resetConfirm');
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.dataset.confirm = '0';
        btn.textContent = t('dev.btn.resetAll');
        btn.style.opacity = '1';
      }, 3000);
    }
  });

  el('devApplyHours').addEventListener('click', () => {
    const mh = parseFloat(el('devMonthHours').value);
    const th = parseFloat(el('devTodayHours').value);
    if (isNaN(mh) && isNaN(th)) return;
    vscode.postMessage({
      type: 'devSetSeconds',
      monthSeconds: isNaN(mh) ? undefined : Math.round(mh * 3600),
      todaySeconds: isNaN(th) ? undefined : Math.round(th * 3600)
    });
  });

  // ── Message handler from host ────────────────────────────────────────────────
  window.addEventListener('message', e => {
    const msg = e.data;

    if (msg.type === 'tick') {
      monthSec   = msg.monthSeconds;
      todaySec   = msg.todaySeconds;
      sessionSec = msg.sessionSeconds;
      updateUI();
    }

    if (msg.type === 'resetDone') {
      todaySec = 0;
      updateUI();
    }

    if (msg.type === 'configSaved') {
      const btn = el('btnSave');
      btn.textContent = t('saved');
      setTimeout(() => { btn.textContent = t('dashboard.btn.save'); }, 2000);
      updateUI();
    }

    if (msg.type === 'devStateUpdated') {
      if (msg.monthSeconds !== undefined) monthSec = msg.monthSeconds;
      if (msg.todaySeconds !== undefined) todaySec = msg.todaySeconds;
      if (msg.sessionSeconds !== undefined) sessionSec = msg.sessionSeconds;
      updateUI();
    }

    if (msg.type === 'alertBanner') {
      showAlertBanner(msg.message, msg.severity);
    }
  });

  // ── Alert banner ─────────────────────────────────────────────────────────────
  function showAlertBanner(message, severity) {
    const banner  = el('alertBanner');
    const icon    = el('alertBannerIcon');
    const text    = el('alertBannerText');
    banner.className = 'alert-banner ' + (severity === 'over' ? 'over' : 'warn');
    icon.textContent = severity === 'over' ? '🚨' : '⚠️';
    text.textContent = message;
    // Scroll to top so the banner is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  el('alertBannerClose').addEventListener('click', () => {
    el('alertBanner').classList.add('hidden');
  });

  // ── Bootstrap ────────────────────────────────────────────────────────────────
  initControls();
  updateUI();
}());
