export default function Card({ className = "", children }) {
  return (
    <div 
      className={`
        bg-white 
        border border-gray-200 
        rounded-2xl 
        shadow-sm 
        hover:shadow-md 
        transition-shadow 
        duration-200 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
