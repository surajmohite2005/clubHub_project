import { Link } from "react-router-dom";
import './AdminHome.css'; // <-- Import the CSS file

export default function AdminHome() {
  return (
    <div className="admin-home-container">
      <h1 className="admin-home__title">Admin</h1>
      <div className="admin-home__grid">
        <Link to="/admin/clubs/new" className="admin-card-link">
          <div className="admin-card-link__title">Create Club</div>
          <p className="admin-card-link__description">Add a new club to ClubHub.</p>
        </Link>
        <Link to="/admin/events/new" className="admin-card-link">
          <div className="admin-card-link__title">Create Event</div>
          <p className="admin-card-link__description">Schedule a new event for any club.</p>
        </Link>
        <Link to="/admin/announcements/new" className="admin-card-link">
          <div className="admin-card-link__title">Create Announcement</div>
          <p className="admin-card-link__description">Post an update for a club’s followers.</p>
        </Link>
      </div>
    </div>
  );
}