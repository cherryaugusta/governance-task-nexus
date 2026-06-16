# GovernanceTask Nexus

**Lightweight, Frontend-First Operational Governance Control Plane**

A production-grade task management system purpose-built for regulated environments — managing compliance obligations, evidence collection, audit items, policy reviews, AI model governance actions, and regulatory deadlines with full audit-trail traceability and **no backend required**.

**Portfolio alignment**:
[Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine) ·
[Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor) ·
[AI Model Governance Workbench](https://github.com/cherryaugusta/ai-model-governance-workbench) ·
[EcoRoute LEZ Optimiser](https://github.com/cherryaugusta/EcoRoute-LEZ-Optimiser) ·
[OpsSentinel](https://github.com/cherryaugusta/OpsSentinel) ·
[PolicyPulse](https://github.com/cherryaugusta/policypulse) ·
[FinCrime GraphOps](https://github.com/cherryaugusta/fincrime-graphops) ·
[LondonPlan RAG](https://github.com/cherryaugusta/londonplan-rag-architecture.git) ·
[Gmail MCP Server](https://github.com/cherryaugusta/gmail-mcp-server)

> Part of [Cherry Augusta's developer portfolio](https://cherryaugusta.github.io/developer-portfolio-profile/projects.html) — a collection spanning Python, Django, TypeScript, React, Angular, PostgreSQL, Redis, Docker, backend engineering, frontend delivery, full-stack applications, and reviewable AI-assisted workflow systems.

---

## Live Demo

**[Open GovernanceTask Nexus →](https://cherryaugusta.github.io/governance-task-nexus/)**

## Repository

**[github.com/cherryaugusta/governance-task-nexus](https://github.com/cherryaugusta/governance-task-nexus)**

---

## Screenshots

### Dashboard — Dark Mode

![Dashboard dark mode](assets/screenshots/01-dashboard-dark.png)

### Dashboard — Light Mode

![Dashboard light mode](assets/screenshots/02-dashboard-light.png)

### Add Task Modal

![Add task modal](assets/screenshots/03-add-task-modal.png)

### Edit Task Modal

![Edit task modal](assets/screenshots/04-edit-task-modal.png)

### Search and Filter

![Search filter](assets/screenshots/05-search-filter.png)

### Category Filter (AI-Gov)

![Category filter](assets/screenshots/06-category-filter.png)

### Priority Chip Filter

![Priority chips](assets/screenshots/07-priority-chips.png)

### Delete Confirmation Dialog

![Delete confirm](assets/screenshots/08-delete-confirm.png)

### Toast Notification

![Toast notification](assets/screenshots/09-toast-success.png)

### JSON Export

![JSON export](assets/screenshots/10-export-json.png)

### Empty State

![Empty state](assets/screenshots/11-empty-state.png)

### Mobile Responsive View

![Mobile view](assets/screenshots/12-mobile-view.png)

---

## Portfolio Context

GovernanceTask Nexus sits at the intersection of every governance, compliance, and AI-oversight project in this portfolio. The seven seed tasks that load on first launch are drawn directly from real obligations those systems surface.

### Seed Tasks

| Seed task in GovernanceTask Nexus                          | Portfolio project it reflects                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Complete DORA evidence pack for Q2 submission              | **[Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine)** |
| Audit trail reconciliation for Consumer Duty outcomes      | **[Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine)** |
| Review AI model governance policy v2.4 against PS24/16     | **[Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor)**       |
| Update sanctions screening policy to reflect OFSI guidance | **[Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor)**       |
| Prompt versioning gate review — LLM v3.1 release           | **[AI Model Governance Workbench](https://github.com/cherryaugusta/ai-model-governance-workbench)** |
| PolicyPulse regulatory horizon-scan — June 2025            | **[PolicyPulse](https://github.com/cherryaugusta/policypulse)**                                     |
| Incident post-mortem — OpsSentinel false-positive spike    | **[OpsSentinel](https://github.com/cherryaugusta/OpsSentinel)**                                     |

### Category Alignment

| Category          | Aligned projects                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compliance**    | [Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine) · [Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor) · [EcoRoute LEZ Optimiser](https://github.com/cherryaugusta/EcoRoute-LEZ-Optimiser) |
| **Evidence**      | [Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine)                                                                                                                                                                                 |
| **AI-Gov**        | [AI Model Governance Workbench](https://github.com/cherryaugusta/ai-model-governance-workbench)                                                                                                                                                                                 |
| **Audit**         | [Consumer Duty Evidence Engine](https://github.com/cherryaugusta/consumer-duty-evidence-engine) · [Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor)                                                                                     |
| **Policy Review** | [Agentic Compliance Auditor](https://github.com/cherryaugusta/agentic-compliance-auditor) · [PolicyPulse](https://github.com/cherryaugusta/policypulse) · [LondonPlan RAG](https://github.com/cherryaugusta/londonplan-rag-architecture.git)                                                     |
| **Regulatory**    | [PolicyPulse](https://github.com/cherryaugusta/policypulse) · [FinCrime GraphOps](https://github.com/cherryaugusta/fincrime-graphops) · [EcoRoute LEZ Optimiser](https://github.com/cherryaugusta/EcoRoute-LEZ-Optimiser)                                                       |
| **Incident**      | [OpsSentinel](https://github.com/cherryaugusta/OpsSentinel)                                                                                                                                                                                                                     |

The JSON export payload explicitly records this alignment.

---

## Core Features

- Full CRUD with professional modal add/edit flows
- 7 governance categories: Compliance, Evidence, AI-Gov, Audit, Policy Review, Regulatory, Incident
- Priority levels: Critical, High, Medium, Low
- Status tracking: Pending, In Review, Blocked, Completed
- Due date highlighting (overdue in red, near-due in amber)
- Full audit-trail timestamps (created + last updated)
- Real-time search across titles, owners, descriptions and notes
- Category, view and priority filters with animated sidebar badges
- Multi-key sorting (newest, oldest, due date, priority, title)
- Live statistics bar by status
- JSON export with rich portfolio context metadata
- `localStorage` persistence + realistic seed data on first load
- Dark / Light theme toggle with persistence
- Toast notifications for all actions
- Confirm dialogs for destructive operations
- Fully responsive (mobile + desktop)
- Keyboard accessible with ARIA labels and roles

---

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Markup      | Vanilla HTML5 + semantic elements + ARIA      |
| Styles      | CSS3 with Custom Properties (design tokens)   |
| Logic       | ES6+ JavaScript Modules (no bundler)          |
| Fonts       | IBM Plex Mono + Inter via Google Fonts        |
| Persistence | Web Storage API (`localStorage`)              |
| Deployment  | GitHub Pages via GitHub Actions               |
| Dev tools   | ESLint + Prettier (zero runtime dependencies) |

---

## Project Structure

```bash
governance-task-nexus/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: format, lint, deploy to GitHub Pages
├── assets/
│   └── screenshots/
│       └── .gitkeep
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── store.js
│   ├── render.js
│   ├── modal.js
│   └── toast.js
├── .gitignore
├── .nvmrc
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## Architecture Notes

The application uses **five ES6 modules** with **no build step**. GitHub Pages serves the files directly.

- `store.js` — single source of truth, `localStorage` sync, subscribe/notify pattern, full CRUD API.
- `app.js` — entry point, event wiring, debounced search, filter/sort orchestration.
- `render.js` — efficient DOM updates using `DocumentFragment`.
- `modal.js` — add/edit + confirm delete logic with focus management.
- `toast.js` — self-contained animated notification system.

---

## CI/CD Pipeline

The `.github/workflows/deploy.yml` workflow runs on every push to `main`:

1. Checks out repo with write access
2. Sets up Node 20 (from `.nvmrc`)
3. Runs `npm ci`
4. Runs `npm run format` and commits changes back (`[skip ci]`)
5. Runs `npm run lint` (fails build on errors)
6. Deploys to GitHub Pages

---
