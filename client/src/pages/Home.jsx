// src/pages/Home.jsx
import mainImage from './mainimg.png'; 

export default function Home() {
  return (
    // The main container with max-width and centering
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Welcome Text Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[#312E81]">Welcome to ClubHub</h1>
        <p className="text-lg text-gray-400">Discover and connect with clubs and events on your campus.</p>
      </div>

      {/* Single Image Section with smaller width and centered */}
      <div className="w-4/5 mx-auto"> {/* <-- Yahan badlaav kiya hai */}
        <img
          src={mainImage}
          alt="Students collaborating on a project for a club event."
          className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
        />
      </div>

    </div>
  );
}