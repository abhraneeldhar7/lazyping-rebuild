export interface ProjectType {
    projectId: string,
    projectName: string,
    ownerId: string,
    createdAt: Date,

    githubIntegration: {
        githubRepoId: number;
        githubRepoName: string;
        installationId: number;
    } | null,

    overallStatus: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE" | null
}

export type methodType = "GET" | "PUT" | "DELETE" | "POST"
export type endpointStatus = "UP" | "DOWN" | "DEGRADED" | "MAINTENANCE"

export interface EndpointType {
    endpointId: string,
    projectId: string,
    endpointName: string,
    url: string,
    method: methodType,
    expectedResponse: string | null,
    headers: Record<string, string> | null;
    body: string | null;

    intervalMinutes: number,
    lastPingedAt: Date | null,
    nextPingAt: Date,

    enabled: boolean,

    currentStatus: endpointStatus | null,
    consecutiveFailures: number,
    latency: number | null,
    lastStatusChange: Date
}

export interface PingLog {
    projectId: string,
    endpointId: string,
    url: string,
    method: "GET" | "PUT" | "DELETE" | "POST",
    status: "OK" | "TIMEOUT" | "DNS" | "CONN_REFUSED" | "TLS" |
    "HTTP_4XX" | "HTTP_5XX" | "RATE_LIMITED" |
    "BLOCKED" | "UNKNOWN" | "RESOLVED" | "INVALID_URL",
    responseMessage: string | null,
    errorMessage?: string | null,
    statusCode: number | null,
    latencyMs: number | null,
    timestamp: Date,
    logSummary: string
}

export interface PublicPageType {
    projectId: string,
    projectName: string,
    siteUrl: string,
    pageSlug: string,
    enabled: boolean,
    logoUrl: string | null,
}

export interface TierLimits {
    max_projects: number;
    max_endpoints_per_project: number;
    allow_global_pings: boolean;
    allow_github_integration: boolean;
    max_history_days: number;
    min_ping_interval_minute: number;
    team_members_allowed: boolean;
    max_team_members_per_project: number;
}