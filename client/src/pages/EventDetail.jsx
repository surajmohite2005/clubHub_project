import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import RSVPButton from "../components/RSVPButton";
import CapacityBar from "../components/CapacityBar";
import { useAuth } from "../contexts/AuthContext";

function formatRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleString()} – ${e.toLocaleString()}`;
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => (await api.get(`/api/events/${id}`)).data,
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load</div>;

  const { event, attendeesCount, googleCalendarUrl } = data;
  const ended = new Date(event.endAt) <= new Date();

  // Best-effort initialGoing (if server includes attendees array)
  const userId = data?.meId || ""; // optional; not available unless you add it
  const initialGoing = Array.isArray(event.attendees)
    ? event.attendees.some((u) => String(u) === String(userId))
    : false;

  return (
    
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <div className="mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 inline-block">
            {event.category}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Hosted by: <Link to={`/clubs/${event?.club?._id || event.club}`} className="underline">
              {event?.club?.name || "Club"}
            </Link>
          </div>
          <p className="text-sm text-gray-700 mt-2">{formatRange(event.startAt, event.endAt)}</p>
          <p className="text-sm text-gray-700 mt-1">
            {event.isOnline ? "Online" : (event.location || "Location TBA")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Add to Google Calendar
          </a>
          <RSVPButton
            eventId={event._id}
            initialGoing={initialGoing}
            initialCount={attendeesCount || 0}
            capacity={event.capacity}
            status={event.status}
            endAt={event.endAt}
          />
          {user?.role === "admin" && (
            <div className="flex gap-2">
              <Link
                to={`/admin/events/${event._id}/edit`}
                className="px-3 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
              >
                Edit
              </Link>

              <button
                onClick={async () => {
                  if (!confirm("Delete this event? This cannot be undone.")) return;
                  try {
                    await api.delete(`/api/events/${event._id}`);
                    window.location.href = "/events";
                  } catch (e) {
                    alert(e?.response?.data?.message || "Failed to delete event");
                  }
                }}
                className="px-3 py-2 rounded-md text-sm border border-red-300 text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {event.capacity ? (
        <div className="mt-4">
          <CapacityBar count={attendeesCount || 0} capacity={event.capacity} />
        </div>
      ) : null}

      {event.bannerUrl && (
        <img src={event.bannerUrl} alt="Event banner" className="mt-6 rounded-lg border" />
      )}

      <div className="mt-6">
        <p className="whitespace-pre-wrap">{event.description}</p>
      </div>

      {Array.isArray(event.tags) && event.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}