import { Plan, User } from "../models";

export function isValidPlan(plan: Plan) {
  if (plan.status === "active" || plan.status === "trialing") return true;
  const totalSeconds =
    new Date(plan.current_period_end).getTime() - new Date().getTime();
  return totalSeconds >= 0;
}

export function validateUserPlans(user?: User | null) {
  if (!user) return false;
  if (user?.is_superuser || user?.is_staff) return true;
  const plan = user.plans?.find((p) => isValidPlan(p));
  if (!plan) return false;
  if (plan.status === "active" || plan.status === "trialing") return true;
  const totalSeconds =
    new Date(plan.current_period_end).getTime() - new Date().getTime();
  return totalSeconds >= 0;
}
