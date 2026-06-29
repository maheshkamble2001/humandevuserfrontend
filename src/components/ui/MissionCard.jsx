export default function MissionCard({ title, xp, onComplete }) {
  return (
    <div className="bg-panel border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-accent transition">

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">
          REWARD: {xp} XP
        </p>
      </div>

      <button
        onClick={onComplete}
        className="bg-primary px-3 py-1 rounded text-sm hover:opacity-80"
      >
        COMPLETE
      </button>

    </div>
  );
}