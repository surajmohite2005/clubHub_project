import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

const categories = ["Technical", "Cultural", "Sports", "Arts", "Music", "Other"];

export default function AdminCreateClub() {
  const nav = useNavigate();

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
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name || !form.description) {
      setErr("Name and description are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        socials: {
          website: form.website || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          email: form.email || undefined,
        },
      };

      const { data } = await api.post("/api/clubs", payload);
      nav(`/clubs/${data.club._id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to create club";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Club</h1>

      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-lg p-4">
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
          placeholder="web, ai"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Website"
            placeholder="https://..."
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <Input
            label="Instagram"
            placeholder="https://instagram.com/..."
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/..."
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="club@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          disabled={loading}
          className="px-4 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Club"}
        </button>
      </form>
    </div>
  );
}
