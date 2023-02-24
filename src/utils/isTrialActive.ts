export function isTrialActive(trialEnd: string | null) {
  if (!trialEnd) return false;
  const totalSeconds = new Date(trialEnd).getTime() - new Date().getTime();
  return totalSeconds >= 0;
}
