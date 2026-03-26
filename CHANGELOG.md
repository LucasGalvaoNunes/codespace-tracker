# Changelog

All notable changes to this project are documented here.

## [1.0.1] — 2026-03-25

### Added

- Multi-language support: English and Portuguese (BR), auto-detected from VS Code language settings

## [1.0.0] — 2026-03-25

### Initial release

- Automatic usage timer for GitHub Codespaces (detects `CODESPACE_NAME` / `GITHUB_CODESPACE_TOKEN`)
- Status bar with today's time, monthly core hours and usage percentage
- Full dashboard with session, daily and monthly metrics
- Progress bars for daily and monthly usage
- Real-time estimated monthly cost (extra compute + storage)
- Automatic alerts at 80% (configurable), 90% and 100% of the limit
  - Notification popup
  - Banner at the top of the dashboard
  - Automatic dashboard open
- Cost projection warning in settings (based on hours/day × days/week)
- Support for Free (120 core hours) and Pro (180 core hours) plans
- Automatic reset at the start of each month
- Developer tools to simulate alerts and usage scenarios
- Full CSP (Content Security Policy) in the webview
- Professional multi-file architecture
