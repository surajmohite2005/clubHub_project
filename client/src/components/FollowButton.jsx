import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import './FollowButton.css'; // <-- Import the CSS file

export default function FollowButton({ clubId, initialFollowerCount = 0, initialIsFollowing = false, onChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [following, setFollowing] = useState(initialIsFollowing);
  const [count, setCount] = useState(initialFollowerCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!user) return navigate("/login");

    try {
      setLoading(true);
      const { data } = await api.post(`/api/clubs/${clubId}/follow`);

      setFollowing(Boolean(data.followed));
      if (typeof data.followerCount === "number") setCount(data.followerCount);

      onChange?.(data);
    } catch (e) {
      console.error("Follow toggle failed", e);
    } finally {
      setLoading(false);
    }
  };

  // Add the 'following' class when the user is following the club
  const buttonClasses = `follow-button ${following ? 'following' : ''}`;

  return (
    <div className="follow-button-container">
      <button
        onClick={toggle}
        disabled={loading}
        className={buttonClasses}
      >
        <span className="follow-text">{following ? "Following" : "Follow"}</span>
        <span className="unfollow-text">Unfollow</span>
      </button>
      <span className="follower-count">👥 {count}</span>
    </div>
  );
}