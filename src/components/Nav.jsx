import { DropMark } from './Logo';

export function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#s-hero">
        <DropMark />
        Ghaith Digital <span className="ar">غيث</span>
      </a>
      <nav className="nav-links">
        <a href="#s-data">Services</a>
        <a href="#s-finops">Why Ghaith</a>
        <a href="#s-contact" className="btn btn-primary">Free tech check-up</a>
      </nav>
    </header>
  );
}

/** Right-hand section dots; `active` is the section closest to the viewport centre. */
export function Rail({ labels, active, onSelect }) {
  return (
    <div className="rail" aria-label="Sections">
      {labels.map((label, i) => (
        <button key={label} aria-label={label} className={i === active ? 'active' : ''} onClick={() => onSelect(i)}>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
