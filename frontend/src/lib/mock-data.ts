import { IncidentState, IncidentReport } from '@/types/incident';

export const INITIAL_MOCK_INCIDENTS: IncidentState[] = [
  {
    incidentId: 'INC-092645-812',
    intake: {
      title: 'High CPU spike on payment-service worker pool',
      description: 'Datadog Alert: Host CPU utilization sustained at 94.8% for > 5 minutes. Latency p99 increased to 4200ms.',
      serviceName: 'payment-service',
      severity: 'CRITICAL',
      environment: 'production'
    },
    status: 'Awaiting Approval',
    diagnosis: {
      probableCause: 'High CPU load detected on payment-service driven by runaway worker thread (PID 4921) processing malformed payload batch.',
      confidenceScore: 0.95,
      summary: 'Analyzed incident context for payment-service. Selected High CPU Usage Runbook (rb-cpu-high-v1). Executed non-destructive diagnostics.'
    },
    selectedRunbook: {
      id: 'rb-cpu-high-v1',
      title: 'High CPU Usage Runbook',
      description: 'Automated diagnostic and remediation runbook for high CPU utilization on service nodes.'
    },
    executionLogs: [
      {
        stepId: 'step-1-cpu-check',
        stepName: 'Check CPU Utilization (check_cpu_usage)',
        toolName: 'check_cpu_usage',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: {
          checkName: 'check_cpu_usage',
          status: 'DEGRADED',
          metrics: { cpuPercent: 94.8, memoryPercent: 78.2, loadAvg: '12.4, 9.8, 6.2' },
          details: 'CPU utilization exceeds threshold (94.8% > 85.0%)'
        },
        timestamp: '2026-09-26T11:00:01.000Z',
        durationMs: 14
      },
      {
        stepId: 'step-2-inspect-procs',
        stepName: 'Inspect Top CPU Processes (inspect_processes)',
        toolName: 'inspect_processes',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: {
          checkName: 'inspect_processes',
          status: 'INFO',
          topProcesses: [
            { pid: 4921, name: 'payment-worker', cpuUsage: 91.2, memUsage: 42.1, user: 'app' },
            { pid: 1042, name: 'node-exporter', cpuUsage: 1.4, memUsage: 2.1, user: 'root' }
          ],
          details: 'Top process PID 4921 consuming 91.2% CPU core capacity'
        },
        timestamp: '2026-09-26T11:00:02.500Z',
        durationMs: 22
      },
      {
        stepId: 'step-3-approval-gate',
        stepName: 'TrueForge Human Approval Gate',
        type: 'HUMAN_APPROVAL',
        status: 'AWAITING_APPROVAL',
        outputResult: {
          message: 'Paused workflow execution. Awaiting authorization to terminate runaway worker PID 4921.'
        },
        timestamp: '2026-09-26T11:00:03.100Z'
      }
    ],
    approvalRequest: {
      approvalId: 'APP-a4f91b2c',
      incidentId: 'INC-092645-812',
      action: 'Terminate Runaway Process (PID 4921)',
      targetService: 'payment-service',
      proposedCommand: 'kill -15 4921 && sleep 2 && kill -9 4921',
      expectedImpact: 'Will terminate runaway worker thread PID 4921. Primary service listener pool remains active. CPU load expected to drop from 95% to < 20%.',
      riskLevel: 'HIGH',
      blastRadius: {
        riskScore: 78,
        affectedUsersEstimate: 1420,
        downtimeCostPerMin: 320,
        affectedMicroservices: ['payment-service', 'checkout-api', 'billing-gateway'],
        blastRadiusCategory: 'HIGH'
      },
      status: 'PENDING',
      requestedAt: '2026-09-26T11:00:03.100Z'
    },
    startedAt: '2026-09-26T11:00:00.000Z',
    mode: 'MOCK'
  },
  {
    incidentId: 'INC-092645-813',
    intake: {
      title: 'Service Unavailable on checkout-gateway API',
      description: 'HTTP 503 Service Unavailable rates elevated to 88% on checkout endpoints.',
      serviceName: 'checkout-gateway',
      severity: 'HIGH',
      environment: 'production'
    },
    status: 'Resolved',
    diagnosis: {
      probableCause: 'Stale instance connection pool deadlock following upstream redis failover.',
      confidenceScore: 0.92,
      summary: 'Selected Service Availability Recovery Runbook (rb-avail-svc-v1).'
    },
    selectedRunbook: {
      id: 'rb-avail-svc-v1',
      title: 'Service Availability Recovery Runbook',
      description: 'Diagnostics and graceful container pool restart for unresponsive endpoints.'
    },
    executionLogs: [
      {
        stepId: 'step-1-svc-health',
        stepName: 'Check Service Endpoint Health',
        toolName: 'check_service_health',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: { status: 'FAILED', httpCode: 503, responseTimeMs: 5001 },
        timestamp: '2026-09-26T10:15:01.000Z',
        durationMs: 45
      },
      {
        stepId: 'step-2-svc-logs',
        stepName: 'Fetch Service Error Logs',
        toolName: 'get_service_logs',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: { errorCount: 142, lastError: 'Redis ConnectionTimeoutException: connection pool exhausted' },
        timestamp: '2026-09-26T10:15:02.000Z',
        durationMs: 30
      },
      {
        stepId: 'step-3-approval',
        stepName: 'Human Approval Gate - Restart Container Instance Pool',
        type: 'HUMAN_APPROVAL',
        status: 'COMPLETED',
        outputResult: { approvedBy: 'David Miller (Lead DevOps)', status: 'APPROVED' },
        timestamp: '2026-09-26T10:15:20.000Z'
      },
      {
        stepId: 'step-4-remediate',
        stepName: 'Perform Graceful Service Restart',
        toolName: 'restart_service',
        type: 'REMEDIATION',
        status: 'COMPLETED',
        outputResult: { action: 'restart checkout-gateway', result: 'SUCCESS', activeReplicas: 4 },
        timestamp: '2026-09-26T10:15:25.000Z',
        durationMs: 1200
      },
      {
        stepId: 'step-5-verify',
        stepName: 'Closed-Loop Post-Remediation Health Check',
        toolName: 'verify_service_health',
        type: 'VERIFICATION',
        status: 'COMPLETED',
        outputResult: { status: 'HEALTHY', httpCode: 200, responseTimeMs: 24 },
        timestamp: '2026-09-26T10:15:28.000Z',
        durationMs: 180
      }
    ],
    approvalRequest: {
      approvalId: 'APP-7f12e98a',
      incidentId: 'INC-092645-813',
      action: 'Gracefully Restart checkout-gateway Pod Replicas',
      targetService: 'checkout-gateway',
      proposedCommand: 'kubectl rollout restart deployment/checkout-gateway -n prod',
      expectedImpact: 'Temporary 2-second connection pause while traffic routes to warm standbys.',
      riskLevel: 'MEDIUM',
      status: 'APPROVED',
      requestedAt: '2026-09-26T10:15:05.000Z',
      respondedAt: '2026-09-26T10:15:20.000Z',
      approvedBy: 'David Miller (Lead DevOps)'
    },
    remediationResult: {
      actionExecuted: 'Gracefully Restart checkout-gateway Pod Replicas',
      success: true,
      outputDetails: 'Rollout restart completed successfully. 4/4 pods healthy.',
      executedAt: '2026-09-26T10:15:25.000Z'
    },
    verificationResult: {
      status: 'Resolved',
      verificationChecks: [
        { checkName: 'check_service_health', status: 'HEALTHY', details: 'HTTP 200 OK - Response latency 24ms', timestamp: '2026-09-26T10:15:28.000Z' }
      ],
      details: 'All post-remediation verification checks PASSED. System fully operational.',
      verifiedAt: '2026-09-26T10:15:28.000Z'
    },
    startedAt: '2026-09-26T10:15:00.000Z',
    completedAt: '2026-09-26T10:15:28.000Z',
    executionDurationMs: 28000,
    mode: 'MOCK'
  },
  {
    incidentId: 'INC-092645-814',
    intake: {
      title: 'Database Connection Pool Exhaustion on order-db',
      description: 'Active client connections reached max_connections limit (500/500). Transactions queued.',
      serviceName: 'order-db',
      severity: 'CRITICAL',
      environment: 'production'
    },
    status: 'Remediating',
    diagnosis: {
      probableCause: 'Unindexed query locks in analytics batch job holding open connection pool.',
      confidenceScore: 0.89,
      summary: 'Selected Database Connection Flush Runbook (rb-db-conn-v1).'
    },
    selectedRunbook: {
      id: 'rb-db-conn-v1',
      title: 'Database Connection Flush & Lock Recovery Runbook',
      description: 'Terminates idle transactions and expands dynamic pool thresholds.'
    },
    executionLogs: [
      {
        stepId: 'step-1-db-check',
        stepName: 'Check Database Connection Count',
        toolName: 'check_database_connectivity',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: { activeConnections: 500, maxConnections: 500, idleInTransaction: 342 },
        timestamp: '2026-09-26T10:45:01.000Z',
        durationMs: 35
      },
      {
        stepId: 'step-2-remediate',
        stepName: 'Flush Idle DB Connections (PID 8812..8940)',
        toolName: 'terminate_idle_db_sessions',
        type: 'REMEDIATION',
        status: 'RUNNING',
        timestamp: '2026-09-26T10:45:15.000Z'
      }
    ],
    approvalRequest: {
      approvalId: 'APP-99812aef',
      incidentId: 'INC-092645-814',
      action: 'Terminate 342 Idle PostgreSQL Transactions',
      targetService: 'order-db',
      proposedCommand: "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction'",
      expectedImpact: 'Frees 342 connection slots immediately. Active checkout queries will resume within 500ms.',
      riskLevel: 'CRITICAL',
      status: 'APPROVED',
      requestedAt: '2026-09-26T10:45:05.000Z',
      respondedAt: '2026-09-26T10:45:12.000Z',
      approvedBy: 'Sarah Chen (Principal SRE)'
    },
    startedAt: '2026-09-26T10:45:00.000Z',
    mode: 'MOCK'
  },
  {
    incidentId: 'INC-092645-815',
    intake: {
      title: 'Memory Leak on recommendation-engine',
      description: 'Heap usage growing steadily by 150MB/hour in staging environment load test.',
      serviceName: 'recommendation-engine',
      severity: 'MEDIUM',
      environment: 'staging'
    },
    status: 'Rejected',
    diagnosis: {
      probableCause: 'Unbounded LRU cache growth during synthetic stress testing.',
      confidenceScore: 0.84,
      summary: 'Selected High Memory Consumption Runbook.'
    },
    selectedRunbook: {
      id: 'rb-mem-high-v1',
      title: 'High Memory Diagnostics & Dump Runbook',
      description: 'Takes heap dump and recycles staging container pool.'
    },
    executionLogs: [
      {
        stepId: 'step-1-mem-check',
        stepName: 'Check Node Memory Profiler',
        type: 'DIAGNOSTIC',
        status: 'COMPLETED',
        outputResult: { heapUsedMb: 3420, heapTotalMb: 4096, gcPauseMs: 450 },
        timestamp: '2026-09-26T09:30:01.000Z'
      },
      {
        stepId: 'step-2-approval',
        stepName: 'Human Approval Gate - Force Heap Dump & Restart Staging Cluster',
        type: 'HUMAN_APPROVAL',
        status: 'FAILED',
        outputResult: { rejectedBy: 'Alex Rivera (Perf Testing Lead)', reason: 'Staging memory profiler capture active. Do not interrupt test run.' },
        timestamp: '2026-09-26T09:32:00.000Z'
      }
    ],
    approvalRequest: {
      approvalId: 'APP-332190bb',
      incidentId: 'INC-092645-815',
      action: 'Force Container Restart & Dump Heap Profile',
      targetService: 'recommendation-engine',
      proposedCommand: 'node --heap-prof index.js && kill -9 1102',
      expectedImpact: 'Staging benchmark test run will be aborted.',
      riskLevel: 'MEDIUM',
      status: 'REJECTED',
      requestedAt: '2026-09-26T09:30:10.000Z',
      respondedAt: '2026-09-26T09:32:00.000Z',
      rejectedBy: 'Alex Rivera (Perf Testing Lead)',
      reason: 'Staging memory profiler capture active. Do not interrupt test run.'
    },
    startedAt: '2026-09-26T09:30:00.000Z',
    completedAt: '2026-09-26T09:32:00.000Z',
    executionDurationMs: 120000,
    mode: 'MOCK'
  }
];

export const MOCK_REPORTS: Record<string, IncidentReport> = {
  'INC-092645-813': {
    incidentId: 'INC-092645-813',
    title: 'Service Unavailable on checkout-gateway API',
    description: 'HTTP 503 Service Unavailable rates elevated to 88% on checkout endpoints.',
    serviceName: 'checkout-gateway',
    environment: 'production',
    severity: 'HIGH',
    selectedRunbook: {
      id: 'rb-avail-svc-v1',
      title: 'Service Availability Recovery Runbook'
    },
    diagnosis: {
      probableCause: 'Stale instance connection pool deadlock following upstream redis failover.',
      confidenceScore: 0.92,
      summary: 'Selected Service Availability Recovery Runbook (rb-avail-svc-v1).'
    },
    executionSteps: [
      { stepId: 's1', stepName: 'Check Service Health', type: 'DIAGNOSTIC', status: 'COMPLETED', details: '503 Service Unavailable', durationMs: 45 },
      { stepId: 's2', stepName: 'Get Logs', type: 'DIAGNOSTIC', status: 'COMPLETED', details: 'ConnectionTimeoutException: redis pool exhausted', durationMs: 30 },
      { stepId: 's3', stepName: 'Human Approval', type: 'HUMAN_APPROVAL', status: 'COMPLETED', details: 'Approved by David Miller', durationMs: 15000 },
      { stepId: 's4', stepName: 'Restart Service', type: 'REMEDIATION', status: 'COMPLETED', details: 'Graceful rollout restart completed. 4/4 pods healthy', durationMs: 1200 },
      { stepId: 's5', stepName: 'Verify Health', type: 'VERIFICATION', status: 'COMPLETED', details: 'HTTP 200 OK in 24ms', durationMs: 180 }
    ],
    approvalStatus: {
      approvalRequired: true,
      approvalId: 'APP-7f12e98a',
      status: 'APPROVED',
      action: 'Gracefully Restart checkout-gateway Pod Replicas',
      approvedBy: 'David Miller (Lead DevOps)',
      respondedAt: '2026-09-26T10:15:20.000Z'
    },
    remediationPerformed: {
      action: 'kubectl rollout restart deployment/checkout-gateway -n prod',
      success: true,
      details: '4/4 pods restarted cleanly without dropping active user checkout transactions.'
    },
    verificationResult: {
      status: 'Resolved',
      details: 'Closed-loop verification passed. Latency: 24ms, Error Rate: 0.00%.',
      checks: [
        { checkName: 'check_service_health', status: 'HEALTHY', details: 'HTTP 200 OK - Latency 24ms', timestamp: '2026-09-26T10:15:28.000Z' }
      ]
    },
    finalStatus: 'Resolved',
    executionDuration: '28.0 seconds',
    generatedAt: '2026-09-26T10:15:29.000Z'
  }
};
