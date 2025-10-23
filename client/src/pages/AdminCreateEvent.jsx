import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

const categories = ["Talk", "Workshop", "Competition", "Meetup", "Other"];

export default function AdminCreateEvent() {
  const nav = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  const [form, setForm] = useState({
    clubId: "",
    title: "",
    description: "",
    category: "Competition",
    tags: "",
    isOnline: false,
    location: "",
    startAt: "",
    endAt: "",
    capacity: "",
    bannerUrl: "",
    status: "draft",
  });

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/clubs?limit=1000&sort=name");
        setClubs(res.data?.data || []);
      } finally {
        setLoadingClubs(false);
      }
    })();
  }, []);

  const toISO = (local) => (local ? new Date(local).toISOString() : "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.clubId || !form.title || !form.startAt || !form.endAt) {
      setErr("Club, title, start and end time are required");
      return;
    }

    if (new Date(form.startAt) >= new Date(form.endAt)) {
      setErr("Start time must be before end time");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        clubId: form.clubId,
        title: form.title.trim(),
        description: form.description?.trim() || "",
        category: form.category,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        isOnline: form.isOnline,
        location: form.location || "",
        startAt: toISO(form.startAt),
        endAt: toISO(form.endAt),
        bannerUrl: form.bannerUrl || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        status: form.status,
      };

      const { data } = await api.post("/api/events", payload);
      nav(`/events/${data.event._id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to create event";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>

      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-lg p-4">
        {/* Club Selection */}
        <label className="block">
          <span className="block text-sm mb-1 text-gray-700">Club*</span>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.clubId}
            onChange={(e) => setForm({ ...form, clubId: e.target.value })}
            disabled={loadingClubs}
          >
            <option value="">Select a club</option>
            {clubs.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Title & Description */}
        <Input
          label="Title*"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          label="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Category & Tags */}
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm mb-1 text-gray-700">Category</span>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Tags (comma separated)"
            placeholder="web, ai"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        {/* Timing */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Start at*"
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          />
          <Input
            label="End at*"
            type="datetime-local"
            value={form.endAt}
            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isOnline}
              onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
            />
            Online event
          </label>
        </div>

        <Input
          label={form.isOnline ? "Online meeting link (optional)" : "Location (venue/room)"}
          placeholder={
            form.isOnline ? "https://meet.example.com/..." : "Main Auditorium"
          }
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        {/* Capacity & Banner */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Capacity (optional)"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
          <Input
            label="Banner URL (optional)"
            placeholder="https://..."
            value={form.bannerUrl}
            onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
          />
        </div>

        {/* Status */}
        <label className="block">
          <span className="block text-sm mb-1 text-gray-700">Status</span>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Publish now</option>
          </select>
        </label>

        {/* Error & Submit */}
        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          disabled={submitting}
          className="px-4 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
