export default function AchievementCard({ achievement, unlocked }) {

    return (
        <div
            className={`rounded-xl border p-4 transition
            ${
                unlocked
                    ? "border-yellow-500 bg-yellow-900/20"
                    : "border-gray-700 opacity-40"
            }`}
        >
            <div className="text-3xl">
                {achievement.icon}
            </div>

            <h3 className="font-bold mt-2">
                {achievement.title}
            </h3>

            <p className="text-sm text-gray-400">
                {achievement.description}
            </p>

            <div className="mt-3">
                {unlocked ? (
                    <span className="text-green-400">
                        ✓ Unlocked
                    </span>
                ) : (
                    <span className="text-gray-500">
                        Locked
                    </span>
                )}
            </div>
        </div>
    );
}