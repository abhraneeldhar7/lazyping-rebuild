export interface ProjectType {
    projectId: string,
    projectName: string,
    createdAt: Date,
    githubUrl: string
}

export interface EndpointType {
    endpointId: string,
    url: string,
    method: "GET" | "PUT" | "DELETE" | "POST",
    expectedResponse: string | null,
    intervalMinutes: number,
    lastPingedAt: Date|null,
    nextPingAt: Date,
    enabled: boolean
}

export interface PingLog {
    projectId: string,
    endpointId: string,

    url: string,
    method: "GET" | "PUT" | "DELETE" | "POST",

    status: "OK" | "TIMEOUT" | "DNS" | "CONN_REFUSED" | "TLS" |
    "HTTP_4XX" | "HTTP_5XX" | "RATE_LIMITED" |
    "BLOCKED" | "UNKNOWN",

    statusCode: number | null,
    latencyMs: number | null,

    timestamp: Date
}