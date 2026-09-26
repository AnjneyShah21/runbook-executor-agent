# Runbook Executor Agent (TrueForge Platform)

[![TrueForge Harness](https://img.shields.io/badge/TrueForge-SDK_v0.2.0-blue.svg)](https://github.com/truefoundry/trueforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An AI-powered agent built on the **TrueForge** platform to help site reliability engineers (SREs) and DevOps teams diagnose and resolve production incidents using predefined runbooks and human-in-the-loop approval workflows.

---

## 📄 Solution Writeup

> **Official Hackathon Solution Writeup** — See [`SOLUTION_WRITEUP.md`](SOLUTION_WRITEUP.md) for the complete standalone document.

### 1. The Problem
Modern cloud infrastructure outage response suffers from high Mean Time To Resolution (MTTR), cognitive overload during high-stress alerts, and human error during manual remediation. SRE teams need an autonomous agent that ingests raw telemetry, performs non-destructive root-cause diagnostics, and safely prepares remediations without executing unauthorized destructive state changes.

### 2. What the Agent Reaches
The Runbook Executor Agent autonomously ingests production telemetry alerts (Datadog/PagerDuty), scores LLM diagnosis confidence (>90%), matches targeted runbooks, and executes non-destructive diagnostic tools via Model Context Protocol (MCP) servers (e.g., inspecting process CPU usage, memory leaks, and service health probes). Upon human authorization, it completes state-mutating remediation actions (graceful restarts, pool flushes) and exports structured post-incident post-mortem reports in Markdown and JSON.

### 3. Where It Stops
The agent explicitly **halts execution at the TrueForge Human Approval Gate** prior to executing any state-mutating remediation command (e.g., process termination, service restart, connection pool flush). Remediation requires explicit authorization from an authenticated Lead SRE or Incident Commander.

### 4. System Architecture
- **Frontend**: Next.js 16 App Router, Tailwind CSS, Framer Motion, Aceternity UI, WebGL Tide Swirl shaders, NextAuth Google OAuth & Credentials auth with role onboarding.
- **Backend Harness**: TrueForge REST Agent Engine managing incident state machine transitions (`RECEIVED`, `DIAGNOSING`, `AWAITING_APPROVAL`, `REMEDIATING`, `RESOLVED`).
- **Tooling Interface**: MCP diagnostic toolrunner executing non-destructive inspection probes.

### 5. How TrueForge Was Used
TrueForge serves as the core agent execution harness and authorization authority. It manages the agent lifecycle, orchestrates state transitions via REST endpoints (`/api/trueforge/agent/run`, `/agent/approve`), enforces human approval gates, and records immutable audit transcripts.

### 6. What Is Real vs. Mocked
- **Real**: Next.js 16 UI, NextAuth authentication flow, designation onboarding, TrueForge REST API integration, state machine transitions, non-destructive toolrunner interface, and report export engine.
- **Mocked**: Fallback state machine when backend or live Datadog/PagerDuty alert webhooks are offline.

### 7. Known Limits
- Diagnostic toolset restricted to pre-defined non-destructive MCP probes.
- Requires >90% LLM confidence score for automated runbook selection.
- Single-operator approval authorization scope per incident lifecycle.

---

## 🚀 Key Features

1. **Incident Intake & Validation**: Ingests incident title, description, service name, severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and environment (`production`, `staging`, `development`, `demo`).
2. **LLM Diagnosis & Runbook Selection**: Dynamically matches incidents to specialized runbooks (High CPU, Service Unavailable, Database Connection Failure).
3. **MCP Diagnostic Execution**: Automatically runs non-destructive diagnostic tools (`check_cpu_usage`, `inspect_processes`, `check_service_health`, `get_service_logs`, `check_database_connectivity`, `inspect_connection_errors`).
4. **TrueForge Human Approval Gate**: Halts execution before state-mutating remediation actions, presenting detailed risk assessment, proposed commands, and expected impact for human sign-off.
5. **Remediation & Closed-Loop Verification**: Executes approved actions (`simulate_remediation`) and verifies system recovery (`verify_service_health`).
6. **Structured Incident Reporting**: Generates comprehensive incident reports detailing execution steps, timelines, approval logs, and final status (`Resolved`, `Partially Resolved`, `Unresolved`, `Rejected`).

---

## 📁 Repository Structure

```text
runbook-executor-agent/
├── SOLUTION_WRITEUP.md           # Official Hackathon Solution Writeup (~300 words)
├── agent/                        # TrueForge Agent Core Implementation
│   ├── src/
│   │   ├── agent/                # TrueForge Agent Harness Execution Engine
│   │   ├── demo/                 # Test Suite & Demonstration Runner
│   │   ├── runbooks/             # 3 Simulated Runbook Definitions
│   │   ├── tools/                # Diagnostic & Remediation Tools
│   │   ├── types/                # Zod Schemas & State Interfaces
│   │   ├── cli.ts                # Command Line Interface
│   │   └── server.ts             # Express REST API Server for Frontend
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docs/                         # Integration & Setup Documentation
│   ├── trueforge-integration.md  # Complete Integration Spec
│   ├── agent-setup.md            # TrueForge Setup & Platform Architecture
│   └── runbooks.md               # Runbook Specifications
├── frontend/                     # Next.js 16 Production Frontend
└── README.md
```

---

## 🛠️ Quickstart Guide

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Run Backend Agent
```bash
cd agent
npm install
npm start
```
The server will start on `http://localhost:3000`.
