import { z } from 'zod';

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
  metadata?: Record<string, any>;
}

export const IncidentIntakeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  serviceName: z.string().min(1, 'Service name is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  environment: z.enum(['production', 'staging', 'development', 'demo']),
  metadata: z.record(z.any()).optional(),
});

export interface DiagnosticCheckResult {
  checkName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'INFO';
  metrics?: Record<string, any>;
  details: string;
  timestamp: string;
}

export interface DiagnosisResult {
  probableCause: string;
  confidenceScore: number;
  relevantChecks: string[];
  recommendedRunbookId: string;
  recommendedRunbookTitle: string;
  summary: string;
}

export interface ApprovalRequest {
  approvalId: string;
  incidentId: string;
  action: string;
  targetService: string;
  proposedCommand: string;
  expectedImpact: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  respondedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface ExecutionLogStep {
  stepId: string;
  stepName: string;
  toolName?: string;
  type: 'DIAGNOSTIC' | 'HUMAN_APPROVAL' | 'REMEDIATION' | 'VERIFICATION';
  status: StepStatus;
  inputParams?: Record<string, any>;
  outputResult?: any;
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
  selectedRunbook?: Runbook;
  executionLogs: ExecutionLogStep[];
  approvalRequest?: ApprovalRequest;
  remediationResult?: RemediationResult;
  verificationResult?: VerificationResult;
  startedAt: string;
  completedAt?: string;
  executionDurationMs?: number;
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
