import {
  IncidentState,
  IncidentIntakeInput,
  IncidentReport,
  ApprovalRequest,
  ExecutionLogStep,
  StepStatus,
} from '@/types/incident';
import { INITIAL_MOCK_INCIDENTS, MOCK_REPORTS } from '@/lib/mock-data';
import { TrueForgeService } from './trueforge';

const STORAGE_KEY = 'runbook_executor_incidents_v1';
const MODE_KEY = 'runbook_executor_mode';

export class IncidentService {
  /**
   * Get active mode setting: 'auto' | 'live' | 'mock'
   */
  static getMode(): 'auto' | 'live' | 'mock' {
    if (typeof window === 'undefined') return 'auto';
    return (localStorage.getItem(MODE_KEY) as 'auto' | 'live' | 'mock') || 'auto';
  }

  /**
   * Set active mode setting
   */
  static setMode(mode: 'auto' | 'live' | 'mock') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MODE_KEY, mode);
    }
  }

  /**
   * Determine whether to use Live TrueForge backend
   */
  static async isLiveMode(): Promise<boolean> {
    const mode = this.getMode();
    if (mode === 'mock') return false;
    const health = await TrueForgeService.checkHealth();
    if (mode === 'live') return true;
    return health !== null && health.status !== 'DOWN';
  }

  /**
   * Get list of all local/mock stored incidents
   */
  private static getLocalIncidents(): IncidentState[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_INCIDENTS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_INCIDENTS));
      return INITIAL_MOCK_INCIDENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_INCIDENTS;
    }
  }

  /**
   * Save incidents array to local storage
   */
  private static saveLocalIncidents(incidents: IncidentState[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    }
  }

  /**
   * List all incidents (from Live backend or Local Mock state)
   */
  static async getAllIncidents(): Promise<{ incidents: IncidentState[]; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveList = await TrueForgeService.listIncidents();
      if (liveList) {
        return { incidents: liveList, isLive: true };
      }
    }
    return { incidents: this.getLocalIncidents(), isLive: false };
  }

  /**
   * Get single incident by ID
   */
  static async getIncidentById(incidentId: string): Promise<{ incident: IncidentState | null; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveIncident = await TrueForgeService.getIncidentStatus(incidentId);
      if (liveIncident) {
        return { incident: liveIncident, isLive: true };
      }
    }
    const localList = this.getLocalIncidents();
    const found = localList.find((i) => i.incidentId === incidentId) || null;
    return { incident: found, isLive: false };
  }

  /**
   * Submit new incident
   */
  static async submitIncident(intake: IncidentIntakeInput): Promise<{ incident: IncidentState; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveResult = await TrueForgeService.submitIncident(intake);
      if (liveResult) {
        return { incident: liveResult, isLive: true };
      }
    }

    // Mock Mode incident creation
    const newId = `INC-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const selectedRunbook =
      intake.severity === 'CRITICAL' && intake.title.toLowerCase().includes('cpu')
        ? { id: 'rb-cpu-high-v1', title: 'High CPU Usage Runbook', description: 'Diagnose and remediate high CPU spikes.' }
        : intake.title.toLowerCase().includes('database') || intake.description.toLowerCase().includes('db')
        ? { id: 'rb-db-conn-v1', title: 'Database Connection Pool Runbook', description: 'Flushes stale database connection locks.' }
        : { id: 'rb-avail-svc-v1', title: 'Service Availability Recovery Runbook', description: 'Restarts unresponsive service pod pool.' };

    const mockIncident: IncidentState = {
      incidentId: newId,
      intake,
      status: 'Awaiting Approval',
      diagnosis: {
        probableCause: `Automated LLM diagnosis for '${intake.serviceName}': Anomalous behavior detected in ${intake.environment} environment.`,
        confidenceScore: 0.94,
        summary: `Analyzed incident context for '${intake.serviceName}'. Matched runbook '${selectedRunbook.title}' (${selectedRunbook.id}).`
      },
      selectedRunbook,
      executionLogs: [
        {
          stepId: `step-1-diag`,
          stepName: `Check Service Metrics (${intake.serviceName})`,
          toolName: 'check_service_health',
          type: 'DIAGNOSTIC',
          status: 'COMPLETED',
          outputResult: { status: 'DEGRADED', latencyMs: 1420, errorRatePct: 4.8 },
          timestamp: now,
          durationMs: 28
        },
        {
          stepId: `step-2-diag`,
          stepName: `Inspect Service Logs`,
          toolName: 'get_service_logs',
          type: 'DIAGNOSTIC',
          status: 'COMPLETED',
          outputResult: { errorLogs: ['Warning: Resource limit reached', 'Failed to allocate thread pool buffer'] },
          timestamp: now,
          durationMs: 34
        },
        {
          stepId: `step-3-approval`,
          stepName: 'TrueForge Human Approval Gate',
          type: 'HUMAN_APPROVAL',
          status: 'AWAITING_APPROVAL',
          timestamp: now
        }
      ],
      approvalRequest: {
        approvalId: `APP-${Math.random().toString(36).substring(2, 10)}`,
        incidentId: newId,
        action: `Execute Remediation Action on ${intake.serviceName}`,
        targetService: intake.serviceName,
        proposedCommand: `kubectl rollout restart deployment/${intake.serviceName} -n ${intake.environment}`,
        expectedImpact: `Will restart worker pods for ${intake.serviceName}. Response times expected to return to baseline (< 50ms).`,
        riskLevel: intake.severity,
        status: 'PENDING',
        requestedAt: now
      },
      startedAt: now,
      mode: 'MOCK'
    };

    const currentList = this.getLocalIncidents();
    const updatedList = [mockIncident, ...currentList];
    this.saveLocalIncidents(updatedList);

    return { incident: mockIncident, isLive: false };
  }

  /**
   * Approve pending remediation action
   */
  static async approveIncident(
    incidentId: string,
    approvedBy: string,
    reason: string
  ): Promise<{ incident: IncidentState | null; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveResult = await TrueForgeService.approveRemediation(incidentId, approvedBy, reason);
      if (liveResult) {
        return { incident: liveResult, isLive: true };
      }
    }

    const localList = this.getLocalIncidents();
    const index = localList.findIndex((i) => i.incidentId === incidentId);
    if (index === -1) return { incident: null, isLive: false };

    const target = localList[index];
    const now = new Date().toISOString();

    const updatedApproval: ApprovalRequest = {
      ...(target.approvalRequest || {
        approvalId: `APP-${Math.random().toString(36).substring(2, 10)}`,
        incidentId: incidentId,
        action: `Remediate ${target.intake.serviceName}`,
        targetService: target.intake.serviceName,
        proposedCommand: 'simulate_remediation',
        expectedImpact: 'Restore normal operating status.',
        riskLevel: target.intake.severity,
        requestedAt: now,
      }),
      status: 'APPROVED',
      approvedBy: approvedBy || 'SRE Lead Operator',
      reason: reason || 'Approved via Human Approval Center',
      respondedAt: now
    };

    const updatedIncident: IncidentState = {
      ...target,
      status: 'Resolved',
      approvalRequest: updatedApproval,
      remediationResult: {
        actionExecuted: updatedApproval.action,
        success: true,
        outputDetails: `Remediation command '${updatedApproval.proposedCommand}' executed cleanly. Service restored.`,
        executedAt: now
      },
      verificationResult: {
        status: 'Resolved',
        verificationChecks: [
          { checkName: 'verify_service_health', status: 'HEALTHY', details: 'All post-remediation probes returned HTTP 200 OK', timestamp: now }
        ],
        details: 'Closed-loop verification passed cleanly.',
        verifiedAt: now
      },
      completedAt: now,
      executionDurationMs: 14200,
      executionLogs: target.executionLogs.map((log): ExecutionLogStep => {
        if (log.type === 'HUMAN_APPROVAL') {
          return { ...log, status: 'COMPLETED' as StepStatus, outputResult: { approvedBy, reason } };
        }
        return log;
      }).concat([
        {
          stepId: 'step-remediate-exec',
          stepName: 'Execute Approved Remediation',
          type: 'REMEDIATION',
          status: 'COMPLETED' as StepStatus,
          outputResult: { success: true },
          timestamp: now,
          durationMs: 850
        },
        {
          stepId: 'step-verify-exec',
          stepName: 'Verify Incident Resolution',
          type: 'VERIFICATION',
          status: 'COMPLETED' as StepStatus,
          outputResult: { status: 'HEALTHY' },
          timestamp: now,
          durationMs: 120
        }
      ])
    };

    localList[index] = updatedIncident;
    this.saveLocalIncidents(localList);

    return { incident: updatedIncident, isLive: false };
  }

  /**
   * Reject pending remediation action
   */
  static async rejectIncident(
    incidentId: string,
    rejectedBy: string,
    reason: string
  ): Promise<{ incident: IncidentState | null; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveResult = await TrueForgeService.rejectRemediation(incidentId, rejectedBy, reason);
      if (liveResult) {
        return { incident: liveResult, isLive: true };
      }
    }

    const localList = this.getLocalIncidents();
    const index = localList.findIndex((i) => i.incidentId === incidentId);
    if (index === -1) return { incident: null, isLive: false };

    const target = localList[index];
    const now = new Date().toISOString();

    const updatedApproval: ApprovalRequest = {
      ...(target.approvalRequest || {
        approvalId: `APP-${Math.random().toString(36).substring(2, 10)}`,
        incidentId: incidentId,
        action: `Remediate ${target.intake.serviceName}`,
        targetService: target.intake.serviceName,
        proposedCommand: 'simulate_remediation',
        expectedImpact: 'Restore normal operating status.',
        riskLevel: target.intake.severity,
        requestedAt: now,
      }),
      status: 'REJECTED',
      rejectedBy: rejectedBy || 'SRE Supervisor',
      reason: reason || 'Action rejected by human supervisor.',
      respondedAt: now
    };

    const updatedIncident: IncidentState = {
      ...target,
      status: 'Rejected',
      approvalRequest: updatedApproval,
      completedAt: now,
      executionLogs: target.executionLogs.map((log): ExecutionLogStep => {
        if (log.type === 'HUMAN_APPROVAL') {
          return { ...log, status: 'FAILED' as StepStatus, outputResult: { rejectedBy, reason } };
        }
        return log;
      })
    };

    localList[index] = updatedIncident;
    this.saveLocalIncidents(localList);

    return { incident: updatedIncident, isLive: false };
  }

  /**
   * Get structured Incident Report
   */
  static async getReport(incidentId: string): Promise<{ report: IncidentReport | null; isLive: boolean }> {
    const isLive = await this.isLiveMode();
    if (isLive) {
      const liveReport = await TrueForgeService.getIncidentReport(incidentId);
      if (liveReport) {
        return { report: liveReport, isLive: true };
      }
    }

    if (MOCK_REPORTS[incidentId]) {
      return { report: MOCK_REPORTS[incidentId], isLive: false };
    }

    const { incident } = await this.getIncidentById(incidentId);
    if (!incident) return { report: null, isLive: false };

    const generatedReport: IncidentReport = {
      incidentId: incident.incidentId,
      title: incident.intake.title,
      description: incident.intake.description,
      serviceName: incident.intake.serviceName,
      environment: incident.intake.environment,
      severity: incident.intake.severity,
      selectedRunbook: {
        id: incident.selectedRunbook?.id || 'rb-unknown',
        title: incident.selectedRunbook?.title || 'Unknown Runbook'
      },
      diagnosis: {
        probableCause: incident.diagnosis?.probableCause || 'Automated diagnosis',
        confidenceScore: incident.diagnosis?.confidenceScore || 0.9,
        summary: incident.diagnosis?.summary || ''
      },
      executionSteps: incident.executionLogs.map((log) => ({
        stepId: log.stepId,
        stepName: log.stepName,
        type: log.type,
        status: log.status,
        details: JSON.stringify(log.outputResult || {}),
        durationMs: log.durationMs
      })),
      approvalStatus: {
        approvalRequired: !!incident.approvalRequest,
        approvalId: incident.approvalRequest?.approvalId,
        status: incident.approvalRequest?.status,
        action: incident.approvalRequest?.action,
        approvedBy: incident.approvalRequest?.approvedBy,
        respondedAt: incident.approvalRequest?.respondedAt,
        rejectionReason: incident.approvalRequest?.reason
      },
      remediationPerformed: incident.remediationResult
        ? {
            action: incident.remediationResult.actionExecuted,
            success: incident.remediationResult.success,
            details: incident.remediationResult.outputDetails
          }
        : null,
      verificationResult: incident.verificationResult
        ? {
            status: incident.verificationResult.status,
            details: incident.verificationResult.details,
            checks: incident.verificationResult.verificationChecks
          }
        : null,
      finalStatus: incident.status,
      executionDuration: incident.executionDurationMs
        ? `${(incident.executionDurationMs / 1000).toFixed(1)} seconds`
        : 'Active / Pending',
      generatedAt: new Date().toISOString()
    };

    return { report: generatedReport, isLive: false };
  }
}
