import { Link } from "react-router-dom";

export default function AnnouncementCard({ ann }) {
  const created = new Date(ann.createdAt).toLocaleString();
  const preview = (ann.content || "").length > 160
    ? ann.content.slice(0, 160) + "..."
    : ann.content || "";

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium">{ann.title}</h3>
        <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
          {ann?.club?.name || "Club"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{preview}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>{created}</span>
        <Link to={`/clubs/${ann?.club?._id || ann.club}`} className="underline">View club</Link>
      </div>
    </div>
  );
}