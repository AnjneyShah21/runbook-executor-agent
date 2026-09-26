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
  },

  'rb-k8s-oom-v1': {
    runbookId: 'rb-k8s-oom-v1',
    title: 'Kubernetes Pod OOMKill & Memory Leak Runbook',
    targetCategory: 'AVAILABILITY',
    description: 'Inspects heap dump dumps, detects memory leaks in pod worker containers, and increases RAM resource limits.',
    steps: [
      {
        stepId: 'step-1-mem-check',
        stepName: 'Inspect Pod Memory (check_service_health)',
        type: 'DIAGNOSTIC',
        toolName: 'check_service_health',
        description: 'Queries cgroup memory RSS utilization and restart count.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-human-gate',
        stepName: 'Human Approval Gate - Rescale RAM Allocation',
        type: 'HUMAN_APPROVAL',
        description: 'Requests authorization to scale memory resource requests from 512MiB to 2GiB.',
        requiresApproval: true,
        proposedActionName: 'Expand K8s Memory Limit to 2GiB & Trigger Rolling Patch',
        expectedImpactDescription: 'Prevents imminent OOMKilled pod crash loops. Zero downtime rolling update.'
      },
      {
        stepId: 'step-3-remediation',
        stepName: 'Execute Rolling Patch (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Applies patch deployment manifest with updated memory request values.',
        requiresApproval: false
      }
    ]
  },

  'rb-disk-full-v1': {
    runbookId: 'rb-disk-full-v1',
    title: 'Disk Storage Exhaustion & Log Purge Runbook',
    targetCategory: 'AVAILABILITY',
    description: 'Diagnoses /var/log volume saturation (>98%) and purges stale archived debug logs.',
    steps: [
      {
        stepId: 'step-1-disk-check',
        stepName: 'Inspect Volume Utilization (get_service_logs)',
        type: 'DIAGNOSTIC',
        toolName: 'get_service_logs',
        description: 'Checks df -h disk usage across mounted volume blocks.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-human-gate',
        stepName: 'Human Approval Gate - Purge Archived Logs',
        type: 'HUMAN_APPROVAL',
        description: 'Requests authorization to truncate debug log archives older than 7 days.',
        requiresApproval: true,
        proposedActionName: 'Purge /var/log Debug Archives & Compress Journal Logs',
        expectedImpactDescription: 'Frees 45GB of disk space on mounted volume block. Restores write I/O performance.'
      },
      {
        stepId: 'step-3-remediation',
        stepName: 'Execute Log Purge (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Executes journalctl --vacuum-time=3d and logrotate compression.',
        requiresApproval: false
      }
    ]
  },

  'rb-kafka-lag-v1': {
    runbookId: 'rb-kafka-lag-v1',
    title: 'Message Queue Consumer Lag & Backpressure Runbook',
    targetCategory: 'AVAILABILITY',
    description: 'Detects consumer group offset lag (>50,000 unread messages) and scales out consumer worker pods.',
    steps: [
      {
        stepId: 'step-1-lag-check',
        stepName: 'Inspect Consumer Group Lag (inspect_processes)',
        type: 'DIAGNOSTIC',
        toolName: 'inspect_processes',
        description: 'Checks Kafka broker consumer lag metrics per partition.',
        requiresApproval: false
      },
      {
        stepId: 'step-2-human-gate',
        stepName: 'Human Approval Gate - Scale Consumer Replicas',
        type: 'HUMAN_APPROVAL',
        description: 'Requests authorization to scale out consumer group deployment from 3 to 8 pods.',
        requiresApproval: true,
        proposedActionName: 'Scale Out Consumer Pod Replicas (3 -> 8 Pods)',
        expectedImpactDescription: 'Drains unread message queue backpressure within 3 minutes.'
      },
      {
        stepId: 'step-3-remediation',
        stepName: 'Execute Replica Scaling (simulate_remediation)',
        type: 'REMEDIATION',
        toolName: 'simulate_remediation',
        description: 'Executes kubectl scale deployment consumer-worker --replicas=8.',
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

  if (text.includes('database') || text.includes('db') || text.includes('connection') || text.includes('postgres') || text.includes('pool') || text.includes('sql')) {
    return RUNBOOK_REGISTRY['rb-db-conn-fail-v1'];
  }

  if (text.includes('memory') || text.includes('oom') || text.includes('heap') || text.includes('leak') || text.includes('k8s')) {
    return RUNBOOK_REGISTRY['rb-k8s-oom-v1'];
  }

  if (text.includes('disk') || text.includes('storage') || text.includes('volume') || text.includes('log') || text.includes('full')) {
    return RUNBOOK_REGISTRY['rb-disk-full-v1'];
  }

  if (text.includes('kafka') || text.includes('queue') || text.includes('lag') || text.includes('consumer') || text.includes('backpressure')) {
    return RUNBOOK_REGISTRY['rb-kafka-lag-v1'];
  }

  if (text.includes('unavailable') || text.includes('down') || text.includes('503') || text.includes('500') || text.includes('health') || text.includes('crash')) {
    return RUNBOOK_REGISTRY['rb-service-down-v1'];
  }

  return RUNBOOK_REGISTRY['rb-cpu-high-v1'];
}
