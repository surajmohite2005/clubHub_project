import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

export default function RSVPButton({
  eventId,
  initialGoing = false,
  initialCount = 0,
  capacity,
  status,
  endAt,
  onChange,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [going, setGoing] = useState(Boolean(initialGoing));
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const ended = endAt ? new Date(endAt) <= new Date() : false;
  const full = capacity ? count >= capacity : false;

  const click = async () => {
    if (!user) return navigate("/login");
    try {
      setLoading(true);
      const { data } = await api.post(`/api/events/${eventId}/rsvp`);
      setGoing(Boolean(data.going));
      if (typeof data.attendeesCount === "number") setCount(data.attendeesCount);
      onChange?.(data);
    } catch (e) {
      const msg = e?.response?.data?.message || "Could not update RSVP";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || ended || status === "cancelled" || status === "draft" || full;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={click}
        disabled={disabled}
        className={`px-4 py-2 rounded-md text-sm border ${
          going
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
        } disabled:opacity-60`}
      >
        {going ? "Going ✓" : full ? "Full" : ended ? "Ended" : status !== "published" ? "Not published" : "I'm going"}
      </button>
      {capacity ? (
        <span className="text-xs text-gray-600">{count} / {capacity}</span>
      ) : (
        <span className="text-xs text-gray-600">{count} going</span>
      )}
    </div>
  );
}