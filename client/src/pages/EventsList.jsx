import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import EventCard from "../components/EventCard";

const categories = ["All", "Talk", "Workshop", "Competition", "Meetup", "Other"];

export default function EventsList() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const tags = params.get("tags") || "";
  const clubId = params.get("clubId") || "";
  const upcoming = params.get("upcoming") ?? "true"; // default to upcoming=true
  const past = params.get("past") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", q, category, tags, clubId, upcoming, past],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (q) qs.set("q", q);
      if (clubId) qs.set("clubId", clubId);
      if (category !== "All") qs.set("category", category);
      if (tags) qs.set("tags", tags);
      if (upcoming) qs.set("upcoming", upcoming);
      if (past) qs.set("past", past);
      qs.set("limit", "20");
      const res = await api.get(`/api/events?${qs.toString()}`);
      // add attendeesCount in mapping if not provided
      const mapped = res.data?.data?.map((e) => ({
        ...e,
        attendeesCount: e.attendeesCount ?? (Array.isArray(e.attendees) ? e.attendees.length : 0),
      }));
      return { ...res.data, data: mapped };
    },
  });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "" || value == null) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Events</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[220px]"
          placeholder="Search events…"
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[200px]"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setParam("tags", e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={upcoming === "true"}
            onChange={(e) => setParam("upcoming", e.target.checked ? "true" : "")}
          />
          Upcoming
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={past === "true"}
            onChange={(e) => setParam("past", e.target.checked ? "true" : "")}
          />
          Past
        </label>
        {(q || (category !== "All") || tags || upcoming !== "true" || past) && (
          <button
            className="text-sm underline ml-auto"
            onClick={() => setParams(new URLSearchParams([["upcoming", "true"]]), { replace: true })}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading && <div>Loading events…</div>}
      {isError && <div className="text-red-600">Failed to load events</div>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.data?.map((e) => <EventCard key={e._id} ev={e} />)}
      </div>

      {!isLoading && !data?.data?.length && (
        <div className="text-gray-600 mt-6">No events found. Try adjusting filters.</div>
      )}
    </div>
  );
}