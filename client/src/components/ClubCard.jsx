import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { useAuth } from "../contexts/AuthContext";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function ClubCard({ club }) {
  const { user } = useAuth();
  console.log(club._id);
  // Determine if the current user is following this club
  const initialIsFollowing = Array.isArray(user?.followedClubs)
    ? user.followedClubs.some((c) => c === club._id || c?._id === club._id)
    : false;

  return (
    <Card className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-gray-900">{club.name}</h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {club.category}
          </span>
        </div>

        {club.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {club.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <FollowButton
          clubId={club._id}
          initialFollowerCount={club.followerCount || 0}
          initialIsFollowing={initialIsFollowing}
        />
        <Button
          as={Link}
          to={`/clubs/${club._id}`}
          variant="secondary"
          className="text-sm"
        >
          Details
        </Button>
      </div>
    </Card>
  );
}
