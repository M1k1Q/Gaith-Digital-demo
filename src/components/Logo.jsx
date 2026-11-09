export function DropMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3C16 3 6 14.5 6 20.5a10 10 0 0 0 20 0C26 14.5 16 3 16 3Z" stroke="url(#gd-drop)" strokeWidth="2" />
      <path d="M12 21h3l2-4 2 6 1.5-2H22" stroke="#2de2c4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="gd-drop" x1="6" y1="3" x2="26" y2="30">
          <stop stopColor="#5ee6ff" />
          <stop offset="1" stopColor="#2de2c4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
