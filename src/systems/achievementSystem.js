export const achievements = [
  {
    id: 1,
    title: "First Blood",
    description: "Complete your first mission.",
    icon: "⚔️",
    check: (data) =>
      data.missions.filter((m) => m.status === "completed").length >= 1,
  },

  {
    id: 2,
    title: "React Beginner",
    description: "Reach React Level 5.",
    icon: "⚛️",
    check: (data) =>
      data.skills.react.level >= 5,
  },

  {
    id: 3,
    title: "DSA Warrior",
    description: "Reach DSA Level 5.",
    icon: "🧠",
    check: (data) =>
      data.skills.dsa.level >= 5,
  },

  {
    id: 4,
    title: "Backend Architect",
    description: "Reach Backend Level 5.",
    icon: "🗄️",
    check: (data) =>
      data.skills.backend.level >= 5,
  },

  {
    id: 5,
    title: "Combo Master",
    description: "Reach a streak of 10.",
    icon: "🔥",
    check: (data) =>
      data.streak >= 10,
  },

  {
    id: 6,
    title: "Elite Hunter",
    description: "Reach Overall Level 10.",
    icon: "👑",
    check: (data) =>
      data.overallLevel >= 10,
  },

  {
    id: 7,
    title: "Legend",
    description: "Complete 100 missions.",
    icon: "🌟",
    check: (data) =>
      data.totalCompleted >= 100,
  },
];