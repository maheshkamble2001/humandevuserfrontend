export function completeMission(data, mission) {
  return {
    ...data,
    missions: data.missions.map((m) =>
      m.id === mission.id
        ? { ...m, status: "completed" }
        : m
    ),
  };
}