import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/layout/Container";
import AnnouncementCard from "../components/AnnouncementCard";

export default function AnnouncementsList() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const clubId = params.get("clubId") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["announcements", q, clubId],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (q) qs.set("q", q);
      if (clubId) qs.set("clubId", clubId);
      qs.set("limit", "20");
      const res = await api.get(`/api/announcements?${qs.toString()}`);
      return res.data;
    },
  });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Announcements</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[220px]"
          placeholder="Search announcements…"
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[240px]"
          placeholder="Filter by clubId (optional)"
          value={clubId}
          onChange={(e) => setParam("clubId", e.target.value)}
        />
        {(q || clubId) && (
          <button
            className="text-sm underline ml-auto"
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
          >
            Clear filters
          </button>
        )}
      </div>

      {isLoading && <div>Loading announcements…</div>}
      {isError && <div className="text-red-600">Failed to load</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((ann) => <AnnouncementCard key={ann._id} ann={ann} />)}
      </div>

      {!isLoading && !data?.data?.length && (
        <div className="text-gray-600 mt-6">No announcements found.</div>
      )}
    </Container>
  );
}