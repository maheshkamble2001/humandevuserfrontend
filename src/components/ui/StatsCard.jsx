export default function StatsCard({ title, value }) {
  return (
    <div className="bg-panel border border-gray-800 p-4 rounded-xl">
      <p className="text-gray-400 text-xs">{title}</p>
      <h2 className="text-xl font-bold mt-1">{value}</h2>
    </div>
  );
}