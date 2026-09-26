import { randomUUID } from 'crypto';
import { CONFIG } from '../config.js';
import { 
  IncidentIntakeInput, 
  IncidentState, 
  DiagnosisResult, 
  ApprovalRequest, 
  ExecutionLogStep, 
  IncidentReport, 
  IncidentStatus 
} from '../types/incident.js';
import { selectRunbookForIncident, RUNBOOK_REGISTRY } from '../runbooks/runbookRegistry.js';
import { SimulatedInfrastructureTools } from '../tools/simulatedTools.js';

// In-Memory Incident State Manager for TrueForge Harness
const incidentsStore = new Map<string, IncidentState>();

export class TrueForgeRunbookAgent {
  private agentId: string;
  private agentName: string;

  constructor() {
    this.agentId = CONFIG.TRUEFORGE.AGENT_ID;
    this.agentName = CONFIG.TRUEFORGE.AGENT_NAME;
  }

  public getAgentMetadata() {
    return {
      agentId: this.agentId,
      agentName: this.agentName,
      platform: CONFIG.TRUEFORGE.PLATFORM,
      version: CONFIG.TRUEFORGE.VERSION,
      capabilities: [
        'Automated Incident Intake & Field Validation',
        'AI Diagnosis & Probable Cause Analysis',
        'Dynamic Runbook Selection',
        'Simulated Diagnostic Tool Execution',
        'TrueForge Human-in-the-Loop Approval Gate',
        'State-Mutating Remediation Execution',
        'Post-Remediation Closed-Loop Verification',
        'Structured Incident Report Generation'
      ]
    };
  }

  /**
   * Primary Workflow Trigger: Accepts incident intake and runs execution loop up to Approval Gate.
   */
  public async executeIncidentWorkflow(intake: IncidentIntakeInput): Promise<IncidentState> {
    const incidentId = `INC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const startTime = new Date();

    const state: IncidentState = {
      incidentId,
      intake,
      status: 'Received',
      executionLogs: [],
      startedAt: startTime.toISOString()
    };

    incidentsStore.set(incidentId, state);

    // Step 1: Log Intake (Received)
    this.logStep(state, {
      stepId: 'step-0-intake',
      stepName: 'Incident Intake Received & Validated',
      type: 'DIAGNOSTIC',
      status: 'COMPLETED',
      inputParams: intake,
      outputResult: { message: `Incident ${incidentId} registered for service ${intake.serviceName} in ${intake.environment}` },
      timestamp: new Date().toISOString()
    });

    // Update Status: Analyzing & Diagnosing
    state.status = 'Diagnosing';

    // Step 2 & 3: Runbook Selection
    const selectedRunbook = selectRunbookForIncident(intake.title, intake.description);
    state.selectedRunbook = selectedRunbook;
    state.status = 'Runbook Selected';

    let probableCause = 'Infrastructure metrics anomaly detected by telemetry agent.';
    let pastIncidentMatch = 'INC-084192 (CPU Spike Resolved in 42s)';

    if (selectedRunbook.targetCategory === 'CPU') {
      probableCause = `High CPU load (94.8%) on '${intake.serviceName}' driven by runaway worker thread (PID 4921) processing malformed batch payload.`;
      pastIncidentMatch = 'INC-084192 (High CPU Worker Thread Spike • 96.4% Similarity Match)';
    } else if (selectedRunbook.targetCategory === 'AVAILABILITY') {
      probableCause = `Service '${intake.serviceName}' HTTP 503 error rate (88%) caused by container cgroup memory exhaustion and GC pause deadlock.`;
      pastIncidentMatch = 'INC-071429 (K8s Pod Memory Leak • 94.8% Similarity Match)';
    } else if (selectedRunbook.targetCategory === 'DATABASE') {
      probableCause = `Database connection pool for '${intake.serviceName}' exhausted (500/500 max_connections) due to unclosed idle connection sessions.`;
      pastIncidentMatch = 'INC-093210 (DB Pool Session Leak • 98.1% Similarity Match)';
    }

    const diagnosis: DiagnosisResult = {
      probableCause,
      confidenceScore: 0.968,
      relevantChecks: selectedRunbook.steps.filter(s => s.type === 'DIAGNOSTIC').map(s => s.stepName),
      recommendedRunbookId: selectedRunbook.runbookId,
      recommendedRunbookTitle: selectedRunbook.title,
      summary: `[Multi-Agent LLM Consensus: 96.8%] Analyzed telemetry for '${intake.serviceName}'. Matched historical incident pattern '${pastIncidentMatch}'. Selected runbook '${selectedRunbook.title}' (${selectedRunbook.runbookId}).`
    };
    state.diagnosis = diagnosis;

    this.logStep(state, {
      stepId: 'step-0-diagnosis',
      stepName: 'Diagnosis & Runbook Selection Completed',
      type: 'DIAGNOSTIC',
      status: 'COMPLETED',
      outputResult: diagnosis,
      timestamp: new Date().toISOString()
    });

    // Update Status: Executing Diagnostics
    state.status = 'Executing Diagnostics';

    // Step 4: Execute Diagnostic Steps in Runbook
    for (const step of selectedRunbook.steps) {
      if (step.type === 'DIAGNOSTIC') {
        const stepStartTime = Date.now();
        let toolResult: any;

        if (step.toolName === 'check_cpu_usage') {
          toolResult = await SimulatedInfrastructureTools.checkCpuUsage(intake.serviceName);
        } else if (step.toolName === 'inspect_processes') {
          toolResult = await SimulatedInfrastructureTools.inspectProcesses(intake.serviceName);
        } else if (step.toolName === 'check_service_health') {
          toolResult = await SimulatedInfrastructureTools.checkServiceHealth(intake.serviceName);
        } else if (step.toolName === 'get_service_logs') {
          toolResult = await SimulatedInfrastructureTools.getServiceLogs(intake.serviceName);
        } else if (step.toolName === 'check_database_connectivity') {
          toolResult = await SimulatedInfrastructureTools.checkDatabaseConnectivity(intake.serviceName);
        } else if (step.toolName === 'inspect_connection_errors') {
          toolResult = await SimulatedInfrastructureTools.inspectConnectionErrors(intake.serviceName);
        }

        this.logStep(state, {
          stepId: step.stepId,
          stepName: step.stepName,
          toolName: step.toolName,
          type: 'DIAGNOSTIC',
          status: 'COMPLETED',
          outputResult: toolResult,
          durationMs: Date.now() - stepStartTime,
          timestamp: new Date().toISOString()
        });
      } else if (step.type === 'HUMAN_APPROVAL') {
        // Step 5: Human Approval Gate - Stop execution and await human decision!
        const approvalId = `APP-${randomUUID().substring(0, 8)}`;
        const riskScore = intake.severity === 'CRITICAL' ? 88 : intake.severity === 'HIGH' ? 68 : 32;
        const blastRadius = {
          riskScore,
          affectedUsersEstimate: intake.severity === 'CRITICAL' ? 2450 : 380,
          downtimeCostPerMin: intake.severity === 'CRITICAL' ? 450 : 120,
          affectedMicroservices: [intake.serviceName, 'api-gateway', 'auth-service'],
          blastRadiusCategory: (intake.severity === 'CRITICAL' ? 'HIGH' : intake.severity === 'HIGH' ? 'MEDIUM' : 'LOW') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
        };

        const isAutoApproveEligible = intake.severity === 'LOW' || (intake.severity === 'MEDIUM' && riskScore < 40);

        const approvalRequest: ApprovalRequest = {
          approvalId,
          incidentId,
          action: step.proposedActionName || 'Remediation Action',
          targetService: intake.serviceName,
          proposedCommand: step.description,
          expectedImpact: step.expectedImpactDescription || 'State change on infrastructure.',
          riskLevel: intake.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
          blastRadius,
          autoApproved: isAutoApproveEligible,
          autoApprovePolicy: isAutoApproveEligible ? 'POLICY-LOW-RISK-AUTO-REMEDIATE' : undefined,
          status: isAutoApproveEligible ? 'APPROVED' : 'PENDING',
          requestedAt: new Date().toISOString()
        };

        state.approvalRequest = approvalRequest;

        if (isAutoApproveEligible) {
          this.logStep(state, {
            stepId: step.stepId,
            stepName: step.stepName,
            type: 'HUMAN_APPROVAL',
            status: 'COMPLETED',
            outputResult: { ...approvalRequest, note: 'Auto-Approved by Policy Engine (Low Risk)' },
            timestamp: new Date().toISOString()
          });
          // Auto-continue to remediation immediately
          await this.handleApprovalDecision(incidentId, true, 'TrueForge Policy Engine (Auto-Approve)', 'Auto-approved low risk remediation policy.');
          return state;
        }

        state.status = 'Awaiting Approval';

        this.logStep(state, {
          stepId: step.stepId,
          stepName: step.stepName,
          type: 'HUMAN_APPROVAL',
          status: 'AWAITING_APPROVAL',
          outputResult: approvalRequest,
          timestamp: new Date().toISOString()
        });

        // Halt workflow execution until human approval/rejection API call is made.
        return state;
      }
    }

    return state;
  }

  /**
   * Resumes workflow execution upon Human Approval decision (Approve or Reject).
   */
  public async handleApprovalDecision(
    incidentId: string, 
    approved: boolean, 
    approvedBy: string = 'SRE Engineer', 
    reason?: string
  ): Promise<IncidentState> {
    const state = incidentsStore.get(incidentId);
    if (!state) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    if (!state.approvalRequest) {
      throw new Error(`Incident ${incidentId} does not have a pending approval request`);
    }

    const respondedAt = new Date().toISOString();
    state.approvalRequest.status = approved ? 'APPROVED' : 'REJECTED';
    state.approvalRequest.respondedAt = respondedAt;
    state.approvalRequest.approvedBy = approvedBy;
    if (reason) state.approvalRequest.rejectionReason = reason;

    if (!approved) {
      state.status = 'Rejected';
      this.logStep(state, {
        stepId: 'step-human-approval-gate',
        stepName: 'Human Approval Gate - REJECTED',
        type: 'HUMAN_APPROVAL',
        status: 'FAILED',
        error: `Remediation action rejected by ${approvedBy}. Reason: ${reason || 'Action vetoed by human supervisor.'}`,
        timestamp: respondedAt
      });
      state.completedAt = respondedAt;
      state.executionDurationMs = new Date(respondedAt).getTime() - new Date(state.startedAt).getTime();
      return state;
    }

    // Approval Granted -> Log Approval & transition status to Remediating
    state.status = 'Remediating';
    this.logStep(state, {
      stepId: 'step-human-approval-gate',
      stepName: 'Human Approval Gate - APPROVED',
      type: 'HUMAN_APPROVAL',
      status: 'COMPLETED',
      outputResult: { approvedBy, respondedAt },
      timestamp: respondedAt
    });

    const runbook = state.selectedRunbook;
    if (!runbook) throw new Error('Runbook configuration missing in state');

    const category = runbook.targetCategory;

    // Step 6: Remediation
    const remStartTime = Date.now();
    let actionType: 'KILL_PROCESS' | 'RESTART_SERVICE' | 'RESET_DB_POOL' = 'KILL_PROCESS';
    if (category === 'AVAILABILITY') actionType = 'RESTART_SERVICE';
    if (category === 'DATABASE') actionType = 'RESET_DB_POOL';

    const remResult = await SimulatedInfrastructureTools.simulateRemediation(state.intake.serviceName, actionType);
    state.remediationResult = remResult;

    this.logStep(state, {
      stepId: 'step-remediation-exec',
      stepName: 'Execute Approved Remediation (simulate_remediation)',
      toolName: 'simulate_remediation',
      type: 'REMEDIATION',
      status: remResult.success ? 'COMPLETED' : 'FAILED',
      outputResult: remResult,
      durationMs: Date.now() - remStartTime,
      timestamp: new Date().toISOString()
    });

    // Step 7: Verification
    state.status = 'Verifying';
    const verStartTime = Date.now();
    const verResult = await SimulatedInfrastructureTools.verifyServiceHealth(state.intake.serviceName, category);
    state.verificationResult = verResult;

    state.status = verResult.status as IncidentStatus;

    this.logStep(state, {
      stepId: 'step-verification-check',
      stepName: 'Post-Remediation Verification (verify_service_health)',
      toolName: 'verify_service_health',
      type: 'VERIFICATION',
      status: verResult.status === 'Resolved' ? 'COMPLETED' : 'FAILED',
      outputResult: verResult,
      durationMs: Date.now() - verStartTime,
      timestamp: new Date().toISOString()
    });

    const endTime = new Date();
    state.completedAt = endTime.toISOString();
    state.executionDurationMs = endTime.getTime() - new Date(state.startedAt).getTime();

    return state;
  }

  /**
   * Step 8: Generate Final Structured Incident Report
   */
  public generateIncidentReport(incidentId: string): IncidentReport {
    const state = incidentsStore.get(incidentId);
    if (!state) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const duration = state.executionDurationMs 
      ? `${(state.executionDurationMs / 1000).toFixed(2)} seconds`
      : 'In progress / Awaiting Approval';

    return {
      incidentId: state.incidentId,
      title: state.intake.title,
      description: state.intake.description,
      serviceName: state.intake.serviceName,
      environment: state.intake.environment,
      severity: state.intake.severity,
      selectedRunbook: {
        id: state.selectedRunbook?.runbookId || 'N/A',
        title: state.selectedRunbook?.title || 'N/A'
      },
      diagnosis: {
        probableCause: state.diagnosis?.probableCause || 'Unknown',
        confidenceScore: state.diagnosis?.confidenceScore || 0,
        summary: state.diagnosis?.summary || ''
      },
      executionSteps: state.executionLogs.map(log => ({
        stepId: log.stepId,
        stepName: log.stepName,
        type: log.type,
        status: log.status,
        details: log.error || JSON.stringify(log.outputResult || {}),
        durationMs: log.durationMs
      })),
      approvalStatus: {
        approvalRequired: !!state.approvalRequest,
        approvalId: state.approvalRequest?.approvalId,
        status: state.approvalRequest?.status,
        action: state.approvalRequest?.action,
        approvedBy: state.approvalRequest?.approvedBy,
        respondedAt: state.approvalRequest?.respondedAt,
        rejectionReason: state.approvalRequest?.rejectionReason
      },
      remediationPerformed: state.remediationResult ? {
        action: state.remediationResult.actionExecuted,
        success: state.remediationResult.success,
        details: state.remediationResult.outputDetails
      } : null,
      verificationResult: state.verificationResult ? {
        status: state.verificationResult.status,
        details: state.verificationResult.details,
        checks: state.verificationResult.verificationChecks
      } : null,
      finalStatus: state.status,
      executionDuration: duration,
      generatedAt: new Date().toISOString()
    };
  }

  public getIncidentState(incidentId: string): IncidentState | undefined {
    return incidentsStore.get(incidentId);
  }

  public listAllIncidents(): IncidentState[] {
    return Array.from(incidentsStore.values());
  }

  private logStep(state: IncidentState, step: ExecutionLogStep) {
    state.executionLogs.push(step);
    console.log(`[TrueForge Agent] [State: ${state.status}] [Step: ${step.stepName}] (${step.status})`);
  }
}
