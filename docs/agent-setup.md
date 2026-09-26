# TrueForge Agent Platform Setup & Architecture Guide

## Overview

TrueForge is an open-source agent harness developed by TrueFoundry designed to manage agent execution loops, model orchestration, MCP tool calls, sandboxing, session state, and human-in-the-loop governance.

This guide details the setup, platform requirements, tool definitions, and workflow execution model for the **Runbook Executor Agent**.

## System Requirements

- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **Package Manager**: npm 10+ or yarn
- **TypeScript**: v5.0+
- **TrueForge SDK**: `@truefoundry/trueforge-sdk` v0.2.0

## Installation Instructions

1. Navigate to the agent directory:
   ```bash
   cd agent
   ```

2. Install official dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration:
   Copy `.env.example` to `.env` if custom port or API keys are required.

4. Start the server:
   ```bash
   npm start
   ```

5. Run test suite:
   ```bash
   npm run demo
   ```

## Agent Architecture & Execution Loop

```
  [Incident Intake]
          │
          ▼
   [Diagnosis & LLM Analysis]
          │
          ▼
 [Runbook Selection Registry]
          │
          ▼
[Diagnostic Tool Execution] (check_cpu_usage, inspect_processes, etc.)
          │
          ▼
 [Human Approval Gate] ─── (State Paused: Awaiting Approval)
          │
    ┌─────┴─────┐
    ▼           ▼
[Approved]  [Rejected] ──► Status: Rejected (Execution Terminated)
    │
    ▼
[Remediation Tool Execution] (simulate_remediation)
          │
          ▼
[Closed-Loop Verification] (verify_service_health)
          │
          ▼
[Structured Incident Report Generation]
```
