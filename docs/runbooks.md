# Predefined Simulated Runbooks Specification

The Runbook Executor Agent includes three simulated production runbooks:

---

## Runbook 1: High CPU Usage (`rb-cpu-high-v1`)

### Description
Diagnoses high CPU spikes, inspects process trees to identify runaway background worker threads, and terminates problematic processes upon human sign-off.

### Diagnostic Steps
1. `check_cpu_usage`: Queries host CPU percentage, load averages (1m/5m), and memory allocation.
2. `inspect_processes`: Lists running processes and detects runaway PIDs (e.g., PID 4921 `worker-thread-runaway`).

### Human Approval Request
- **Action:** Terminate Runaway Process (PID 4921)
- **Proposed Command:** `kill -9 4921`
- **Expected Impact:** Terminates runaway background worker thread. Host CPU drops from ~95% to ~18%.

### Remediation Tool
- `simulate_remediation` with action `KILL_PROCESS`.

### Verification Tool
- `verify_service_health`: Confirms CPU load has normalized below 80%.

---

## Runbook 2: Service Unavailable (`rb-service-down-v1`)

### Description
Diagnoses HTTP 503 errors and CrashLoopBackOff states, inspects error logs for OutOfMemory java heap exceptions, and restarts deployment with rescaled memory limits.

### Diagnostic Steps
1. `check_service_health`: Probes HTTP GET `/health` endpoint for response code and pod lifecycle state.
2. `get_service_logs`: Scans Loki log aggregator for `java.lang.OutOfMemoryError`.

### Human Approval Request
- **Action:** Kubernetes Pod Restart & Memory Limit Rescale (2GiB)
- **Proposed Command:** `kubectl rollout restart deployment/<service-name> --limits=memory=2Gi`
- **Expected Impact:** Brief 2-3 second rolling deployment restart. Clears heap memory deadlock and restores HTTP 200 responses.

### Remediation Tool
- `simulate_remediation` with action `RESTART_SERVICE`.

### Verification Tool
- `verify_service_health`: Confirms HTTP GET `/health` returns HTTP 200 OK.

---

## Runbook 3: Database Connection Failure (`rb-db-conn-fail-v1`)

### Description
Diagnoses connection pool exhaustion (100/100 connections), detects unclosed idle sessions, and terminates orphaned backend connections after approval.

### Diagnostic Steps
1. `check_database_connectivity`: Tests DB TCP port and queries active vs max connection limits.
2. `inspect_connection_errors`: Scans database session activity to detect unclosed idle queries.

### Human Approval Request
- **Action:** Terminate Idle Database Connections & Reset Pool
- **Proposed Command:** `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle'`
- **Expected Impact:** Terminates 78 leaked idle backend connections. Restores pool slot availability.

### Remediation Tool
- `simulate_remediation` with action `RESET_DB_POOL`.

### Verification Tool
- `verify_service_health`: Confirms database connectivity and pool slot availability.
