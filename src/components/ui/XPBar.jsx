export default function XPBar({ xp, max }) {
  const percent = (xp / max) * 100;

  return (
    <div className="bg-panel border border-gray-800 p-4 rounded-xl">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>XP PROGRESS</span>
        <span>{xp} / {max}</span>
      </div>

      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}