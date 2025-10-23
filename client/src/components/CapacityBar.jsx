export default function CapacityBar({ count = 0, capacity }) {
  const total = Math.max(capacity || 0, count);
  const pct = capacity ? Math.min(100, Math.round((count / capacity) * 100)) : 0;
  if (!capacity) return null;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Capacity</span>
        <span>{count} / {capacity}</span>
      </div>
      <div className="h-2 rounded bg-gray-200 overflow-hidden">
        <div className="h-2 bg-indigo-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}