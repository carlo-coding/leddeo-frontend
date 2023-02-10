export default interface Plan {
  stripe_subscription_id: string;
  active: boolean;
  name: string;
  billing_cycle_anchor: string;
  start_date: string | null;
  trial_start: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  current_period_start: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  ended_at: string | null;
}
