import { forwardRef, useState } from 'react';
import { FOUNDER, HERO, LINKEDIN_URL } from '../content';

export const Hero = forwardRef(function Hero(_, ref) {
  return (
    <section ref={ref} className="panel hero" id="s-hero">
      <div className="hero-inner">
        <div className="eyebrow">{HERO.eyebrow}</div>
        <h1>
          {HERO.titleLead}
          <em>{HERO.titleAccent}</em>
        </h1>
        <p>
          <span className="ar">غيث</span> <i>Ghaith</i> is the rain that brings relief. We bring 20+ years of
          enterprise IT experience to small and medium businesses — practical, affordable, and explained in plain
          language.
        </p>
        <div className="actions">
          <a href="#s-contact" className="btn btn-primary">Book a free tech check-up</a>
          <a href="#s-data" className="btn btn-ghost">See how we work ↓</a>
        </div>
        <div className="stats">
          {HERO.stats.map((s) => (
            <div key={s.value}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export const ServicePanel = forwardRef(function ServicePanel({ service }, ref) {
  const { id, side, eyebrow, title, body, bullets, callout, stats } = service;
  return (
    <section ref={ref} className={`panel ${side === 'right' ? 'right' : ''}`} id={id}>
      <div className="card">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{body}</p>
        {stats && (
          <div className="stat-row">
            {stats.map((s) => (
              <div className="stat" key={s.value}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <ul>
          {bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
        {callout && <div className="callout">{callout}</div>}
      </div>
    </section>
  );
});

export const Contact = forwardRef(function Contact(_, ref) {
  const [note, setNote] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    // Concept only — wire this to a form backend / inbox before launch.
    setNote("Thanks! This is a concept preview — the live form will go straight to Ghaith Digital's inbox.");
    e.currentTarget.reset();
  };
  return (
    <section ref={ref} className="panel center contact" id="s-contact">
      <div className="card">
        <div>
          <div className="eyebrow">Let's talk</div>
          <h2>Start with a free tech check-up.</h2>
          <p style={{ marginTop: 16 }}>
            A short, no-obligation conversation about your current setup. We'll tell you what's working, what's
            costing you too much, and what you genuinely don't need.
          </p>
          <div className="founder">
            <div className="avatar">{FOUNDER.initials}</div>
            <div>
              <b>{FOUNDER.name}</b>
              <span>{FOUNDER.role}</span>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <label>Your name<input name="name" autoComplete="name" required /></label>
          <label>Business<input name="business" autoComplete="organization" /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>What's slowing your business down?<textarea name="message" /></label>
          <button className="btn btn-primary" type="submit">Request my check-up</button>
          <div className="form-note" role="status">{note}</div>
        </form>
      </div>
      <footer>
        <span>© 2026 Ghaith Digital · Dubai, United Arab Emirates</span>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span>Concept designed by Altynx</span>
      </footer>
    </section>
  );
});
