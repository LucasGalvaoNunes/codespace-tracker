const vscode = require('vscode');
const { state } = require('../state');
const { getConfig } = require('../config');
const { PLAN_LIMITS, CORES_MAP, COMPUTE_PRICE, STORAGE_LIMIT, STORAGE_PRICE, PLAN_COST } = require('../constants');
const { t, getLocale } = require('../i18n');

function getNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

/**
 * @param {import('vscode').WebviewPanel} panel
 * @param {import('vscode').Uri} extensionUri
 */
function getDashboardHtml(panel, extensionUri) {
  const webview = panel.webview;
  const nonce = getNonce();

  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'dashboard.css'));
  const jsUri  = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'dashboard.js'));

  const cfg = getConfig();

  // Initial data passed to webview JS (avoid server-side rendering dynamic values in HTML)
  const initialData = {
    monthSeconds:  state.monthSeconds,
    todaySeconds:  state.todaySeconds,
    sessionSeconds: state.sessionSeconds,
    cfg,
    constants: { CORES_MAP, COMPUTE_PRICE, PLAN_LIMITS, STORAGE_LIMIT, STORAGE_PRICE, PLAN_COST },
    i18n: getLocale()
  };
  // Prevent </script> injection from config string values
  const safeData = JSON.stringify(initialData).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="${vscode.env.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src ${webview.cspSource};
             script-src 'nonce-${nonce}';">
  <link rel="stylesheet" href="${cssUri}">
  <title>Codespace Tracker</title>
</head>
<body>

<h1>⏱ Codespace Tracker</h1>
<p class="subtitle">${t('dashboard.subtitle')}</p>

<!-- Alert banner — shown when a threshold is triggered automatically -->
<div id="alertBanner" class="alert-banner hidden">
  <span class="alert-banner-icon" id="alertBannerIcon">⚠️</span>
  <span class="alert-banner-text" id="alertBannerText"></span>
  <button class="alert-banner-close" id="alertBannerClose" title="${t('dashboard.closeAlert')}">✕</button>
</div>

<!-- ── Session ────────────────────────────────────────── -->
<p class="section">${t('dashboard.section.session')}</p>
<div class="metrics">
  <div class="metric">
    <div class="metric-label">${t('dashboard.metric.session')}</div>
    <div class="metric-value green" id="mSession">0m 00s</div>
  </div>
  <div class="metric">
    <div class="metric-label">${t('dashboard.metric.today')}</div>
    <div class="metric-value" id="mToday">0m 00s</div>
  </div>
  <div class="metric">
    <div class="metric-label">${t('dashboard.metric.dailyLimit')}</div>
    <div class="metric-value" id="mDailyLimit">—</div>
  </div>
</div>

<div class="bar-wrap">
  <div class="bar-header"><span>${t('dashboard.bar.today')}</span><span id="todayPctLabel"></span></div>
  <div class="bar-track"><div class="bar-fill" id="todayBar" style="width:0%"></div></div>
</div>

<!-- ── Monthly usage ──────────────────────────────────── -->
<p class="section">${t('dashboard.section.monthly')}</p>
<div class="metrics">
  <div class="metric">
    <div class="metric-label">${t('dashboard.metric.coreUsed')}</div>
    <div class="metric-value" id="mCoreUsed">0.0</div>
  </div>
  <div class="metric">
    <div class="metric-label" id="mLimitLabel">—</div>
    <div class="metric-value" id="mLimit">—</div>
  </div>
  <div class="metric">
    <div class="metric-label">${t('dashboard.metric.margin')}</div>
    <div class="metric-value green" id="mMargin">—</div>
  </div>
</div>

<div class="bar-wrap">
  <div class="bar-header"><span>${t('dashboard.bar.compute')}</span><span id="computePctLabel"></span></div>
  <div class="bar-track"><div class="bar-fill" id="computeBar" style="width:0%"></div></div>
</div>

<div class="status-box status-ok" id="statusBox"></div>

<!-- ── Estimated cost ──────────────────────────────────── -->
<p class="section">${t('dashboard.section.cost')}</p>
<div class="card">
  <div class="row">
    <span class="row-label">${t('dashboard.row.plan')}</span>
    <span id="rPlanCost">$4.00</span>
  </div>
  <div class="row">
    <span class="row-label">${t('dashboard.row.compute')}</span>
    <span id="rCompute" class="green">${t('ui.free')}</span>
  </div>
  <div class="row">
    <span class="row-label" id="rStorageRowLabel"></span>
    <span id="rStorage" class="green">${t('ui.free')}</span>
  </div>
  <div class="row">
    <span class="row-label">${t('dashboard.row.total')}</span>
    <span id="rTotal" class="green">—</span>
  </div>
</div>

<div class="divider"></div>

<!-- ── Settings ────────────────────────────────────────── -->
<p class="section">${t('dashboard.section.config')}</p>
<div class="card">
  <label>${t('dashboard.config.plan')}</label>
  <select id="cfgPlan">
    <option value="free">${t('dashboard.plan.free')}</option>
    <option value="pro">${t('dashboard.plan.pro')}</option>
  </select>

  <label>${t('dashboard.config.machine')}</label>
  <select id="cfgMachine">
    <option value="2-core">2-core (8 GB RAM)</option>
    <option value="4-core">4-core (16 GB RAM)</option>
    <option value="8-core">8-core (32 GB RAM)</option>
    <option value="16-core">16-core (64 GB RAM)</option>
  </select>

  <label>${t('dashboard.config.hoursPerDay')}</label>
  <div class="slider-row">
    <input type="range" min="1" max="12" step="1" id="cfgHours">
    <span class="slider-val" id="cfgHoursVal"></span>
  </div>

  <label>${t('dashboard.config.daysPerWeek')}</label>
  <div class="slider-row">
    <input type="range" min="1" max="7" step="1" id="cfgDays">
    <span class="slider-val" id="cfgDaysVal"></span>
  </div>

  <label>${t('dashboard.config.storage')}</label>
  <div class="slider-row">
    <input type="range" min="1" max="50" step="1" id="cfgStorage">
    <span class="slider-val" id="cfgStorageVal"></span>
  </div>

  <label>${t('dashboard.config.alert')}</label>
  <div class="slider-row">
    <input type="range" min="50" max="95" step="5" id="cfgAlert">
    <span class="slider-val" id="cfgAlertVal"></span>
  </div>

  <!-- Projection warning — updated in real time by dashboard.js -->
  <div id="projectionBox" class="status-box status-ok" style="margin-top:14px;"></div>

  <button class="btn" id="btnSave">${t('dashboard.btn.save')}</button>
  <button class="btn btn-secondary" id="btnReset" style="margin-top:8px;">${t('dashboard.btn.reset')}</button>
</div>

<div class="divider"></div>

<!-- ── Dev Tools ───────────────────────────────────────── -->
<div class="dev-header" id="devToggle">
  <span class="dev-chevron" id="devChevron">▶</span>
  <span class="dev-header-label">${t('dev.header')}</span>
</div>

<div id="devPanel" class="dev-panel hidden">
  <p class="dev-description">
    ${t('dev.description')}
  </p>

  <p class="dev-sub">${t('dev.sub.notifications')}</p>
  <div class="dev-grid">
    <button class="dev-btn" id="devAlert80">${t('dev.btn.alert80')}</button>
    <button class="dev-btn" id="devAlert90">${t('dev.btn.alert90')}</button>
    <button class="dev-btn" id="devAlert100">${t('dev.btn.alert100')}</button>
    <button class="dev-btn" id="devAlertDaily">${t('dev.btn.alertDaily')}</button>
  </div>
  <div style="margin-top:8px;">
    <button class="dev-btn" id="devAlertWithOpen" style="width:100%; color:#4ec9b0;">
      ${t('dev.btn.alertWithOpen')}
    </button>
  </div>

  <p class="dev-sub">${t('dev.sub.advanceTime')}</p>
  <div class="dev-grid">
    <button class="dev-btn" id="devAddHour">${t('dev.btn.addHour')}</button>
    <button class="dev-btn" id="devAddDayHour">${t('dev.btn.addDayHour')}</button>
  </div>

  <p class="dev-sub">${t('dev.sub.setHours')}</p>
  <div class="dev-input-row">
    <label for="devMonthHours">${t('dev.label.monthHours')}</label>
    <input type="number" id="devMonthHours" placeholder="ex: 144" min="0" max="500">
  </div>
  <div class="dev-input-row" style="margin-top:6px;">
    <label for="devTodayHours">${t('dev.label.todayHours')}</label>
    <input type="number" id="devTodayHours" placeholder="ex: 3.5" min="0" max="24" step="0.5">
  </div>
  <div style="margin-top:8px;">
    <button class="dev-btn" id="devApplyHours" style="width:100%;">${t('dev.btn.apply')}</button>
  </div>

  <p class="dev-sub" style="margin-top:16px;">${t('dev.sub.reset')}</p>
  <button class="dev-btn danger" id="devResetAll" style="width:100%;">
    ${t('dev.btn.resetAll')}
  </button>
</div>

<script nonce="${nonce}">window.__csTrackerData = ${safeData};</script>
<script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
}

module.exports = { getDashboardHtml };
