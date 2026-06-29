// src/utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const calculateProgress = (current, max) => {
  if (max === 0) return 0;
  return Math.min(Math.round((current / max) * 100), 100);
};

export const getRankFromLevel = (level) => {
  if (level < 10) return 'E';
  if (level < 20) return 'D';
  if (level < 30) return 'C';
  if (level < 40) return 'B';
  if (level < 50) return 'A';
  if (level < 60) return 'S';
  if (level < 75) return 'SS';
  return 'Mythic';
};

export const getXpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const getTotalXpForLevel = (level) => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
};

export const getLevelFromXp = (xp) => {
  let level = 1;
  let totalXp = 0;
  while (true) {
    const needed = getXpForLevel(level);
    if (totalXp + needed > xp) break;
    totalXp += needed;
    level++;
  }
  return level;
};