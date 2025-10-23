import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Container from "../components/layout/Container";
import AnnouncementCard from "../components/AnnouncementCard";

export default function Feed() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => (await api.get("/api/announcements/feed/me")).data,
  });

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Feed</h1>

      {isLoading && <div>Loading feed…</div>}
      {isError && <div className="text-red-600">Failed to load feed</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((ann) => <AnnouncementCard key={ann._id} ann={ann} />)}
      </div>

      {!isLoading && !data?.data?.length && (
        <div className="text-gray-600 mt-6">
          No updates yet. Follow some clubs to see their announcements.
        </div>
      )}
    </Container>
  );
}