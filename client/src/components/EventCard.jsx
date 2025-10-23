import { Link } from "react-router-dom";
import CapacityBar from "./CapacityBar";

function formatRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleString()} – ${e.toLocaleString()}`;
}

export default function EventCard({ ev }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-2">
      <div className="text-xs text-gray-600">{formatRange(ev.startAt, ev.endAt)}</div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium">{ev.title}</h3>
        <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">{ev.category}</span>
      </div>
      <div className="text-xs text-gray-600">
        Hosted by: <span className="font-medium">{ev?.club?.name || "—"}</span>
      </div>
      <CapacityBar count={ev.attendeesCount || 0} capacity={ev.capacity} />
      <div className="mt-2">
        <Link to={`/events/${ev._id}`} className="text-sm underline text-indigo-600">Details</Link>
      </div>
    </div>
  );
}