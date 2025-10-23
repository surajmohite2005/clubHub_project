import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/clubs/new" className="block border rounded-lg p-4 bg-white hover:bg-gray-50">
          <div className="font-medium">Create Club</div>
          <p className="text-sm text-gray-600">Add a new club to ClubHub.</p>
        </Link>
        <Link to="/admin/events/new" className="block border rounded-lg p-4 bg-white hover:bg-gray-50">
          <div className="font-medium">Create Event</div>
          <p className="text-sm text-gray-600">Schedule a new event for any club.</p>
        </Link>
         <Link to="/admin/announcements/new" className="block border rounded-lg p-4 bg-white hover:bg-gray-50">
          
          <div className="font-medium">Create Announcement</div>
          <p className="text-sm text-gray-600 mt-1">Post an update for a club’s followers.</p>
        
       </Link>
      </div>
    </div>
  );
}