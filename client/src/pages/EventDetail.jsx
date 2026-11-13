import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import RSVPButton from "../components/RSVPButton";
import CapacityBar from "../components/CapacityBar";
import { useAuth } from "../contexts/AuthContext";
import './EventDetail.css'; // <-- Import the CSS file

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

  if (isLoading) return <div className="loading-message">Loading…</div>;
  if (isError) return <div className="error-message">Failed to load event</div>;

  const { event, attendeesCount, googleCalendarUrl } = data;

  // Use the ID from the authenticated user context
  const initialGoing = Array.isArray(event.attendees)
    ? event.attendees.some((u) => String(u) === String(user?._id))
    : false;

  return (
    <div className="event-detail-container">
      <div className="event-header">
        <div className="event-header__info">
          <h1 className="event-title">{event.title}</h1>
          <div className="event-category-badge">{event.category}</div>
          <div className="event-host-link">
            Hosted by: <Link to={`/clubs/${event?.club?._id || event.club}`}>
              {event?.club?.name || "Club"}
            </Link>
          </div>
          <p className="event-meta-item">{formatRange(event.startAt, event.endAt)}</p>
          <p className="event-meta-item">
            {event.isOnline ? "Online" : (event.location || "Location TBA")}
          </p>
        </div>

        <div className="event-header__actions">
          <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="google-cal-button">
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
            <div className="admin-actions">
              <Link to={`/admin/events/${event._id}/edit`} className="button button--secondary">
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
                className="button button--danger"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {event.capacity ? (
        <div className="event-capacity-bar">
          <CapacityBar count={attendeesCount || 0} capacity={event.capacity} />
        </div>
      ) : null}

      {event.bannerUrl && (
        <img src={event.bannerUrl} alt="Event banner" className="event-banner" />
      )}

      <div className="event-description-container">
        <p className="event-description">{event.description}</p>
      </div>

      {Array.isArray(event.tags) && event.tags.length > 0 && (
        <div className="event-tags-list">
          {event.tags.map((t) => (
            <span key={t} className="event-tag">#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}