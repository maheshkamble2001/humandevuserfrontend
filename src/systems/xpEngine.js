export const rarityMultiplier = {
  common: 1,
  rare: 1.5,
  epic: 2,
};

export function calculateXP(mission, streak) {
  const baseXP = mission.xp || 0;
  const rarity = mission.rarity || "common";

  const streakMultiplier = Math.min(1 + streak * 0.1, 2);

  return Math.floor(
    baseXP * rarityMultiplier[rarity] * streakMultiplier
  );
}