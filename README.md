# ⏱ Codespace Tracker

> Monitore seu uso de horas no GitHub Codespaces e nunca mais seja surpreendido com uma cobrança inesperada.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/lucasgnunes.codespace-tracker?color=4ec9b0&label=marketplace)](https://marketplace.visualstudio.com/items?itemName=lucasgnunes.codespace-tracker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucasgnunes)

---

## O problema

O GitHub Codespaces inclui horas gratuitas por mês — **120 hs core no plano Free** e **180 hs core no Pro**. Quando você estoura, a cobrança é automática e silenciosa. Muita gente só descobre no final do mês.

## A solução

O Codespace Tracker fica em segundo plano contando seu uso em tempo real e te avisa **antes** de você chegar no limite — com popup, banner no dashboard e a aba abrindo automaticamente.

---

## Funcionalidades

- **Timer automático** — detecta se você está em um Codespace e conta sem precisar de configuração
- **Barra de status** — tempo de hoje + percentual do mês sempre visível no rodapé do VSCode
- **Dashboard completo** — métricas de sessão, dia e mês com barras de progresso
- **Alertas automáticos** — popup + banner + abertura automática do dashboard ao atingir o threshold
- **Custo estimado** — projeção de gasto com compute e storage baseada no uso real
- **Aviso de configuração** — detecta em tempo real se suas horas planejadas vão extrapolar o plano e calcula o custo extra
- **Suporte a múltiplos planos** — Free (120 hs core) e Pro (180 hs core)
- **Ferramentas de desenvolvedor** — simule alertas e cenários de uso sem precisar esperar

---

## Como usar

1. Instale pelo [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=lucasgnunes.codespace-tracker)
2. Abra qualquer **GitHub Codespace** — o timer inicia automaticamente
3. Acompanhe o uso pelo ícone `⏱ CS:` na **barra de status inferior**
4. Clique nele para abrir o dashboard completo

Em ambiente local (fora de um Codespace), a extensão fica inativa e exibe `⊘ CS: local` na barra de status.

---

## Barra de status

| Ícone | Significado |
|-------|-------------|
| `⏱ CS: hoje Xh Ym \| mês Z/180h (N%)` | Timer ativo, dentro do limite |
| `⚠️ CS: ...` | Atenção — acima de 80% do limite mensal |
| `🔴 CS: ...` | Limite estourado — qualquer uso gera cobrança extra |
| `⊘ CS: local` | Ambiente local — timer inativo |

---

## Alertas

Ao atingir o threshold configurado (padrão: 80%), e novamente em 90% e 100%:

- O dashboard **abre automaticamente**
- Um **banner colorido** aparece no topo com a mensagem de alerta
- Um **popup de notificação** é exibido no canto inferior direito

---

## Dashboard

Abra com `Ctrl+Shift+P` → **Codespace Tracker: Abrir Dashboard** ou clicando na barra de status.

O dashboard exibe:

- **Sessão atual / Hoje / Limite diário** — com barra de progresso
- **Horas core usadas / Limite do plano / Margem restante** — com barra de progresso
- **Custo estimado do mês** — compute extra + storage + plano
- **Configurações** — com projeção de custo em tempo real ao ajustar os sliders
- **Ferramentas de desenvolvedor** — para testar alertas e simular cenários

---

## Configurações

| Configuração | Padrão | Descrição |
|---|---|---|
| `codespaceTracker.plan` | `pro` | Plano GitHub (free = 120h / pro = 180h core) |
| `codespaceTracker.machineType` | `2-core` | Tipo de máquina do Codespace |
| `codespaceTracker.hoursPerDay` | `4` | Horas planejadas de uso por dia |
| `codespaceTracker.daysPerWeek` | `5` | Dias de trabalho por semana |
| `codespaceTracker.storageGB` | `5` | Storage estimado em GB |
| `codespaceTracker.alertThresholdPercent` | `80` | Percentual para disparar o primeiro alerta |

---

## Limites por plano (GitHub, 2025)

| Plano | Horas core/mês | Storage grátis |
|-------|----------------|----------------|
| Free  | 120 hs core    | 15 GB          |
| Pro   | 180 hs core    | 20 GB          |

> Os limites são resetados todo mês. A extensão reseta automaticamente no início de cada mês.

---

## Comandos

| Comando | Descrição |
|---------|-----------|
| `Codespace Tracker: Abrir Dashboard` | Abre o painel de controle |
| `Codespace Tracker: Resetar tempo de hoje` | Zera o contador diário |

---

## Reportar um problema

Encontrou algum bug ou tem sugestão? Abre uma issue no [GitHub](https://github.com/lucasgnunes/codespace-tracker/issues).

---

<div align="center">

Desenvolvido com ❤️ por **Lucas Galvão Nunes**

Se essa extensão te ajudou a economizar uma graninha, considera um cafezinho ☕

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/lucasgnunes)

</div>
