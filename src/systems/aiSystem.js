export function generateSystemMessage({
  mission,
  xp,
  streak,
  rarity,
  leveledUp,
}) {
  const skill = mission.skill.toUpperCase();

  let msg = `SYSTEM: ${skill} mission detected.`;

  if (rarity === "epic") {
    msg += " EPIC QUEST ACTIVATED.";
  }

  msg += ` STREAK x${streak}.`;

  if (leveledUp) {
    msg += ` LEVEL UP in ${skill}!`;
  }

  return msg;
}