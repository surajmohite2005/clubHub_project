import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useAuth } from "../contexts/AuthContext";
import Card from "./ui/Card";
import Button from "./ui/Button";
import './ClubCard.css'; 

export default function ClubCard({ club }) {
  const { user } = useAuth();
  
  const initialIsFollowing = Array.isArray(user?.followedClubs)
    ? user.followedClubs.some((c) => c === club._id || c?._id === club._id)
    : false;

  return (
    // Padding vadhvli aahe
    <Card className="club-card p-6 flex flex-col justify-between h-full"> 
      <div>
        <div className="club-card__header flex items-center justify-between gap-4">
          {/* Title cha font size vadhvla */}
          <h3 className="club-card__title text-xl font-medium text-gray-900">{club.name}</h3> 
          {/* Category cha font size vadhvla */}
          <span className="club-card__category px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {club.category}
          </span>
        </div>

        {club.tags?.length ? (
          <div className="club-card__tags mt-3 flex flex-wrap gap-2"> {/* Thoda space vadhvla */}
            {club.tags.slice(0, 3).map((tag) => (
              // Tag cha font size vadhvla
              <span key={tag} className="club-card__tag px-2 py-1 rounded-full text-sm bg-gray-50 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer aani content madhla space vadhvla */}
      <div className="club-card__footer mt-6 flex items-center justify-between"> 
        <FollowButton
          clubId={club._id}
          initialFollowerCount={club.followerCount || 0}
          initialIsFollowing={initialIsFollowing}
        />
        <Button
          as={Link}
          to={`/clubs/${club._id}`}
          variant="secondary"
          // Button cha font size vadhvla
          className="club-card__button text-base" 
        >
          Details
        </Button>
      </div>
    </Card>
  );
}