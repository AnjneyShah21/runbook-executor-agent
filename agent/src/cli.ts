import { TrueForgeRunbookAgent } from './agent/trueforgeAgent.js';
import { IncidentIntakeInput } from './types/incident.js';

async function main() {
  const agent = new TrueForgeRunbookAgent();
  console.log('🤖 TrueForge CLI Runbook Executor Agent ready.');

  const sampleIncident: IncidentIntakeInput = {
    title: 'PostgreSQL connection pool exhausted on user-db',
    description: 'Datadog Alert: Max connections reached (100/100). API backend returning 500 error on user query endpoints.',
    serviceName: 'user-db',
    severity: 'HIGH',
    environment: 'staging'
  };

  console.log('\n--- Submitting Incident ---');
  const state = await agent.executeIncidentWorkflow(sampleIncident);
  console.log(`State: ${state.status}`);
  console.log(`Selected Runbook: ${state.selectedRunbook?.title}`);

  if (state.approvalRequest) {
    console.log('\n--- Approving Pending Remediation ---');
    const finalState = await agent.handleApprovalDecision(state.incidentId, true, 'CLI Admin User');
    console.log(`Final Status: ${finalState.status}`);
    console.log(`Report generated for ID: ${finalState.incidentId}`);
  }
}

main().catch(console.error);
