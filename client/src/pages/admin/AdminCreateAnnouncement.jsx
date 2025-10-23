import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Container from "../../components/layout/Container";
import Card from "../../components/ui/Card";

export default function AdminCreateAnnouncement() {
  const nav = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  const [form, setForm] = useState({
    clubId: "",
    title: "",
    content: "",
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.clubId || !form.title || !form.content) {
      setErr("Club, title and content are required");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/api/announcements", {
        clubId: form.clubId,
        title: form.title.trim(),
        content: form.content.trim(),
      });
      nav("/announcements");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to create announcement";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Create Announcement</h1>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
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
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm mb-1 text-gray-700">Title*</span>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Workshop: Intro to React"
            />
          </label>

          <label className="block">
            <span className="block text-sm mb-1 text-gray-700">Content*</span>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-32"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Details about the announcement..."
            />
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            disabled={submitting}
            className="px-4 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Announcement"}
          </button>
        </form>
      </Card>
    </Container>
  );
}