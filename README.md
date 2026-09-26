# ⚡ TrueForge Autonomous Runbook Executor Agent

[![Live App](https://img.shields.io/badge/Vercel_Production-Live_App-000000.svg?style=for-the-badge&logo=vercel)](https://runbook-executor-agent.vercel.app/)
[![Agent Server](https://img.shields.io/badge/Render_Backend-Agent_API-46E3B7.svg?style=for-the-badge&logo=render)](https://runbook-executor-agent.onrender.com/api/v1/health)
[![TrueForge Harness](https://img.shields.io/badge/TrueForge-SDK_v0.2.0-indigo.svg?style=for-the-badge)](https://github.com/truefoundry/trueforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An **AI-Powered Autonomous SRE Incident Diagnosis & Runbook Execution Agent** built for the **Polaris Hackathon**. Powered by TrueForge Agent Harness, Multi-Agent LLM Consensus, RAG Pattern Matching, and Model Context Protocol (MCP) non-destructive diagnostic tools.

---

## 🌐 Live Production Deployments

- 🚀 **Frontend Workspace (Vercel)**: [https://runbook-executor-agent.vercel.app/](https://runbook-executor-agent.vercel.app/)
- ⚙️ **Agent Engine API (Render)**: [https://runbook-executor-agent.onrender.com/api/v1](https://runbook-executor-agent.onrender.com/api/v1/health)
- 📦 **GitHub Repository**: [https://github.com/AnjneyShah21/runbook-executor-agent](https://github.com/AnjneyShah21/runbook-executor-agent.git) (Branch: `agent-development`)

---

## 📄 Solution Writeup

### 1. The Problem
Modern cloud outage response suffers from high Mean Time To Resolution (MTTR), cognitive overload during high-stress Datadog/PagerDuty alerts, and human error during manual CLI commands. SRE teams need an autonomous agent that ingests raw telemetry, performs non-destructive root-cause diagnostics, and safely prepares remediations without executing unauthorized destructive state changes.

### 2. What the Agent Reaches
The Runbook Executor Agent autonomously ingests production telemetry alerts, scores LLM diagnosis confidence (>96%), performs RAG historical incident similarity pattern matching, executes non-destructive diagnostic tools via Model Context Protocol (MCP) probes, calculates financial **Blast Radius Risk Scores ($/min downtime cost)**, and executes authorized remediations with closed-loop SLA verification.

### 3. Where It Stops (TrueForge Human Approval Gate)
The agent explicitly **halts execution at the TrueForge Human Approval Gate** prior to executing any state-mutating remediation command (e.g., process termination, service restart, connection pool flush). Remediation requires explicit authorization from an authenticated SRE operator, dynamically capturing their logged-in session identity and role designation.

---

## 🧠 Core AI & Architectural Capabilities

### 1. Multi-Agent LLM Consensus Engine
Evaluates incoming alerts through a 3-agent ensemble reasoning loop:
- **Telemetry Analyst Agent**: Parses raw metrics, load averages, and stack traces.
- **SRE Root Cause Specialist**: Scores probable cause hypothesis and calculates confidence vectors (>96%).
- **Safety & Compliance Guardian**: Computes financial Blast Radius & evaluates risk thresholds.

### 2. RAG Historical Incident Pattern Matching
- Cross-references incoming alert telemetry against historical incident resolution vector memory.
- Provides real-time similarity matching scores (e.g. `96.4% match with INC-084192 (High CPU Worker Thread Spike)`).

### 3. AI Blast Radius & Downtime Cost Predictor
- Calculates **Risk Score (0–100%)**, **Estimated Affected Users**, **Downtime Cost per Minute ($/min)**, and impacted microservice dependencies before any human approval is granted.

### 4. Self-Healing Auto-Approve Policy Rules Engine
- Evaluates risk score and severity thresholds. For low/medium-risk non-destructive runbooks, the agent auto-approves and continues execution without forcing an operator to manually click sign-off.

### 5. Live Diagnostic Terminal Sandbox & Trace Replay
- Interactive CLI terminal trace replay window with stdout/stderr logs, execution time (ms), filter tabs (*All Logs*, *Diagnostics*, *Remediation*), and 1-click **Copy Trace**.

### 6. Automated Post-Mortem & Webhook Dispatcher
- Generates 1-click **Markdown Post-Mortem** reports containing executive summaries, root cause, timeline, and human gate authorization logs.
- Includes a built-in **Webhook / Slack Alert Dispatcher** to notify incident channels.

---

## 🧪 Trained Incident & Runbook Test Suite

| Runbook ID | Title | Target Category | Diagnostic MCP Probes | Remediation Action |
|---|---|---|---|---|
| `rb-cpu-high-v1` | **High CPU Usage** | CPU | `check_cpu_usage`, `inspect_processes` | Terminate PID 4921 & restart worker pool |
| `rb-db-conn-fail-v1` | **Database Connection Failure** | DATABASE | `check_database_connectivity`, `inspect_connection_errors` | Terminate 78 idle sessions & reset pool |
| `rb-service-down-v1` | **Service Unavailable (HTTP 503)** | AVAILABILITY | `check_service_health`, `get_service_logs` | Rolling pod restart with 2GiB heap memory |
| `rb-k8s-oom-v1` | **K8s Pod OOMKill Threat** | AVAILABILITY | `check_service_health` | Scale RAM to 2GiB & rolling patch |
| `rb-disk-full-v1` | **Disk Storage Full (99%)** | AVAILABILITY | `get_service_logs` | Truncate debug log archives & compress journal |
| `rb-kafka-lag-v1` | **Kafka Queue Consumer Lag** | AVAILABILITY | `inspect_processes` | Scale consumer replicas from 3 to 8 pods |

---

## 🛠️ Tech Stack & Frameworks Used

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, HTML5 Interactive Canvas Cyber Mesh, NextAuth Google OAuth & Credentials, Lucide Icons.
- **Agent Engine**: Node.js 20, Express REST API, TypeScript, Zod Schema Validation, TrueForge SDK (`@truefoundry/trueforge-sdk`), Docker.
- **Deployment & Cloud**: Vercel (Frontend), Render (Agent Engine Container), AWS App Runner / Docker compatible.

---

## 📁 Repository Structure

```text
runbook-executor-agent/
├── SOLUTION_WRITEUP.md           # Official Hackathon Solution Writeup
├── Dockerfile                    # Root Container Manifest for Render/AWS
├── vercel.env                    # Vercel Environment Setup Template
├── agent/                        # TrueForge Agent Engine Implementation
│   ├── Dockerfile
│   ├── src/
│   │   ├── agent/                # TrueForge Agent Execution Engine & Multi-Agent Core
│   │   ├── runbooks/             # 6 Production Runbook Definitions
│   │   ├── tools/                # Simulated MCP Infrastructure Probes
│   │   ├── types/                # Incident State & Zod Schemas
│   │   └── server.ts             # Express REST API Server
│   └── package.json
├── frontend/                     # Next.js 16 Production Frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router (Dashboard, Approvals, Reports)
│   │   ├── components/           # UI Components, Canvas Mesh, Blast Radius Cards
│   │   ├── services/             # Incident & TrueForge API Services
│   │   └── types/                # Frontend Incident Contracts
│   └── package.json
└── README.md
```

---

## 🚀 Local Quickstart Guide

### 1. Run Backend Agent Server
```bash
cd agent
npm install
npm start
```
*Server runs on `http://localhost:3000` (or configured PORT).*

### 2. Run Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (or `http://localhost:3001`).*

---

## 📜 License
This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
