# Runbook Executor Agent (TrueForge Platform)

[![TrueForge Harness](https://img.shields.io/badge/TrueForge-SDK_v0.2.0-blue.svg)](https://github.com/truefoundry/trueforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An AI-powered agent built on the **TrueForge** platform to help site reliability engineers (SREs) and DevOps teams diagnose and resolve production incidents using predefined runbooks and human-in-the-loop approval workflows.

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
│   ├── trueforge-integration.md  # Complete Integration Spec for Person 2 (Frontend)
│   ├── agent-setup.md            # TrueForge Setup & Platform Architecture
│   └── runbooks.md               # Runbook Specifications
├── frontend/                     # Frontend Space for Person 2 (Antigravity)
└── README.md
```

---

## 🛠️ Quickstart Guide

### 1. Install Agent Dependencies
```bash
cd agent
npm install
```

### 2. Run the 5-Scenario Automated Demonstration
```bash
npm run demo
```

### 3. Start the TrueForge Agent REST API Server
```bash
npm start
```
The server will start on `http://localhost:3000`.

---

## 🔌 Frontend Integration (Person 2)

See [`docs/trueforge-integration.md`](docs/trueforge-integration.md) for full integration details.

- **Endpoint**: `http://localhost:3000/api/v1`
- **Header**: `x-api-key: tf_sk_runbook_executor_hackathon_2026_demo_key`
- **Agent ID**: `tf-agent-runbook-executor-v1`
