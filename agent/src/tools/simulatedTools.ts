import { DiagnosticCheckResult, RemediationResult, VerificationResult } from '../types/incident.js';

/**
 * Simulated Infrastructure & Diagnostic Tools for TrueForge Agent Execution Loop.
 * Operates purely on simulated metrics and safely isolated environments.
 */

// Mutable state store for simulation testing
const stateStore: Record<string, { cpu: number; memory: number; health: string; dbConn: string; activePool: number; simulatedFailure?: boolean }> = {
  'payment-service': { cpu: 94.8, memory: 78.2, health: 'DEGRADED', dbConn: 'OK', activePool: 24 },
  'auth-service': { cpu: 22.1, memory: 45.0, health: 'UNAVAILABLE', dbConn: 'OK', activePool: 12 },
  'user-db': { cpu: 40.0, memory: 65.0, health: 'OK', dbConn: 'MAX_CONNECTIONS_REACHED', activePool: 100 },
  'unresolvable-service': { cpu: 99.9, memory: 99.0, health: 'CRITICAL', dbConn: 'DEADLOCK', activePool: 100, simulatedFailure: true },
  'default-service': { cpu: 89.2, memory: 81.0, health: 'DEGRADED', dbConn: 'OK', activePool: 15 }
};

export class SimulatedInfrastructureTools {
  /**
   * Tool: check_cpu_usage
   */
  static async checkCpuUsage(serviceName: string): Promise<DiagnosticCheckResult> {
    const serviceState = stateStore[serviceName] || stateStore['default-service'];
    const highCpu = serviceState.cpu > 80;

    return {
      checkName: 'check_cpu_usage',
      status: highCpu ? 'DEGRADED' : 'HEALTHY',
      metrics: {
        cpuPercent: serviceState.cpu,
        memoryPercent: serviceState.memory,
        loadAverage1m: highCpu ? 8.42 : 1.15,
        coresAllocated: 4
      },
      details: highCpu 
        ? `ALERT: CPU usage on '${serviceName}' is at ${serviceState.cpu}%, exceeding warning threshold (80%).`
        : `CPU usage on '${serviceName}' is normal (${serviceState.cpu}%).`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: inspect_processes
   */
  static async inspectProcesses(serviceName: string): Promise<DiagnosticCheckResult> {
    const serviceState = stateStore[serviceName] || stateStore['default-service'];
    const highCpu = serviceState.cpu > 80;

    const processes = highCpu
      ? [
          { pid: 4921, name: 'worker-thread-runaway', cpu: 78.5, memory: 14.2, status: 'RUNNING' },
          { pid: 1002, name: 'node-main', cpu: 10.1, memory: 42.0, status: 'RUNNING' }
        ]
      : [
          { pid: 1002, name: 'node-main', cpu: 12.0, memory: 40.0, status: 'RUNNING' }
        ];

    return {
      checkName: 'inspect_processes',
      status: highCpu ? 'FAILED' : 'HEALTHY',
      metrics: {
        totalProcesses: processes.length,
        runawayProcessDetected: highCpu,
        targetPid: highCpu ? 4921 : null
      },
      details: highCpu 
        ? `Identified runaway process PID 4921 ('worker-thread-runaway') consuming 78.5% CPU due to unhandled compute loop.`
        : `All running processes on '${serviceName}' demonstrate normal CPU distribution.`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: check_service_health
   */
  static async checkServiceHealth(serviceName: string): Promise<DiagnosticCheckResult> {
    const serviceState = stateStore[serviceName] || stateStore['auth-service'];
    const isDown = serviceState.health === 'UNAVAILABLE' || serviceState.health === 'CRITICAL';

    return {
      checkName: 'check_service_health',
      status: isDown ? 'FAILED' : 'HEALTHY',
      metrics: {
        httpStatus: isDown ? 503 : 200,
        responseTimeMs: isDown ? 15000 : 42,
        podStatus: isDown ? 'CrashLoopBackOff' : 'Running'
      },
      details: isDown
        ? `CRITICAL: Service health probe GET /health returned HTTP 503 Service Unavailable on '${serviceName}'.`
        : `Service health endpoint GET /health on '${serviceName}' responded HTTP 200 OK (42ms).`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: get_service_logs
   */
  static async getServiceLogs(serviceName: string): Promise<DiagnosticCheckResult> {
    const serviceState = stateStore[serviceName] || stateStore['auth-service'];
    const isDown = serviceState.health === 'UNAVAILABLE' || serviceState.health === 'CRITICAL';

    return {
      checkName: 'get_service_logs',
      status: isDown ? 'FAILED' : 'HEALTHY',
      metrics: {
        errorLogsLast15m: isDown ? 142 : 0,
        primaryException: isDown ? 'java.lang.OutOfMemoryError: Java heap space' : 'NONE'
      },
      details: isDown
        ? `Extracted 140+ log occurrences of 'java.lang.OutOfMemoryError: Java heap space' on '${serviceName}'.`
        : `Recent log streams contain zero fatal unhandled exceptions on '${serviceName}'.`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: check_database_connectivity
   */
  static async checkDatabaseConnectivity(dbName: string): Promise<DiagnosticCheckResult> {
    const dbState = stateStore[dbName] || stateStore['user-db'];
    const connectionFailed = dbState.dbConn === 'MAX_CONNECTIONS_REACHED' || dbState.dbConn === 'DEADLOCK';

    return {
      checkName: 'check_database_connectivity',
      status: connectionFailed ? 'FAILED' : 'HEALTHY',
      metrics: {
        activeConnections: dbState.activePool,
        maxPoolSize: 100,
        idleConnections: connectionFailed ? 0 : 35
      },
      details: connectionFailed
        ? `CRITICAL: Database connection pool exhausted on '${dbName}' (100/100 connections). New client connections timing out.`
        : `Database connection pool on '${dbName}' is operating normally (${dbState.activePool}/100 connections).`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: inspect_connection_errors
   */
  static async inspectConnectionErrors(dbName: string): Promise<DiagnosticCheckResult> {
    const dbState = stateStore[dbName] || stateStore['user-db'];
    const connectionFailed = dbState.dbConn === 'MAX_CONNECTIONS_REACHED' || dbState.dbConn === 'DEADLOCK';

    return {
      checkName: 'inspect_connection_errors',
      status: connectionFailed ? 'FAILED' : 'HEALTHY',
      metrics: {
        leakedConnections: connectionFailed ? 78 : 0,
        unclosedQueryDurationMin: connectionFailed ? 65 : 0
      },
      details: connectionFailed
        ? `Detected 78 leaked idle connections originating from orphaned analytics export session lingering for >60 minutes.`
        : `No orphaned connection leaks detected on '${dbName}'.`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tool: simulate_remediation (Executes state-mutating remediation actions)
   */
  static async simulateRemediation(serviceName: string, actionType: 'KILL_PROCESS' | 'RESTART_SERVICE' | 'RESET_DB_POOL'): Promise<RemediationResult> {
    const state = stateStore[serviceName] || stateStore['default-service'];

    // Handle intentional verification failure test cases
    if (state && state.simulatedFailure) {
      return {
        actionExecuted: `Attempted ${actionType} on unresolvable infrastructure`,
        success: false,
        outputDetails: `Remediation execution returned exit code 1: Persistent hardware failure on host machine.`,
        executedAt: new Date().toISOString()
      };
    }

    if (actionType === 'KILL_PROCESS') {
      if (stateStore[serviceName]) {
        stateStore[serviceName].cpu = 18.5;
        stateStore[serviceName].health = 'HEALTHY';
      }
      return {
        actionExecuted: `kill -9 4921 (Terminated runaway process 'worker-thread-runaway')`,
        success: true,
        outputDetails: `Terminated process PID 4921. Host CPU on '${serviceName}' normalized to 18.5%.`,
        executedAt: new Date().toISOString()
      };
    } else if (actionType === 'RESTART_SERVICE') {
      if (stateStore[serviceName]) {
        stateStore[serviceName].health = 'OK';
        stateStore[serviceName].memory = 42.0;
      }
      return {
        actionExecuted: `kubectl rollout restart deployment/${serviceName} --limits=memory=2Gi`,
        success: true,
        outputDetails: `Restarted deployment/${serviceName} with expanded memory limits. Liveness probe returning HTTP 200.`,
        executedAt: new Date().toISOString()
      };
    } else {
      if (stateStore[serviceName]) {
        stateStore[serviceName].dbConn = 'OK';
        stateStore[serviceName].activePool = 15;
      }
      return {
        actionExecuted: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle'`,
        success: true,
        outputDetails: `Terminated 78 orphaned idle backend connections on '${serviceName}'. Pool size reduced to 15.`,
        executedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Tool: verify_service_health (Post-remediation verification check)
   */
  static async verifyServiceHealth(serviceName: string, category: 'CPU' | 'AVAILABILITY' | 'DATABASE'): Promise<VerificationResult> {
    const state = stateStore[serviceName];
    if (state && state.simulatedFailure) {
      return {
        status: 'Unresolved',
        verificationChecks: [{
          checkName: 'Post-Remediation Verification Probe',
          status: 'FAILED',
          details: `Post-remediation check failed. Service '${serviceName}' remains in CRITICAL state.`,
          timestamp: new Date().toISOString()
        }],
        details: `Verification failed. The service did not recover following remediation.`,
        verifiedAt: new Date().toISOString()
      };
    }

    const checks: DiagnosticCheckResult[] = [];

    if (category === 'CPU') {
      const cpu = await this.checkCpuUsage(serviceName);
      const proc = await this.inspectProcesses(serviceName);
      checks.push(cpu, proc);
    } else if (category === 'AVAILABILITY') {
      const health = await this.checkServiceHealth(serviceName);
      const logs = await this.getServiceLogs(serviceName);
      checks.push(health, logs);
    } else {
      const db = await this.checkDatabaseConnectivity(serviceName);
      const errs = await this.inspectConnectionErrors(serviceName);
      checks.push(db, errs);
    }

    const allPassed = checks.every(c => c.status === 'HEALTHY');

    return {
      status: allPassed ? 'Resolved' : 'Partially Resolved',
      verificationChecks: checks,
      details: allPassed 
        ? `All post-remediation verification checks PASSED for '${serviceName}'. Metrics restored to baseline SLA.`
        : `One or more verification checks failed for '${serviceName}'. Escalated for manual review.`,
      verifiedAt: new Date().toISOString()
    };
  }
}
