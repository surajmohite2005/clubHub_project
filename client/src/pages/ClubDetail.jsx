import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Container from "../components/layout/Container";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../contexts/AuthContext";
import './ClubDetail.css'; // <-- Import the new CSS file

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
  
  // Dark theme loading state
  if (clubQ.isLoading) {
    return (
      <Container className="py-8">
        <div className="loading-skeleton" style={{ height: '32px', width: '66%' }} />
        <div className="loading-skeleton" style={{ height: '16px', width: '33%', marginTop: '12px' }} />
        <div className="loading-skeleton" style={{ height: '200px', width: '100%', marginTop: '24px', borderRadius: '16px' }} />
      </Container>
    );
  }

  // Dark theme error state
  if (clubQ.isError) {
    return <Container className="py-8 error-message">Failed to load club</Container>;
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
    <div className="club-detail-page">
      {/* === Secondary Navbar (Club Specific) === */}
      <br /><br />

      <Container className="club-detail-container">
        {/* === Header / Hero === */}
        <div className="club-header">
          {/* === Primary Header / Action Area === */}
          <div className="club-header__primary">
            <div className="club-header__info">
              <span className="club-header__category">{club.category}</span>
              <h1 className="club-header__name">{club.name}</h1>
              <div className="club-header__followers">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.516-.76 6.325-2.145a1.23 1.23 0 00.41-1.412A6.623 6.623 0 0110 15c-2.753 0-5.46-.725-7.145-2.007z" />
                </svg>
                <span><b>{club.followerCount || 0}</b> followers</span>
              </div>
            </div>

            <div className="club-header__actions">
              <FollowButton
                clubId={club._id}
                initialFollowerCount={club.followerCount || 0}
                initialIsFollowing={initialIsFollowing}
              />
              {isOwnerAdmin && (
                <>
                  <Link to={`/admin/clubs/${club._id}/edit`} className="button button--secondary">Edit Club</Link>
                  <button onClick={handleDelete} className="button button--danger">Delete</button>
                </>
              )}
            </div>
          </div>
          
          {/* === Content Area (Description, Tags, Socials) === */}
          <div className="club-content-grid">
            {/* --- About Section --- */}
            <div className="club-content__about">
              <h2 className="section-title">About the Club</h2>
              {club.description ? (
                <p className="club-content__description">{club.description}</p>
              ) : (
                <p className="italic-placeholder">No detailed description has been provided for this club yet.</p>
              )}

              {Array.isArray(club.tags) && club.tags.length > 0 && (
                <div className="club-tags-container">
                  <span className="club-tags__label">Key Tags:</span>
                  <div className="club-tags__list">
                    {club.tags.map((t) => <span key={t} className="club-tag">#{t}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* --- Connect Section --- */}
            <div className="club-content__connect">
              <h3 className="section-title">Connect With Us</h3>
              {(club.socials?.website || club.socials?.instagram || club.socials?.linkedin || club.socials?.email) ? (
                <div className="social-links">
                  {club.socials?.website && <a href={club.socials.website} target="_blank" rel="noreferrer" className="social-link social-link--website"><span>🌐</span> Website</a>}
                  {club.socials?.instagram && <a href={club.socials.instagram} target="_blank" rel="noreferrer" className="social-link social-link--instagram"><span>📸</span> Instagram</a>}
                  {club.socials?.linkedin && <a href={club.socials.linkedin} target="_blank" rel="noreferrer" className="social-link social-link--linkedin"><span>💼</span> LinkedIn</a>}
                  {club.socials?.email && <a href={`mailto:${club.socials.email}`} className="social-link social-link--email"><span>✉️</span> Email</a>}
                </div>
              ) : (
                <p className="italic-placeholder">No contact information available.</p>
              )}
            </div>
          </div>
        </div>

        {/* === Upcoming Events === */}
        <div className="upcoming-events">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <Link className="view-all-link" to={`/events?clubId=${club._id}`}>View all</Link>
          </div>

          {eventsQ.isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="loading-skeleton" style={{ height: '112px', borderRadius: '16px' }} />
              <div className="loading-skeleton" style={{ height: '112px', borderRadius: '16px' }} />
            </div>
          ) : eventsQ.data?.data?.length ? (
            <div className="events-grid">
              {eventsQ.data.data.map((e) => (
                <div key={e._id} className="event-preview-card">
                  <div className="event-preview__date">{formatRange(e.startAt, e.endAt)}</div>
                  <div className="event-preview__title">{e.title}</div>
                  <div className="event-preview__category">{e.category}</div>
                  <Link to={`/events/${e._id}`} className="event-preview__link">Details</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-card">No upcoming events yet.</div>
          )}
        </div>
      </Container>
    </div>
  );
}