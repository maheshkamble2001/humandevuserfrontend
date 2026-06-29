export default function SkillCard({ name, data }) {
  const maxXP = data.level * 100;
  const percent = (data.xp / maxXP) * 100;

  return (
    <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl space-y-2">

      <div className="flex justify-between">
        <h3 className="font-semibold capitalize">
          {name}
        </h3>
        <span className="text-cyan-400">
          Lv {data.level}
        </span>
      </div>

      <div className="text-sm text-gray-400">
        XP: {data.xp} / {maxXP}
      </div>

      <div className="w-full h-2 bg-gray-800 rounded-full">
        <div
          className="h-2 bg-cyan-400 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <button
        onClick={() => window.addXP?.(name)}
        className="text-xs bg-blue-600 px-2 py-1 rounded mt-2"
      >
        TEST +50 XP
      </button>

    </div>
  );
}