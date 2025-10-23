import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

const categories = ["Talk", "Workshop", "Competition", "Meetup", "Other"];

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toISO = (local) => (local ? new Date(local).toISOString() : "");

export default function AdminEditEvent() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        const e = res.data.event;
        setForm({
          title: e.title || "",
          description: e.description || "",
          category: e.category || "Competition",
          tags: Array.isArray(e.tags) ? e.tags.join(", ") : "",
          isOnline: !!e.isOnline,
          location: e.location || "",
          startAt: toLocalInput(e.startAt),
          endAt: toLocalInput(e.endAt),
          capacity: e.capacity || "",
          bannerUrl: e.bannerUrl || "",
          status: e.status || "draft",
        });
      } catch (e) {
        setErr("Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title || !form.startAt || !form.endAt) {
      setErr("Title, start and end time are required");
      return;
    }

    if (new Date(form.startAt) >= new Date(form.endAt)) {
      setErr("Start time must be before end time");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || "",
        category: form.category,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        isOnline: form.isOnline,
        location: form.location || "",
        startAt: toISO(form.startAt),
        endAt: toISO(form.endAt),
        bannerUrl: form.bannerUrl || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        status: form.status,
      };

      const { data } = await api.patch(`/api/events/${id}`, payload);
      nav(`/events/${data.event._id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update event";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Event</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-lg p-4">
        <Input
          label="Title*"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm mb-1 text-gray-700">Category</span>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <Input
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

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
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

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
            value={form.bannerUrl}
            onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
          />
        </div>

        <label className="block">
          <span className="block text-sm mb-1 text-gray-700">Status</span>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="flex gap-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => nav(`/events/${id}`)}
            className="px-4 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
