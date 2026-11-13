import { Link } from "react-router-dom";
import './AnnouncementCard.css'; // <-- Import the new CSS file

export default function AnnouncementCard({ ann }) {
  const created = new Date(ann.createdAt).toLocaleString();
  const preview = (ann.content || "").length > 160
    ? ann.content.slice(0, 160) + "..."
    : ann.content || "";

  return (
    <div className="announcement-card">
      <div className="ann-card__header">
        <h3 className="ann-card__title">{ann.title}</h3>
        <span className="ann-card__club-badge">
          {ann?.club?.name || "Club"}
        </span>
      </div>

      <p className="ann-card__preview">{preview}</p>
      
      <div className="ann-card__footer">
        <span className="ann-card__date">{created}</span>
        <Link to={`/clubs/${ann?.club?._id || ann.club}`} className="ann-card__link">
          View club
        </Link>
      </div>
    </div>
  );
}