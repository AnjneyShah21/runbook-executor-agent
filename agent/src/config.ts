import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  HOST: process.env.HOST || '0.0.0.0',
  TRUEFORGE: {
    AGENT_NAME: process.env.TRUEFORGE_AGENT_NAME || 'Runbook Executor Agent',
    AGENT_ID: process.env.TRUEFORGE_AGENT_ID || 'tf-agent-runbook-executor-v1',
    API_KEY: process.env.TRUEFORGE_API_KEY || 'tf_sk_runbook_executor_hackathon_2026_demo_key',
    BASE_URL: process.env.TRUEFORGE_BASE_URL || 'http://localhost:3000/api/v1',
    VERSION: '0.2.0',
    PLATFORM: 'TrueForge Agent Harness'
  }
};
