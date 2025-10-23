import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../contexts/AuthContext";

function formatRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleString()} – ${e.toLocaleString()}`;
}

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const clubQ = useQuery({
    queryKey: ["club", id],
    queryFn: async () => (await api.get(`/api/clubs/${id}`)).data,
  });


  const eventsQ = useQuery({
    queryKey: ["clubEvents", id],
    queryFn: async () =>
      (await api.get(`/api/events?clubId=${id}&upcoming=true&limit=3&sort=startAt`)).data,
  });
  
  if (clubQ.isLoading) {
    return (
      <Container className="py-8">
        <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div className="mt-3 h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="mt-6 h-40 w-full bg-gray-200 rounded-2xl animate-pulse" />
      </Container>
    );
  }

  if (clubQ.isError) {
    return <Container className="py-8 text-red-600">Failed to load club</Container>;
  }

  const club = clubQ.data.club;
  const isOwnerAdmin = user?.role === "admin" && user?._id === club?.createdBy?._id;
  
   
  const initialIsFollowing = Array.isArray(user?.followedClubs)
    ? user.followedClubs.some((c) => c === club._id || c?._id === club._id)
    : false;

  const handleDelete = async () => {
    if (!confirm("Delete this club? This cannot be undone.")) return;
    try {
      await api.delete(`/api/clubs/${club._id}`);
      navigate("/clubs");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete club");
    }
  };

  return (
    <div className="pb-12">
     

      <Container className="py-10 space-y-8">
         {/* === Secondary Navbar (Club Specific) === */}
    <div className="mt-5 sticky top-[64px] z-20 flex justify-center">
  <div className="bg-white/80 backdrop-blur-md shadow-md rounded-full px-8 py-3 flex gap-8 border border-gray-200">
    <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
      Dashboard
    </button>
    <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
      Members
    </button>
    <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
      Club Events
    </button>
    <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
      Announcements
    </button>
  </div>
</div>


        {/* === Header / Hero === */}
 <Card className="shadow-2xl border-none bg-white rounded-2xl overflow-hidden">
  {/* === Primary Header / Action Area (Left-side focus) === */}
  <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="flex-1 min-w-0">
        {/* Category Tag */}
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-200 uppercase tracking-wider">
          {club.category}
        </span>
        
        {/* Club Name */}
        <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tighter text-gray-900 leading-tight">
          {club.name}
        </h1>
        
        {/* Follower Count */}
        <div className="mt-3 flex items-center gap-2 text-base font-medium text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-500">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.516-.76 6.325-2.145a1.23 1.23 0 00.41-1.412A6.623 6.623 0 0110 15c-2.753 0-5.46-.725-7.145-2.007z" />
          </svg>
          <span className="text-gray-900 font-bold">{club.followerCount || 0}</span> followers
        </div>
      </div>

      {/* Action Buttons (Follow, Edit, Delete) - **CORRECTED BLOCK** */}
      <div className="flex flex-shrink-0 items-center gap-3 self-center md:self-start">
        <FollowButton
          clubId={club._id}
          initialFollowerCount={club.followerCount || 0}
          initialIsFollowing={initialIsFollowing}
        />
        {/* RESTORED: Admin Edit and Delete buttons */}
        {isOwnerAdmin && (
          <>
            <Link
              to={`/admin/clubs/${club._id}/edit`}
              className="text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 shadow-sm"
            >
              Edit Club
            </Link>
            <button
              onClick={handleDelete}
              className="text-sm font-semibold px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition duration-200 shadow-sm"
            >
              Delete
            </button>
          </>
        )}
      </div>
      {/* END CORRECTED BLOCK */}
    </div>
  </div>
  
  {/* === Content Area (Description, Tags, Socials) === */}
  <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {/* --- About Section (Takes 2/3 width on large screens) --- */}
    <div className="lg:col-span-2">
      <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">About the Club</h2>
      {club.description ? (
        <p className="leading-relaxed text-gray-700 whitespace-pre-wrap text-base">
          {club.description}
        </p>
      ) : (
        <p className="text-base italic text-gray-500">No detailed description has been provided for this club yet.</p>
      )}

      {/* Tags */}
      {Array.isArray(club.tags) && club.tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-600 mr-2 block mb-2">Key Tags:</span>
          <div className="flex flex-wrap gap-2">
            {club.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* --- Contact Section (Takes 1/3 width on large screens) --- */}
    <div className="lg:col-span-1 border-t pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8 border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Connect With Us</h3>
      
      {(club.socials?.website ||
        club.socials?.instagram ||
        club.socials?.linkedin ||
        club.socials?.email) ? (
          <div className="flex flex-col gap-3 text-base font-medium">
            {club.socials?.website && (
              <a
                href={club.socials.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out hover:underline underline-offset-4"
              >
                <span className="text-lg">🌐</span> Website
              </a>
            )}
            {club.socials?.instagram && (
              <a
                href={club.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition duration-150 ease-in-out hover:underline underline-offset-4"
              >
                <span className="text-lg">📸</span> Instagram
              </a>
            )}
            {club.socials?.linkedin && (
              <a
                href={club.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition duration-150 ease-in-out hover:underline underline-offset-4"
              >
                <span className="text-lg">💼</span> LinkedIn
              </a>
            )}
            {club.socials?.email && (
              <a
                href={`mailto:${club.socials.email}`}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition duration-150 ease-in-out hover:underline underline-offset-4"
              >
                <span className="text-lg">✉️</span> Email
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">No contact information available.</p>
        )}
    </div>
  </div>
</Card>
        {/* === Upcoming Events === */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link
              className="text-sm font-medium text-indigo-600 hover:underline"
              to={`/events?clubId=${club._id}`}
            >
              View all
            </Link>
          </div>

          {eventsQ.isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          ) : eventsQ.data?.data?.length ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {eventsQ.data.data.map((e) => (
                <Card key={e._id} className="p-5 shadow-sm hover:shadow-md transition">
                  <div className="text-xs text-gray-600">{formatRange(e.startAt, e.endAt)}</div>
                  <div className="mt-1 font-medium text-gray-900">{e.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{e.category}</div>
                  <Link
                    to={`/events/${e._id}`}
                    className="text-sm underline text-indigo-600 mt-2 inline-block hover:text-indigo-800"
                  >
                    Details
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-5 text-center text-sm text-gray-600">
              No upcoming events yet.
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
