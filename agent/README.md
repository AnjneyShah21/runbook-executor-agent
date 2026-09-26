# TrueForge Runbook Executor Agent

This package contains the core AI agent for the **Runbook Executor Agent** project built on the **TrueForge** agent harness platform.

## Overview

The **Runbook Executor Agent** automates production incident diagnosis and remediation using predefined runbooks and human-in-the-loop approval gates.

Key capabilities:
- **Incident Intake**: Accepts incident title, description, service name, severity (`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`), and environment (`production` | `staging` | `development` | `demo`).
- **Diagnosis & Runbook Selection**: Dynamically matches incidents to specialized runbooks.
- **Diagnostic Tool Execution**: Interrogates simulated telemetry, process trees, error logs, and database metrics using MCP-style tools.
- **Human Approval Gate**: Pauses execution before state-mutating remediation actions, exposing full risk analysis and expected impact.
- **Remediation & Closed-Loop Verification**: Executes approved remediation and performs verification checks to confirm baseline recovery.
- **Incident Report Generation**: Generates comprehensive structured incident reports.

## Structure

```text
agent/
├── src/
│   ├── agent/
│   │   └── trueforgeAgent.ts    # Main TrueForge Agent harness execution loop
│   ├── config.ts                 # Platform configuration & API keys
│   ├── demo/
│   │   └── runDemo.ts           # 5-part automated test suite & scenario runner
│   ├── runbooks/
│   │   └── runbookRegistry.ts   # 3 simulated runbook definitions
│   ├── tools/
│   │   └── simulatedTools.ts    # Simulated infrastructure & diagnostic tools
│   ├── types/
│   │   └── incident.ts          # Zod validation schemas & state types
│   ├── cli.ts                   # CLI runner
│   └── server.ts                # Express REST API server for Person 2 integration
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup & Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the full 5-scenario demo test suite:
   ```bash
   npm run demo
   ```

3. Start the Express API server for Person 2 integration:
   ```bash
   npm start
   ```

Server listens on `http://localhost:3000`. Default API Key: `tf_sk_runbook_executor_hackathon_2026_demo_key`.
