export type UserTierType = "FREE" | "PRO";

export interface TierLimits {
    max_projects: number;
    max_endpoints_per_project: number;
    allow_global_pings: boolean;
    max_history_days: number;
    min_ping_interval_minute: number;
    max_team_members_per_project: number;
    pricing_per_month: {
        usd: number;
        inr: number;
    };
}

export const FREE_TIER_LIMITS: TierLimits = {
    max_projects: 5,
    max_endpoints_per_project: 2,
    allow_global_pings: false,
    max_history_days: 7,
    min_ping_interval_minute: 10,
    max_team_members_per_project: 0,
    pricing_per_month: {
        usd: 0,
        inr: 0
    }
}

export const PRO_TIER_LIMITS: TierLimits = {
    max_projects: 20,
    max_endpoints_per_project: 5,
    allow_global_pings: true,
    max_history_days: 30,
    min_ping_interval_minute: 5,
    max_team_members_per_project: 10,
    pricing_per_month: {
        usd: 1,
        inr: 1
    }
}



const TIER_LIMITS_MAP: Record<UserTierType, TierLimits> = {
    FREE: FREE_TIER_LIMITS,
    PRO: PRO_TIER_LIMITS,
}


export function getTierLimits(tier: UserTierType): TierLimits {
    return TIER_LIMITS_MAP[tier || "FREE"] || FREE_TIER_LIMITS;
}


export const DEFAULT_USER_TIER: UserTierType = "FREE";
