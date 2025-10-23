import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

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
      // Optionally show toast or error message
      console.error("Follow toggle failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded-md border text-sm ${
          following
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
      <span className="text-xs text-gray-600">👥 {count}</span>
    </div>
  );
}
