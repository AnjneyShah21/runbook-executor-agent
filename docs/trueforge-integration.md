# TrueForge Agent Integration Specification for Person 2 (Frontend Developer)

**Target Audience:** Person 2 (Antigravity Frontend Developer)  
**Platform:** TrueForge Agent Harness (`@truefoundry/trueforge-sdk` v0.2.0)  
**Agent Name:** Runbook Executor Agent  
**Agent ID:** `tf-agent-runbook-executor-v1`  
**Status:** Production Ready / Verified  

---

## 1. Agent Name & Identifier
* **Agent Name:** `Runbook Executor Agent`
* **Agent Identifier:** `tf-agent-runbook-executor-v1`
* **Platform Architecture:** TrueForge Agent Harness (TypeScript / REST API)

---

## 2. Environment & Deployment Details
* **Base URL:** `http://localhost:3000/api/v1`
* **Host / Port:** `0.0.0.0:3000`
* **Protocol:** HTTP REST / JSON
* **SDK Compatibility:** `@truefoundry/trueforge-sdk` v0.2.0

---

## 3. Supported Invocation & Integration Method
TrueForge natively supports **HTTP REST API** and **TypeScript SDK** invocation methods.  
For the Antigravity frontend (Person 2), the **HTTP REST API** is the primary, officially supported interface.

---

## 4. Authentication Requirements
All API calls to the TrueForge agent require API key authentication via HTTP headers:
* **Header Name:** `x-api-key` (or standard `Authorization: Bearer <token>`)
* **Default Demo Key:** `tf_sk_runbook_executor_hackathon_2026_demo_key`

---

## 5. Endpoints & SDK Reference

### Endpoint Overview Table
| Operation | Method | Endpoint Path | Description |
| :--- | :--- | :--- | :--- |
| **Agent Info & Health** | `GET` | `/api/v1/health` | Public liveness probe and capability list |
| **List Runbooks** | `GET` | `/api/v1/runbooks` | Fetch available runbooks & diagnostic steps |
| **Submit Incident** | `POST` | `/api/v1/incidents` | Submit incident intake & start workflow |
| **Get Incident Status** | `GET` | `/api/v1/incidents/:id` | Poll incident state, logs, and approval status |
| **List All Incidents** | `GET` | `/api/v1/incidents` | Fetch all active and past incidents |
| **Approve Remediation** | `POST` | `/api/v1/incidents/:id/approve` | Grant human approval to execute remediation |
| **Reject Remediation** | `POST` | `/api/v1/incidents/:id/reject` | Reject pending remediation action |
| **Get Incident Report** | `GET` | `/api/v1/incidents/:id/report` | Retrieve final structured markdown/JSON report |

---

## 6. Required Request Formats

### Submit Incident (`POST /api/v1/incidents`)
```json
{
  "title": "High CPU spike on payment-service worker pool",
  "description": "Alert: Host CPU utilization at 94.8%. Latency p99 increased to 4200ms.",
  "serviceName": "payment-service",
  "severity": "CRITICAL",
  "environment": "production"
}
```
* **Supported Severity Levels:** `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`
* **Supported Environments:** `production`, `staging`, `development`, `demo`

### Approve Remediation (`POST /api/v1/incidents/:id/approve`)
```json
{
  "approvedBy": "Alice Cooper (Lead SRE)",
  "reason": "Verified worker thread loop in log trace. Safe to terminate PID 4921."
}
```

### Reject Remediation (`POST /api/v1/incidents/:id/reject`)
```json
{
  "rejectedBy": "Bob (Engineering Lead)",
  "reason": "Batch export job currently running. Do not terminate process."
}
```

---

## 7. Expected Response Formats

### Initial Incident Submission Response (Status: 202 Accepted)
```json
{
  "success": true,
  "message": "Incident submitted and processing started.",
  "incidentId": "INC-092645-812",
  "status": "Awaiting Approval",
  "selectedRunbook": {
    "id": "rb-cpu-high-v1",
    "title": "High CPU Usage Runbook"
  },
  "diagnosis": {
    "probableCause": "High CPU load detected on 'payment-service' driven by runaway worker thread (PID 4921).",
    "confidenceScore": 0.95,
    "summary": "Analyzed incident context for 'payment-service'. Selected 'High CPU Usage Runbook' (rb-cpu-high-v1)."
  },
  "approvalPending": true,
  "approvalDetails": {
    "approvalId": "APP-a4f91b2c",
    "incidentId": "INC-092645-812",
    "action": "Terminate Runaway Process (PID 4921)",
    "targetService": "payment-service",
    "proposedCommand": "Pauses workflow execution and requests explicit human authorization...",
    "expectedImpact": "Will send terminate signal to PID 4921. Primary service thread will continue executing; CPU will drop from ~95% to ~18%.",
    "riskLevel": "HIGH",
    "status": "PENDING",
    "requestedAt": "2026-09-26T11:00:00.000Z"
  }
}
```

---

## 8. Execution Status Retrieval System
The TrueForge Agent status state machine transitions sequentially through these exact states:
1. `Received` - Incident intake recorded.
2. `Analyzing` - LLM analysis of incident text.
3. `Diagnosing` - Probable cause determined.
4. `Runbook Selected` - Runbook matched.
5. `Executing Diagnostics` - Diagnostic tools executing.
6. `Awaiting Approval` - Paused at Human Approval Gate.
7. `Remediating` - Approved remediation running.
8. `Verifying` - Closed-loop post-remediation verification running.
9. `Resolved` - All checks passed.
10. `Partially Resolved` - Non-critical check failed.
11. `Unresolved` - Critical check failed.
12. `Rejected` - Human supervisor rejected remediation.

Poll status via `GET /api/v1/incidents/:id` using standard interval (e.g., 2000ms).

---

## 9. Approval Workflow Integration
When `status` equals `'Awaiting Approval'`, the frontend should render the **TrueForge Approval Card**:
* Display `approvalDetails.action`, `approvalDetails.targetService`, `approvalDetails.expectedImpact`, and `approvalDetails.riskLevel`.
* Render **[APPROVE REMEDIATION]** and **[REJECT ACTION]** buttons.
* Call `POST /api/v1/incidents/:id/approve` or `reject`.
* Upon approval response, status automatically updates to `Remediating` -> `Verifying` -> `Resolved`.

---

## 10. Execution Log Retrieval Method
Retrieve step-by-step logs from `GET /api/v1/incidents/:id` under key `executionLogs`:
```json
[
  {
    "stepId": "step-1-cpu-check",
    "stepName": "Check CPU Utilization (check_cpu_usage)",
    "toolName": "check_cpu_usage",
    "type": "DIAGNOSTIC",
    "status": "COMPLETED",
    "outputResult": {
      "checkName": "check_cpu_usage",
      "status": "DEGRADED",
      "metrics": { "cpuPercent": 94.8, "memoryPercent": 78.2 }
    },
    "durationMs": 14,
    "timestamp": "2026-09-26T11:00:01.000Z"
  }
]
```

---

## 11. Incident Report Retrieval Method
Fetch the final structured incident report via `GET /api/v1/incidents/:id/report`:
```json
{
  "success": true,
  "report": {
    "incidentId": "INC-092645-812",
    "title": "High CPU spike on payment-service worker pool",
    "serviceName": "payment-service",
    "environment": "production",
    "severity": "CRITICAL",
    "selectedRunbook": { "id": "rb-cpu-high-v1", "title": "High CPU Usage Runbook" },
    "diagnosis": { "probableCause": "High CPU load...", "confidenceScore": 0.95 },
    "executionSteps": [ ... ],
    "approvalStatus": { "approvalRequired": true, "status": "APPROVED", "approvedBy": "Alice" },
    "remediationPerformed": { "action": "kill -9 4921", "success": true },
    "verificationResult": { "status": "Resolved", "details": "All post-remediation verification checks PASSED." },
    "finalStatus": "Resolved",
    "executionDuration": "1.42 seconds"
  }
}
```

---

## 12. Required Frontend Environment Variables
Add to your frontend `.env`:
```env
VITE_TRUEFORGE_API_URL="http://localhost:3000/api/v1"
VITE_TRUEFORGE_API_KEY="tf_sk_runbook_executor_hackathon_2026_demo_key"
VITE_TRUEFORGE_AGENT_ID="tf-agent-runbook-executor-v1"
```

---

## 13. Verified Example Fetch Implementation (cURL / JavaScript)

### JavaScript / Fetch Example
```javascript
const API_URL = 'http://localhost:3000/api/v1';
const API_KEY = 'tf_sk_runbook_executor_hackathon_2026_demo_key';

// 1. Submit Incident
const res = await fetch(`${API_URL}/incidents`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    title: 'High CPU spike on payment-service worker pool',
    description: 'Datadog CPU alert 94.8%',
    serviceName: 'payment-service',
    severity: 'CRITICAL',
    environment: 'production'
  })
});
const data = await res.json();
console.log('Incident Created:', data.incidentId);

// 2. Approve Remediation
if (data.status === 'Awaiting Approval') {
  const approveRes = await fetch(`${API_URL}/incidents/${data.incidentId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      approvedBy: 'Antigravity UI Engineer',
      reason: 'User clicked Approve button in UI'
    })
  });
  const approveData = await approveRes.json();
  console.log('Approved & Resolved:', approveData.status);
}
```

---

## 14. Limitations & Platform Notes
1. **Infrastructure Isolation:** All tools execute in isolated simulated environments (`SimulatedInfrastructureTools`). No real cloud/K8s credentials required.
2. **WebSocket Support:** HTTP REST Polling is currently recommended over WebSockets for maximum stability during the hackathon.

---
*Document verified by TrueForge Agent Developer on September 26, 2026.*
