export function updateStreak(lastCompletedAt, currentStreak) {
  if (!lastCompletedAt) return 1;

  const now = Date.now();
  const diff = now - lastCompletedAt;

  if (diff > 2 * 60 * 60 * 1000) {
    return 1;
  }

  return currentStreak + 1;
}