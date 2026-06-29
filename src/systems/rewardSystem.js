export const rewardTable = {
  common: {
    coins: 20,
    itemChance: 0.10,
  },

  rare: {
    coins: 50,
    itemChance: 0.35,
  },

  epic: {
    coins: 120,
    itemChance: 0.75,
  },
};

export const items = [
  {
    id: 1,
    name: "Bronze Badge",
    type: "badge",
    rarity: "common",
  },

  {
    id: 2,
    name: "Silver Badge",
    type: "badge",
    rarity: "rare",
  },

  {
    id: 3,
    name: "Golden Crown",
    type: "title",
    rarity: "epic",
  },

  {
    id: 4,
    name: "Hunter Cloak",
    type: "skin",
    rarity: "epic",
  },

  {
    id: 5,
    name: "React Scroll",
    type: "scroll",
    rarity: "rare",
  },
];

export function getReward(rarity) {

    const reward = rewardTable[rarity];

    let item = null;

    if (Math.random() <= reward.itemChance) {

        const available = items.filter(
            i => i.rarity === rarity
        );

        item =
            available[
                Math.floor(Math.random()*available.length)
            ];
    }

    return {

        coins: reward.coins,

        item

    };

}