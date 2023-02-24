import { Plan } from "../models";

export function isValidPlan(plan: Plan) {
  if (plan.status === "active" || plan.status === "trialing") return true;
  const totalSeconds =
    new Date(plan.current_period_end).getTime() - new Date().getTime();
  return totalSeconds >= 0;
}
