import { UserProfile } from '../types';

const MONTHLY_BUDGET_MXN = 25;

export const canUseService = (profile: UserProfile): { allowed: boolean; reason?: string } => {
  if (profile.role === 'admin') return { allowed: true };

  const isBasic = profile.subscriptionLevel === 'basic';
  const isPro = profile.subscriptionLevel === 'pro';
  const isFree = profile.subscriptionLevel === 'free';

  // 1. Daily Limit
  if (profile.dailyUsageCount >= profile.tokensPerDay) {
    if (isFree) return { allowed: false, reason: "Límite diario alcanzado." };
    
    // 2. Pro Monthly Budget
    if (isPro) {
      const overBudget = (profile.monthlyCostUsed || 0) >= MONTHLY_BUDGET_MXN;
      if (overBudget) return { allowed: false, reason: "Presupuesto mensual agotado." };
    }
  }

  // 3. Basic API Key
  if (isBasic && !profile.personalApiKey) {
    return { allowed: false, reason: "Falta API Key personalizada." };
  }

  return { allowed: true };
};
