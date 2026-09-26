export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentEnvironment = 'production' | 'staging' | 'development' | 'demo';

export type IncidentStatus = 
  | 'Received'
  | 'Analyzing'
  | 'Diagnosing'
  | 'Runbook Selected'
  | 'Executing Diagnostics'
  | 'Awaiting Approval'
  | 'Remediating'
  | 'Verifying'
  | 'Resolved'
  | 'Partially Resolved'
  | 'Unresolved'
  | 'Rejected';

export type StepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'AWAITING_APPROVAL';

export interface IncidentIntakeInput {
  title: string;
  description: string;
  serviceName: string;
  severity: IncidentSeverity;
  environment: IncidentEnvironment;
  metadata?: Record<string, unknown>;
}

export interface DiagnosticCheckResult {
  checkName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'INFO';
  metrics?: Record<string, unknown>;
  details: string;
  timestamp: string;
}

export interface DiagnosisResult {
  probableCause: string;
  confidenceScore: number;
  relevantChecks?: string[];
  recommendedRunbookId?: string;
  recommendedRunbookTitle?: string;
  summary: string;
}

export interface BlastRadiusInfo {
  riskScore: number; // 0 to 100
  affectedUsersEstimate: number;
  downtimeCostPerMin: number;
  affectedMicroservices: string[];
  blastRadiusCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TerminalTraceStep {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  executedAt: string;
}

export interface ApprovalRequest {
  approvalId: string;
  incidentId: string;
  action: string;
  targetService: string;
  proposedCommand: string;
  expectedImpact: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blastRadius?: BlastRadiusInfo;
  autoApproved?: boolean;
  autoApprovePolicy?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  respondedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  reason?: string;
}

export interface ExecutionLogStep {
  stepId: string;
  stepName: string;
  toolName?: string;
  type: 'DIAGNOSTIC' | 'HUMAN_APPROVAL' | 'REMEDIATION' | 'VERIFICATION';
  status: StepStatus;
  inputParams?: Record<string, unknown>;
  outputResult?: unknown;
  error?: string;
  timestamp: string;
  durationMs?: number;
}

export interface RunbookStep {
  stepId: string;
  stepName: string;
  type: 'DIAGNOSTIC' | 'HUMAN_APPROVAL' | 'REMEDIATION' | 'VERIFICATION';
  toolName?: string;
  description: string;
  requiresApproval: boolean;
  proposedActionName?: string;
  expectedImpactDescription?: string;
}

export interface Runbook {
  runbookId: string;
  title: string;
  targetCategory: 'CPU' | 'AVAILABILITY' | 'DATABASE';
  description: string;
  steps: RunbookStep[];
}

export interface RemediationResult {
  actionExecuted: string;
  success: boolean;
  outputDetails: string;
  executedAt: string;
}

export interface VerificationResult {
  status: 'Resolved' | 'Partially Resolved' | 'Unresolved' | 'Awaiting Approval';
  verificationChecks: DiagnosticCheckResult[];
  details: string;
  verifiedAt: string;
}

export interface IncidentState {
  incidentId: string;
  intake: IncidentIntakeInput;
  status: IncidentStatus;
  diagnosis?: DiagnosisResult;
  selectedRunbook?: {
    id: string;
    title: string;
    description?: string;
  };
  executionLogs: ExecutionLogStep[];
  approvalRequest?: ApprovalRequest;
  remediationResult?: RemediationResult;
  verificationResult?: VerificationResult;
  startedAt: string;
  completedAt?: string;
  executionDurationMs?: number;
  mode?: 'LIVE' | 'MOCK';
}

export interface IncidentReport {
  incidentId: string;
  title: string;
  description: string;
  serviceName: string;
  environment: IncidentEnvironment;
  severity: IncidentSeverity;
  selectedRunbook: {
    id: string;
    title: string;
  };
  diagnosis: {
    probableCause: string;
    confidenceScore: number;
    summary: string;
  };
  executionSteps: {
    stepId: string;
    stepName: string;
    type: string;
    status: StepStatus;
    details: string;
    durationMs?: number;
  }[];
  approvalStatus: {
    approvalRequired: boolean;
    approvalId?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    action?: string;
    approvedBy?: string;
    respondedAt?: string;
    rejectionReason?: string;
  };
  remediationPerformed: {
    action: string;
    success: boolean;
    details: string;
  } | null;
  verificationResult: {
    status: string;
    details: string;
    checks: DiagnosticCheckResult[];
  } | null;
  finalStatus: IncidentStatus;
  executionDuration: string;
  generatedAt: string;
}

export interface AgentHealthResponse {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  agentId: string;
  agentName: string;
  platform: string;
  version: string;
  uptimeSeconds: number;
  activeIncidentsCount: number;
  pendingApprovalsCount: number;
  timestamp: string;
}
