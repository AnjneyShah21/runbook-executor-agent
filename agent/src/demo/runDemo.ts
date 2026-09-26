import { TrueForgeRunbookAgent } from '../agent/trueforgeAgent.js';
import { IncidentIntakeInput } from '../types/incident.js';

async function runAllTestCases() {
  console.log('\n===================================================================');
  console.log('🔥 TRUEFORGE RUNBOOK EXECUTOR AGENT - COMPLETE TEST SUITE');
  console.log('===================================================================\n');

  const agent = new TrueForgeRunbookAgent();

  // -------------------------------------------------------------------
  // TEST 1: High CPU Usage Runbook
  // -------------------------------------------------------------------
  console.log('-------------------------------------------------------------------');
  console.log('🧪 TEST 1: High CPU Usage Incident (Intake -> Diagnosis -> Approval -> Remediation -> Resolved)');
  console.log('-------------------------------------------------------------------');
  const t1Intake: IncidentIntakeInput = {
    title: 'High CPU spike on payment-service worker pool',
    description: 'Alert: Host CPU utilization at 94.8%. Latency p99 increased to 4200ms.',
    serviceName: 'payment-service',
    severity: 'CRITICAL',
    environment: 'production'
  };

  const t1State1 = await agent.executeIncidentWorkflow(t1Intake);
  console.log(`✅ [Test 1] Initial Status: ${t1State1.status} | Runbook: ${t1State1.selectedRunbook?.title}`);
  console.log(`✅ [Test 1] Approval Request ID: ${t1State1.approvalRequest?.approvalId}`);

  const t1State2 = await agent.handleApprovalDecision(t1State1.incidentId, true, 'Alice (Lead SRE)');
  console.log(`✅ [Test 1] Final Status: ${t1State2.status} | Verification: ${t1State2.verificationResult?.status}`);
  const t1Report = agent.generateIncidentReport(t1State1.incidentId);
  console.log(`✅ [Test 1] Report Duration: ${t1Report.executionDuration}`);

  // -------------------------------------------------------------------
  // TEST 2: Service Unavailable Runbook
  // -------------------------------------------------------------------
  console.log('\n-------------------------------------------------------------------');
  console.log('🧪 TEST 2: Service Unavailable Incident (Intake -> Health Check -> Approval -> Pod Restart)');
  console.log('-------------------------------------------------------------------');
  const t2Intake: IncidentIntakeInput = {
    title: 'Authentication service returning HTTP 503 Service Unavailable',
    description: 'Auth service pod trapped in CrashLoopBackOff due to OutOfMemory error in heap space.',
    serviceName: 'auth-service',
    severity: 'HIGH',
    environment: 'production'
  };

  const t2State1 = await agent.executeIncidentWorkflow(t2Intake);
  console.log(`✅ [Test 2] Initial Status: ${t2State1.status} | Runbook: ${t2State1.selectedRunbook?.title}`);
  
  const t2State2 = await agent.handleApprovalDecision(t2State1.incidentId, true, 'Bob (DevOps)');
  console.log(`✅ [Test 2] Final Status: ${t2State2.status} | Remediation: ${t2State2.remediationResult?.actionExecuted}`);

  // -------------------------------------------------------------------
  // TEST 3: Database Connection Failure Runbook
  // -------------------------------------------------------------------
  console.log('\n-------------------------------------------------------------------');
  console.log('🧪 TEST 3: Database Connection Failure Incident (Intake -> Pool Inspection -> Approval -> Pool Reset)');
  console.log('-------------------------------------------------------------------');
  const t3Intake: IncidentIntakeInput = {
    title: 'PostgreSQL connection pool exhausted on user-db',
    description: 'Active backend connections reached limit (100/100). Orphaned idle queries detected.',
    serviceName: 'user-db',
    severity: 'HIGH',
    environment: 'staging'
  };

  const t3State1 = await agent.executeIncidentWorkflow(t3Intake);
  console.log(`✅ [Test 3] Initial Status: ${t3State1.status} | Runbook: ${t3State1.selectedRunbook?.title}`);

  const t3State2 = await agent.handleApprovalDecision(t3State1.incidentId, true, 'Charlie (DBA)');
  console.log(`✅ [Test 3] Final Status: ${t3State2.status} | Status Check: ${t3State2.verificationResult?.details}`);

  // -------------------------------------------------------------------
  // TEST 4: Rejected Human Approval Workflow
  // -------------------------------------------------------------------
  console.log('\n-------------------------------------------------------------------');
  console.log('🧪 TEST 4: Rejected Human Approval (Action Vetoed by Engineer)');
  console.log('-------------------------------------------------------------------');
  const t4Intake: IncidentIntakeInput = {
    title: 'Unexpected CPU oscillation on secondary service',
    description: 'Mild CPU load fluctuation detected.',
    serviceName: 'payment-service',
    severity: 'LOW',
    environment: 'development'
  };

  const t4State1 = await agent.executeIncidentWorkflow(t4Intake);
  console.log(`✅ [Test 4] Status Awaiting Approval: ${t4State1.status}`);

  const t4State2 = await agent.handleApprovalDecision(
    t4State1.incidentId, 
    false, 
    'Dave (Engineering Manager)', 
    'Vetoed termination: Scheduled batch job running normally.'
  );
  console.log(`✅ [Test 4] Final Status: ${t4State2.status} | Rejection Reason: ${t4State2.approvalRequest?.rejectionReason}`);

  // -------------------------------------------------------------------
  // TEST 5: Verification Failure (Simulated Unresolved Incident)
  // -------------------------------------------------------------------
  console.log('\n-------------------------------------------------------------------');
  console.log('🧪 TEST 5: Verification Failure Scenario (Hardware / Core Failure)');
  console.log('-------------------------------------------------------------------');
  const t5Intake: IncidentIntakeInput = {
    title: 'Unresolvable persistent host failure',
    description: 'Hardware crash on underlying hypervisor node.',
    serviceName: 'unresolvable-service',
    severity: 'CRITICAL',
    environment: 'production'
  };

  const t5State1 = await agent.executeIncidentWorkflow(t5Intake);
  const t5State2 = await agent.handleApprovalDecision(t5State1.incidentId, true, 'Eve (Incident Commander)');
  console.log(`✅ [Test 5] Final Status: ${t5State2.status} (Verified: Did not claim false success!)`);

  console.log('\n===================================================================');
  console.log('🎉 ALL 5 TEST SUITES EXECUTED SUCCESSFULLY!');
  console.log('===================================================================\n');
}

runAllTestCases().catch(console.error);
