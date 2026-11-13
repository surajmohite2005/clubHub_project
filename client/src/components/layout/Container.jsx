import './Container.css'; // <-- Import the CSS file

export default function Container({ className = "", children }) {
  // Combine our base 'container' class with any others passed in
  return (
    <div className={`container ${className}`}>
      {children}
    </div>
  );
}