const questPool = {
  react: [
    { title: "Build React Component", xp: 100, rarity: "common" },
    { title: "Fix React Bug", xp: 80, rarity: "common" },
    { title: "Implement Context API", xp: 150, rarity: "rare" },
    { title: "Optimize React Rendering", xp: 220, rarity: "epic" },
    { title: "Create Custom Hook", xp: 140, rarity: "rare" },
    { title: "Build Dashboard UI", xp: 200, rarity: "epic" },
  ],

  dsa: [
    { title: "Solve Array Problem", xp: 100, rarity: "common" },
    { title: "Binary Search Practice", xp: 120, rarity: "rare" },
    { title: "Dynamic Programming", xp: 240, rarity: "epic" },
    { title: "Linked List Challenge", xp: 150, rarity: "rare" },
    { title: "Tree Traversal", xp: 200, rarity: "epic" },
  ],

  backend: [
    { title: "Build REST API", xp: 100, rarity: "common" },
    { title: "JWT Authentication", xp: 170, rarity: "rare" },
    { title: "Database Optimization", xp: 250, rarity: "epic" },
    { title: "Design SQL Schema", xp: 130, rarity: "rare" },
    { title: "Redis Caching", xp: 220, rarity: "epic" },
  ],
};

function randomMission(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateDailyMissions() {
  const skills = Object.keys(questPool);

  return skills.map((skill, index) => ({
    id: index + 1,
    skill,
    status: "pending",
    ...randomMission(questPool[skill]),
  }));
}