import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

const categories = ["Technical", "Cultural", "Sports", "Arts", "Music", "Other"];

export default function AdminEditClub() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Technical",
    tags: "",
    website: "",
    instagram: "",
    linkedin: "",
    email: "",
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/clubs/${id}`);
        const c = res.data.club;
        setForm({
          name: c.name || "",
          description: c.description || "",
          category: c.category || "Technical",
          tags: Array.isArray(c.tags) ? c.tags.join(", ") : "",
          website: c.socials?.website || "",
          instagram: c.socials?.instagram || "",
          linkedin: c.socials?.linkedin || "",
          email: c.socials?.email || "",
        });
      } catch (e) {
        setErr("Failed to load club");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name || !form.description) {
      setErr("Name and description are required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        socials: {
          website: form.website || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          email: form.email || undefined,
        },
      };

      const { data } = await api.patch(`/api/clubs/${id}`, payload);
      nav(`/clubs/${data.club._id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update club";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Club</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white border rounded-lg p-4"
      >
        <Input
          label="Club name*"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          label="Description*"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label className="block">
          <span className="block text-sm mb-1 text-gray-700">Category*</span>
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
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <Input
            label="Instagram"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
          <Input
            label="LinkedIn"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

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
            onClick={() => nav(`/clubs/${id}`)}
            className="px-4 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
