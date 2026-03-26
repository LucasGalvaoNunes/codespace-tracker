# ⏱ Codespace Tracker

> Monitor your GitHub Codespaces usage in real time and never get surprised by an unexpected bill again.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/lucasgnunes.codespace-tracker?color=4ec9b0&label=marketplace)](https://marketplace.visualstudio.com/items?itemName=lucasgnunes.codespace-tracker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucasgnunes)

---

## The problem

GitHub Codespaces includes free hours per month — **120 core hours on the Free plan** and **180 core hours on Pro**. When you exceed the limit, billing kicks in automatically and silently. Most people only find out at the end of the month.

## The solution

Codespace Tracker runs in the background counting your usage in real time and warns you **before** you hit the limit — with a popup, a banner in the dashboard, and the panel opening automatically.

---

## Features

- **Automatic timer** — detects when you're in a Codespace and starts counting with zero configuration
- **Status bar** — today's time + monthly percentage always visible at the bottom of VS Code
- **Full dashboard** — session, daily and monthly metrics with progress bars
- **Automatic alerts** — popup + banner + auto-open dashboard when the threshold is reached
- **Estimated cost** — compute and storage cost projection based on real usage
- **Configuration warning** — detects in real time if your planned hours will exceed the plan and calculates the extra cost
- **Multiple plan support** — Free (120 core hours) and Pro (180 core hours)
- **Developer tools** — simulate alerts and usage scenarios without waiting
- **Multi-language** — English and Portuguese (BR), auto-detected from your VS Code language

---

## How to use

1. Install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=lucasgnunes.codespace-tracker)
2. Open any **GitHub Codespace** — the timer starts automatically
3. Follow your usage through the `⏱ CS:` icon in the **bottom status bar**
4. Click it to open the full dashboard

In a local environment (outside a Codespace), the extension stays inactive and shows `⊘ CS: local` in the status bar.

---

## Status bar

| Icon | Meaning |
|------|---------|
| `⏱ CS: today Xh Ym \| month Z/180h (N%)` | Timer active, within limit |
| `⚠️ CS: ...` | Warning — above 80% of monthly limit |
| `🔴 CS: ...` | Limit exceeded — any usage incurs extra charges |
| `⊘ CS: local` | Local environment — timer inactive |

---

## Alerts

When the configured threshold is reached (default: 80%), and again at 90% and 100%:

- The dashboard **opens automatically**
- A **colored banner** appears at the top with the alert message
- A **notification popup** is shown in the bottom-right corner

---

## Dashboard

Open with `Ctrl+Shift+P` → **Codespace Tracker: Open Dashboard** or by clicking the status bar.

The dashboard shows:

- **Current session / Today / Daily limit** — with progress bar
- **Core hours used / Plan limit / Remaining margin** — with progress bar
- **Estimated monthly cost** — extra compute + storage + plan
- **Settings** — with real-time cost projection as you adjust the sliders
- **Developer tools** — to test alerts and simulate usage scenarios

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `codespaceTracker.plan` | `pro` | GitHub plan (free = 120h / pro = 180h core) |
| `codespaceTracker.machineType` | `2-core` | Codespace machine type |
| `codespaceTracker.hoursPerDay` | `4` | Planned usage hours per day |
| `codespaceTracker.daysPerWeek` | `5` | Work days per week |
| `codespaceTracker.storageGB` | `5` | Estimated storage in GB |
| `codespaceTracker.alertThresholdPercent` | `80` | Percentage to trigger the first alert |

---

## Plan limits (GitHub, 2025)

| Plan | Core hours/month | Free storage |
|------|-----------------|--------------|
| Free | 120 core hours  | 15 GB        |
| Pro  | 180 core hours  | 20 GB        |

> Limits reset every month. The extension resets automatically at the start of each month.

---

## Commands

| Command | Description |
|---------|-------------|
| `Codespace Tracker: Open Dashboard` | Opens the control panel |
| `Codespace Tracker: Reset today's time` | Resets the daily counter |

---

## Report an issue

Found a bug or have a suggestion? Open an issue on [GitHub](https://github.com/LucasGalvaoNunes/codespace-tracker/issues).

---

<div align="center">

Developed with ❤️ by **Lucas Galvão Nunes**

If this extension saved you some money, consider buying me a coffee ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/lucasgnunes)

</div>
