import { Runbook } from '../types/incident.js';

export const RUNBOOK_REGISTRY: Record<string, Runbook> = {
  'rb-cpu-high-v1': {
    runbookId: 'rb-cpu-high-v1',
    title: 'High CPU Usage Runbook',
    targetCategory: 'CPU',
    description: 'Diagnoses high CPU spikes, inspects runaway process trees, and safely terminates culprit worker processes upon explicit human approval.',
    steps: [
      {
        stepId: 'step-1-cpu-check',
        stepName: 'Check CPU Utilization (check_cpu_usage)',
        type: 'DIAGNOSTIC',
        toolName: 'check_cpu_usage',
        description: 'Queries telemetry for CPU load average and core utilization percentage.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-proc-inspect',
        stepName: 'Inspect Running Processes (inspect_processes)',
        type: 'DIAGNOSTIC',
        toolName: 'inspect_processes',
        description: 'Identifies top CPU consumer processes and runaway PIDs.',
        requiresApproval: false
      },
      {
        stepId: 'step-3-human-gate',
        stepName: 'Human Approval Gate - Process Termination',
        type: 'HUMAN_APPROVAL',
        description: 'Pauses workflow execution and requests explicit human authorization before executing process termination.',
        requiresApproval: true,
        proposedActionName: 'Terminate Runaway Process (PID 4921)',
        expectedImpactDescription: 'Will send terminate signal to PID 4921. Primary service thread will continue executing; CPU will drop from ~95% to ~18%.'
      },
      {
        stepId: 'step-4-remediation',
        stepName: 'Execute Process Termination (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Sends terminate signal to runaway process PID 4921.',
        requiresApproval: false
      },
      {
        stepId: 'step-5-verification',
        stepName: 'Verify Service Recovery (verify_service_health)',
        type: 'VERIFICATION',
        toolName: 'verify_service_health',
        description: 'Re-evaluates CPU metrics and process list to confirm SLA recovery.',
        requiresApproval: false
      }
    ]
  },

  'rb-service-down-v1': {
    runbookId: 'rb-service-down-v1',
    title: 'Service Unavailable Runbook',
    targetCategory: 'AVAILABILITY',
    description: 'Diagnoses HTTP 5xx errors, analyzes liveness logs for OutOfMemory errors, and restarts deployment with expanded heap memory limits after approval.',
    steps: [
      {
        stepId: 'step-1-health-check',
        stepName: 'Check Service Health (check_service_health)',
        type: 'DIAGNOSTIC',
        toolName: 'check_service_health',
        description: 'Probes HTTP /health endpoint for response code, latency, and pod lifecycle state.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-log-inspect',
        stepName: 'Inspect Service Logs (get_service_logs)',
        type: 'DIAGNOSTIC',
        toolName: 'get_service_logs',
        description: 'Scans log stream for unhandled runtime exceptions and OOM events.',
        requiresApproval: false
      },
      {
        stepId: 'step-3-human-gate',
        stepName: 'Human Approval Gate - Deployment Restart',
        type: 'HUMAN_APPROVAL',
        description: 'Pauses workflow execution to request sign-off for pod restart with updated memory limits.',
        requiresApproval: true,
        proposedActionName: 'Rolling Deployment Restart & Rescale (2GiB Memory Limit)',
        expectedImpactDescription: 'Brief 2-3 second rolling pod restart. Clears heap space memory deadlock and restores HTTP 200 responses.'
      },
      {
        stepId: 'step-4-remediation',
        stepName: 'Execute Deployment Restart (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Executes rolling deployment restart with increased memory allocation.',
        requiresApproval: false
      },
      {
        stepId: 'step-5-verification',
        stepName: 'Verify Service Availability (verify_service_health)',
        type: 'VERIFICATION',
        toolName: 'verify_service_health',
        description: 'Probes HTTP endpoint to verify service health.',
        requiresApproval: false
      }
    ]
  },

  'rb-db-conn-fail-v1': {
    runbookId: 'rb-db-conn-fail-v1',
    title: 'Database Connection Failure Runbook',
    targetCategory: 'DATABASE',
    description: 'Diagnoses database connection pool exhaustion, detects unclosed idle session leaks, and resets pool sessions after human sign-off.',
    steps: [
      {
        stepId: 'step-1-db-check',
        stepName: 'Check Database Connectivity (check_database_connectivity)',
        type: 'DIAGNOSTIC',
        toolName: 'check_database_connectivity',
        description: 'Tests TCP connection and queries active vs max backend connection limits.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-db-err-inspect',
        stepName: 'Inspect Connection Errors (inspect_connection_errors)',
        type: 'DIAGNOSTIC',
        toolName: 'inspect_connection_errors',
        description: 'Scans connection state table to detect long-running unclosed idle queries.',
        requiresApproval: false
      },
      {
        stepId: 'step-3-human-gate',
        stepName: 'Human Approval Gate - Database Pool Reset',
        type: 'HUMAN_APPROVAL',
        description: 'Pauses workflow execution to request human sign-off before terminating idle database backend sessions.',
        requiresApproval: true,
        proposedActionName: 'Terminate Idle DB Connections & Reset Pool',
        expectedImpactDescription: 'Will terminate 78 leaked idle backend connections. Free pool slots will immediately restore database connection availability.'
      },
      {
        stepId: 'step-4-remediation',
        stepName: 'Execute Connection Pool Reset (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Executes backend query termination on orphaned idle sessions.',
        requiresApproval: false
      },
      {
        stepId: 'step-5-verification',
        stepName: 'Verify Connection Pool Status (verify_service_health)',
        type: 'VERIFICATION',
        toolName: 'verify_service_health',
        description: 'Queries database connection status to verify resolution.',
        requiresApproval: false
      }
    ]
  }
};

/**
 * Selects the appropriate runbook based on incident text keywords.
 */
export function selectRunbookForIncident(title: string, description: string): Runbook {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('cpu') || text.includes('high load') || text.includes('runaway') || text.includes('utilization') || text.includes('spike')) {
    return RUNBOOK_REGISTRY['rb-cpu-high-v1'];
  }

  if (text.includes('database') || text.includes('db') || text.includes('connection') || text.includes('postgres') || text.includes('pool')) {
    return RUNBOOK_REGISTRY['rb-db-conn-fail-v1'];
  }

  if (text.includes('unavailable') || text.includes('down') || text.includes('503') || text.includes('500') || text.includes('health') || text.includes('crash') || text.includes('out of memory') || text.includes('oom')) {
    return RUNBOOK_REGISTRY['rb-service-down-v1'];
  }

  return RUNBOOK_REGISTRY['rb-cpu-high-v1'];
}
