import './CapacityBar.css'; // <-- Import the CSS file

export default function CapacityBar({ count = 0, capacity }) {
  // Logic remains the same
  const pct = capacity ? Math.min(100, Math.round((count / capacity) * 100)) : 0;
  if (!capacity) return null;

  return (
    <div className="capacity-bar-container">
      <div className="capacity-bar__labels">
        <span className="capacity-bar__label-text">Capacity</span>
        <span className="capacity-bar__label-count">{count} / {capacity}</span>
      </div>
      <div className="capacity-bar__background">
        <div 
          className="capacity-bar__fill" 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}