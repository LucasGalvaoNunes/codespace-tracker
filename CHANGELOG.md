# Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.

## [1.0.0] — 2026-03-25

### Lançamento inicial

- Timer automático de uso do GitHub Codespaces (detecta `CODESPACE_NAME` / `GITHUB_CODESPACE_TOKEN`)
- Barra de status com tempo de hoje, horas core do mês e percentual de uso
- Dashboard completo com métricas de sessão, dia e mês
- Barras de progresso para uso diário e mensal
- Custo estimado do mês em tempo real (compute extra + storage)
- Alertas automáticos ao atingir 80% (configurável), 90% e 100% do limite
  - Popup de notificação
  - Banner no topo do dashboard
  - Abertura automática do dashboard
- Aviso de projeção de custo nas configurações (baseado em horas/dia × dias/semana)
- Suporte aos planos Free (120 hs core) e Pro (180 hs core)
- Reset automático no início de cada mês
- Ferramentas de desenvolvedor para simular alertas e cenários de uso
- CSP (Content Security Policy) completo no webview
- Estrutura multi-arquivo profissional
