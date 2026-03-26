const vscode = require('vscode');

function getConfig() {
  const cfg = vscode.workspace.getConfiguration('codespaceTracker');
  return {
    hoursPerDay: cfg.get('hoursPerDay', 4),
    daysPerWeek: cfg.get('daysPerWeek', 5),
    machineType: cfg.get('machineType', '2-core'),
    storageGB: cfg.get('storageGB', 5),
    plan: cfg.get('plan', 'pro'),
    alertThreshold: cfg.get('alertThresholdPercent', 80)
  };
}

async function saveConfig(values) {
  const cfg = vscode.workspace.getConfiguration('codespaceTracker');
  await cfg.update('plan', values.plan, true);
  await cfg.update('machineType', values.machineType, true);
  await cfg.update('hoursPerDay', values.hoursPerDay, true);
  await cfg.update('daysPerWeek', values.daysPerWeek, true);
  await cfg.update('storageGB', values.storageGB, true);
  await cfg.update('alertThresholdPercent', values.alertThreshold, true);
}

module.exports = { getConfig, saveConfig };
