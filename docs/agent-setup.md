# TrueForge Agent Platform Setup & Architecture Guide

## Overview

**TrueForge** is an open-source agent harness developed by **TrueFoundry** designed to manage agent execution loops, model orchestration, MCP tool calls, sandboxing, session state, and human-in-the-loop governance.

---

## Official Organizer Setup Instructions (Polaris Hackathon)

### Step 1: Install & Launch TrueForge Local Harness
Run the official TrueForge harness runner:
```bash
npx @truefoundry/trueforge
```

### Step 2: Access TrueForge UI & Harness Server
Once launched, TrueForge runs locally at:
👉 **`http://localhost:8790`**

### Step 3: Configure LLM Models & OpenAI API Key
Set your OpenAI API key in your environment:
- **Windows (PowerShell)**: `$env:OPENAI_API_KEY="your_api_key_here"`
- **Linux / Mac**: `export OPENAI_API_KEY="your_api_key_here"`

Inside the TrueForge UI (`http://localhost:8790`):
1. Select your preferred model (e.g. OpenAI `gpt-4o` or `gpt-4o-mini`).
2. Connect required MCP (Model Context Protocol) servers.
3. Select/add tools for incident diagnosis and remediation.

### Step 4: AWS Credits & Setup
- **AWS Credit Code**: `PC3GIMNWS6QKT7R`
- **AWS Builder Center**: [builder.aws.com/start](https://builder.aws.com/start/)

---

## Agent Architecture & Execution Loop

```
  [Incident Intake] (Webhooks / API)
          │
          ▼
   [TrueForge LLM Diagnosis] (OpenAI / TrueFoundry Gateway)
          │
          ▼
 [Runbook Selection Registry] (High CPU, Service Unavailable, DB Exhaustion)
          │
          ▼
[Diagnostic Tool Execution] (MCP / Simulated Tools)
          │
          ▼
 [TrueForge Human Approval Gate] ─── (State Paused: Awaiting Approval)
          │
    ┌─────┴─────┐
    ▼           ▼
[Approved]  [Rejected] ──► Status: Rejected (Execution Terminated)
    │
    ▼
[Remediation Tool Execution] (simulate_remediation / K8s / AWS)
          │
          ▼
[Closed-Loop Verification] (verify_service_health)
          │
          ▼
[Structured Incident Report Generation]
```
