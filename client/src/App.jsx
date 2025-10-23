import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClubsList from "./pages/ClubsList";
import ClubDetail from "./pages/ClubDetail";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";

import AdminRoute from "./components/AdminRoute";
import AdminHome from "./pages/admin/AdminHome";
import AdminCreateClub from "./pages/AdminCreateClub";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import AdminEditClub from "./pages/admin/AdminEditClub";
import AdminEditEvent from "./pages/admin/AdminEditEvent";

import AnnouncementsList from "./pages/AnnouncementsList";
import Feed from "./pages/Feed";
import AdminCreateAnnouncement from "./pages/admin/AdminCreateAnnouncement";
import ProtectedRoute from "./components/ProtectedRoute";


function NotFound() {
  return <div className="p-6 text-center text-gray-600">Page not found</div>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar visible on all pages */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/clubs" element={<ClubsList />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />

        
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetail />} />

        <Route path="/announcements" element={<AnnouncementsList />} />

         <Route element={<ProtectedRoute />}>
           <Route path="/feed" element={<Feed />} />
        </Route>

          <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/clubs/new" element={<AdminCreateClub />} />
          <Route path="/admin/events/new" element={<AdminCreateEvent />} />

          <Route path="/admin/clubs/:id/edit" element={<AdminEditClub />} />
          <Route path="/admin/events/:id/edit" element={<AdminEditEvent />} />

          <Route path="/admin/announcements/new" element={<AdminCreateAnnouncement />} />
        </Route>
        {/* Add more pages later */}
        {/* <Route path="/clubs" element={<Clubs />} /> */}
        {/* <Route path="/events" element={<Events />} /> */}
        {/* <Route path="/admin" element={<Admin />} /> */}

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
