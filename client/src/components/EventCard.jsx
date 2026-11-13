import { Link } from "react-router-dom";
import CapacityBar from "./CapacityBar";
import './EventCard.css'; // <-- Import the new CSS file

function formatRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  // Using a shorter, cleaner format for the card
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return `${s.toLocaleDateString(undefined, options)} – ${e.toLocaleDateString(undefined, options)}`;
}

export default function EventCard({ ev }) {
  return (
    // Add the main 'event-card' class
    <div className="event-card p-4 flex flex-col gap-2">
      <div className="event-card__date text-xs text-gray-600">{formatRange(ev.startAt, ev.endAt)}</div>
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="event-card__title font-medium">{ev.title}</h3>
        <span className="event-card__category text-[11px] px-2 py-0.5 rounded">{ev.category}</span>
      </div>

      <div className="event-card__host text-xs text-gray-600">
        Hosted by: <span className="font-medium">{ev?.club?.name || "—"}</span>
      </div>
      
      {/* Ensure the CapacityBar has some space */}
      <div className="event-card__capacity-bar mt-2">
        <CapacityBar count={ev.attendeesCount || 0} capacity={ev.capacity} />
      </div>

      <div className="mt-auto pt-3">
        {/* Changed the Link to look like a button */}
        <Link to={`/events/${ev._id}`} className="event-card__button">Details</Link>
      </div>
    </div>
  );
}