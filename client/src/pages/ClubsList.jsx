import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ClubCard from "../components/ClubCard";
import Container from "../components/layout/Container";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const categories = ["All", "Technical", "Cultural", "Sports", "Arts", "Music", "Other"];
const sorts = [
  { label: "Most followers", value: "-followerCount" },
  { label: "A–Z", value: "name" },
  { label: "Newest", value: "-createdAt" },
];

export default function ClubsList() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "-followerCount";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["clubs", q, category, sort],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (category !== "All") query.set("category", category);
      if (sort) query.set("sort", sort);
      query.set("limit", "24");
      const res = await api.get(`/api/clubs?${query.toString()}`);
      return res.data;
    },
  });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Clubs</h1>

      {/* Filters */}
      <Card className="mb-8 shadow-md border border-gray-200">
        <div className="p-4 sm:p-6 flex flex-wrap items-center gap-4">
          <Input
            className="flex-1 min-w-[240px] border-gray-300 focus:ring-2 focus:ring-indigo-300"
            placeholder="Search clubs…"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
          />
          <Select
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
            className="border-gray-300 focus:ring-2 focus:ring-indigo-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="border-gray-300 focus:ring-2 focus:ring-indigo-300"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
          {(q || category !== "All" || sort !== "-followerCount") && (
            <Button
              variant="secondary"
              className="ml-auto px-4 py-2 text-sm"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Clubs Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[200px] animate-pulse bg-gray-100 rounded-lg shadow-sm" />
          ))}
        </div>
      ) : isError ? (
        <Card className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Failed to load clubs</p>
          <Button
            variant="secondary"
            className="mt-4 px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </Card>
      ) : !data?.data?.length ? (
        <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-gray-900 font-medium text-lg">No clubs found</h2>
          <p className="mt-2 text-gray-600">
            Try adjusting your filters or search terms
          </p>
          {(q || category !== "All" || sort !== "-followerCount") && (
            <Button
              variant="secondary"
              className="mt-4 px-4 py-2"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Clear all filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      )}
    </Container>
  );
}
