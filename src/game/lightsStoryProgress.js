const RANK = Object.freeze({ none: 0, base: 1, silver: 2, gold: 3 });
function own(value, key) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  try { return Object.getOwnPropertyDescriptor(value, key)?.value; } catch { return undefined; }
}
// Highest score and newest qualifying story run serve different purposes.
// Reaccepting a mission must not require beating a pre-acceptance high score.
export function lightsStoryCompletion(state, acceptedAt, baselineIds = []) {
  const accepted = typeof acceptedAt === "string" ? Date.parse(acceptedAt) : NaN;
  if (!Number.isFinite(accepted)) return null;
  const baseline = new Set(Array.isArray(baselineIds) ? baselineIds.slice(-200) : []);
  return [own(state, "storyLatest"), own(state, "storyBest")].find(result => {
    const id = own(result, "runId"), grade = own(result, "grade"), completed = own(result, "completedAt");
    return typeof id === "string" && id.length > 0 && id.length <= 128 && !baseline.has(id)
      && typeof grade === "string" && Object.hasOwn(RANK, grade) && RANK[grade] >= 1
      && typeof completed === "string" && completed.length <= 32 && Date.parse(completed) >= accepted;
  }) ?? null;
}
