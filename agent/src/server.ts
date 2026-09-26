import express, { Request, Response } from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { IncidentIntakeSchema } from './types/incident.js';
import { TrueForgeRunbookAgent } from './agent/trueforgeAgent.js';
import { RUNBOOK_REGISTRY } from './runbooks/runbookRegistry.js';

const app = express();
app.use(cors());
app.use(express.json());

const agent = new TrueForgeRunbookAgent();

// Authentication Middleware for TrueForge API calls
const authenticateTrueForge = (req: Request, res: Response, next: any) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!apiKey || apiKey !== CONFIG.TRUEFORGE.API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing TrueForge API Key. Provide header x-api-key or Bearer token.'
    });
  }
  next();
};

/**
 * 1. Health & Agent Information Endpoint
 */
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    agent: agent.getAgentMetadata()
  });
});

/**
 * 2. Get Agent Info Endpoint
 */
app.get('/api/v1/agent/info', authenticateTrueForge, (req: Request, res: Response) => {
  res.json({
    success: true,
    agent: agent.getAgentMetadata(),
    config: {
      platform: CONFIG.TRUEFORGE.PLATFORM,
      version: CONFIG.TRUEFORGE.VERSION
    }
  });
});

/**
 * 3. List Available Runbooks Endpoint
 */
app.get('/api/v1/runbooks', authenticateTrueForge, (req: Request, res: Response) => {
  res.json({
    success: true,
    count: Object.keys(RUNBOOK_REGISTRY).length,
    runbooks: Object.values(RUNBOOK_REGISTRY)
  });
});

/**
 * 4. Step 1 Intake Endpoint - Submit New Incident for Execution
 * POST /api/v1/incidents
 */
app.post('/api/v1/incidents', authenticateTrueForge, async (req: Request, res: Response) => {
  try {
    const parseResult = IncidentIntakeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Bad Request',
        validationErrors: parseResult.error.errors
      });
    }

    const state = await agent.executeIncidentWorkflow(parseResult.data);

    res.status(202).json({
      success: true,
      message: 'Incident submitted and processing started.',
      incidentId: state.incidentId,
      status: state.status,
      selectedRunbook: state.selectedRunbook ? {
        id: state.selectedRunbook.runbookId,
        title: state.selectedRunbook.title
      } : null,
      diagnosis: state.diagnosis,
      approvalPending: !!state.approvalRequest && state.approvalRequest.status === 'PENDING',
      approvalDetails: state.approvalRequest || null,
      state
    });
  } catch (err: any) {
    console.error('Error executing incident workflow:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Error processing incident'
    });
  }
});

/**
 * 5. Get Incident Status & Execution Logs Endpoint
 * GET /api/v1/incidents/:id
 */
app.get('/api/v1/incidents/:id', authenticateTrueForge, (req: Request, res: Response) => {
  const incidentId = req.params.id;
  const state = agent.getIncidentState(incidentId);

  if (!state) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Incident with ID ${incidentId} was not found.`
    });
  }

  res.json({
    success: true,
    incidentId: state.incidentId,
    status: state.status,
    intake: state.intake,
    diagnosis: state.diagnosis,
    selectedRunbook: state.selectedRunbook ? {
      id: state.selectedRunbook.runbookId,
      title: state.selectedRunbook.title
    } : null,
    approvalRequest: state.approvalRequest || null,
    remediationResult: state.remediationResult || null,
    verificationResult: state.verificationResult || null,
    executionLogs: state.executionLogs,
    startedAt: state.startedAt,
    completedAt: state.completedAt || null,
    executionDurationMs: state.executionDurationMs || null
  });
});

/**
 * 6. List All Incidents Endpoint
 * GET /api/v1/incidents
 */
app.get('/api/v1/incidents', authenticateTrueForge, (req: Request, res: Response) => {
  const incidents = agent.listAllIncidents();
  res.json({
    success: true,
    count: incidents.length,
    incidents
  });
});

/**
 * 7. Approve Pending Remediation Action
 * POST /api/v1/incidents/:id/approve
 */
app.post('/api/v1/incidents/:id/approve', authenticateTrueForge, async (req: Request, res: Response) => {
  try {
    const incidentId = req.params.id;
    const { approvedBy, reason } = req.body;

    const state = await agent.handleApprovalDecision(
      incidentId, 
      true, 
      approvedBy || 'SRE Engineer (Antigravity UI)', 
      reason
    );

    res.json({
      success: true,
      message: 'Human approval granted. Remediation executed and verified.',
      incidentId: state.incidentId,
      status: state.status,
      remediationResult: state.remediationResult,
      verificationResult: state.verificationResult,
      completedAt: state.completedAt,
      executionDurationMs: state.executionDurationMs
    });
  } catch (err: any) {
    res.status(400).json({
      error: 'Approval Failed',
      message: err.message
    });
  }
});

/**
 * 8. Reject Pending Remediation Action
 * POST /api/v1/incidents/:id/reject
 */
app.post('/api/v1/incidents/:id/reject', authenticateTrueForge, async (req: Request, res: Response) => {
  try {
    const incidentId = req.params.id;
    const { rejectedBy, reason } = req.body;

    const state = await agent.handleApprovalDecision(
      incidentId, 
      false, 
      rejectedBy || 'SRE Engineer (Antigravity UI)', 
      reason || 'Remediation rejected by human supervisor.'
    );

    res.json({
      success: true,
      message: 'Remediation action rejected by human supervisor.',
      incidentId: state.incidentId,
      status: state.status,
      completedAt: state.completedAt
    });
  } catch (err: any) {
    res.status(400).json({
      error: 'Rejection Failed',
      message: err.message
    });
  }
});

/**
 * 9. Get Final Structured Incident Report
 * GET /api/v1/incidents/:id/report
 */
app.get('/api/v1/incidents/:id/report', authenticateTrueForge, (req: Request, res: Response) => {
  try {
    const incidentId = req.params.id;
    const report = agent.generateIncidentReport(incidentId);

    res.json({
      success: true,
      report
    });
  } catch (err: any) {
    res.status(404).json({
      error: 'Report Unavailable',
      message: err.message
    });
  }
});

app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TrueForge Runbook Executor Agent Server is Running`);
  console.log(`📍 URL: http://localhost:${CONFIG.PORT}`);
  console.log(`🔑 API Key: ${CONFIG.TRUEFORGE.API_KEY}`);
  console.log(`🤖 Agent ID: ${CONFIG.TRUEFORGE.AGENT_ID}`);
  console.log(`=======================================================`);
});

export { app };
