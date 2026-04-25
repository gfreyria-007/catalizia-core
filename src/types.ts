export type SubscriptionLevel = 'free' | 'basic' | 'pro';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: number;
}

export interface Project {
    id: string;
    type: 'image' | 'report' | 'certificate';
    title: string;
    url?: string;
    content?: string;
    timestamp: number;
}

export interface UserProfile {
    uid: string;
    name: string;
    age: number;
    gradeId: string;
    subscriptionLevel: SubscriptionLevel;
    tokensPerDay: number;
    dailyUsageCount: number;
    monthlyCostUsed?: number;
    personalApiKey?: string;
    badges: Badge[];
    projects: Project[];
    isApproved?: boolean;
    role?: 'admin' | 'user';
}
