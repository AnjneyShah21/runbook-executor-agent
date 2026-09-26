import {
  IncidentIntakeInput,
  IncidentState,
  IncidentReport,
  AgentHealthResponse,
} from '@/types/incident';

const PROXY_API_BASE = '/api/trueforge';

export class TrueForgeService {
  /**
   * Check TrueForge agent health & liveness status
   */
  static async checkHealth(): Promise<AgentHealthResponse | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/health`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Submit new incident to TrueForge agent
   */
  static async submitIncident(intake: IncidentIntakeInput): Promise<IncidentState | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.incidentId) {
        return this.getIncidentStatus(data.incidentId);
      }
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Get single incident status by ID
   */
  static async getIncidentStatus(incidentId: string): Promise<IncidentState | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents/${incidentId}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.incident || data;
    } catch {
      return null;
    }
  }

  /**
   * List all incidents from TrueForge backend
   */
  static async listIncidents(): Promise<IncidentState[] | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.incidents || data;
    } catch {
      return null;
    }
  }

  /**
   * Submit Human Approval to TrueForge Gate
   */
  static async approveRemediation(
    incidentId: string,
    approvedBy: string,
    reason: string
  ): Promise<IncidentState | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents/${incidentId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy, reason }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.incident || data;
    } catch {
      return null;
    }
  }

  /**
   * Submit Human Rejection to TrueForge Gate
   */
  static async rejectRemediation(
    incidentId: string,
    rejectedBy: string,
    reason: string
  ): Promise<IncidentState | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents/${incidentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedBy, reason }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.incident || data;
    } catch {
      return null;
    }
  }

  /**
   * Fetch final Incident Report
   */
  static async getIncidentReport(incidentId: string): Promise<IncidentReport | null> {
    try {
      const res = await fetch(`${PROXY_API_BASE}/incidents/${incidentId}/report`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.report || data;
    } catch {
      return null;
    }
  }
}
