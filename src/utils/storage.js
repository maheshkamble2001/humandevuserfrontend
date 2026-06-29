export const loadProgress = () => {
    const data = localStorage.getItem("neo-system-progress");

    return data
        ? JSON.parse(data)
        : {
            overallLevel: 1,
            skills: {
                react: { xp: 0, level: 1 },
                dsa: { xp: 0, level: 1 },
                backend: { xp: 0, level: 1 },
            },
            missions: [
                { id: 1, title: "Build React Component", skill: "react", xp: 100, rarity: "common", status: "pending" },
                { id: 2, title: "Fix UI Bug", skill: "react", xp: 80, rarity: "common", status: "pending" },

                { id: 3, title: "Solve DSA Problem", skill: "dsa", xp: 120, rarity: "rare", status: "pending" },
                { id: 4, title: "Binary Search Mastery", skill: "dsa", xp: 150, rarity: "rare", status: "pending" },

                { id: 5, title: "Build REST API System", skill: "backend", xp: 200, rarity: "epic", status: "pending" },
                { id: 6, title: "Database Optimization", skill: "backend", xp: 220, rarity: "epic", status: "pending" },
            ],
        };
};

export const saveProgress = (data) => {
    localStorage.setItem(
        "neo-system-progress",
        JSON.stringify(data)
    );
};