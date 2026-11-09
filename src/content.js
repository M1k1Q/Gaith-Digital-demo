// All page copy lives here. Service details are inferred from the founder's LinkedIn
// "About" section — confirm with Ghaith Digital before going live.

export const HERO = {
  eyebrow: 'Dubai · IT consulting for SMEs',
  titleLead: 'Enterprise-grade technology, ',
  titleAccent: 'sized for your business.',
  stats: [
    { value: '20+ yrs', label: 'enterprise IT delivery' },
    { value: 'Double-digit', label: 'OpEx reductions delivered' },
    { value: 'Dubai', label: 'serving the UAE' },
  ],
};

/** One entry per 3D stage (1–5). `side` = which side the text card sits on. */
export const SERVICES = [
  {
    id: 's-data', label: 'Data', side: 'right',
    eyebrow: '01 · Data management & governance',
    title: 'Scattered data, gathered into one clear picture.',
    body: 'Your data lives in spreadsheets, inboxes and a dozen apps. We bring it together, decide who can access what, and turn it into reporting you can actually act on.',
    bullets: ['Data platforms & analytics', 'Data governance & access control', 'BI dashboards and reporting'],
  },
  {
    id: 's-cloud', label: 'Cloud', side: 'left',
    eyebrow: '02 · Cloud strategy',
    title: 'The right cloud, at the right size.',
    body: "Not every business needs a server room. We design cloud and Microsoft 365 setups that fit your size and budget — and we tell you honestly when you don't need to buy more.",
    bullets: ['Cloud migration & backup', 'Microsoft 365 & SaaS optimisation', 'Infrastructure right-sizing'],
    callout: 'Small businesses are often quoted for servers and upgrades they may not need. Get an independent second opinion before you sign.',
  },
  {
    id: 's-cicd', label: 'Automation', side: 'right',
    eyebrow: '03 · Automation & CI/CD',
    title: 'Changes that ship safely, every time.',
    body: 'Automated build, test and deploy pipelines — proven on enterprise big-data and BI stacks — brought to smaller teams, with secure change management built in.',
    bullets: ['CI/CD pipelines for apps, data & BI', 'Workflow & process automation', 'Secure, auditable change management'],
  },
  {
    id: 's-security', label: 'Security', side: 'left',
    eyebrow: '04 · Cybersecurity & compliance',
    title: "A shield around everything you've built.",
    body: 'Lessons from regulated environments, applied at small-business scale: sensible security, backups that actually restore, and compliance without the paperwork panic.',
    bullets: ['Security assessment & hardening', 'Backup & disaster recovery', 'Compliance readiness'],
  },
  {
    id: 's-finops', label: 'FinOps', side: 'right',
    eyebrow: '05 · FinOps & service management',
    title: 'Spend less. Run better.',
    body: "We audit what you're paying for, cut what you don't use, and put simple IT service management in place so everything keeps running smoothly.",
    stats: [
      { value: 'Double-digit', label: 'OpEx reductions delivered in enterprise environments' },
      { value: '20+ years', label: 'of data, cloud & security delivery' },
    ],
    bullets: ['Cloud & licence cost reviews', 'IT service management that fits', 'No jargon, no upselling'],
  },
];

export const FOUNDER = {
  initials: 'NA',
  name: 'Nooh Al Sayegh',
  role: 'Founder · 20+ years in enterprise IT — data, cloud, security & FinOps',
};

export const LINKEDIN_URL = 'https://www.linkedin.com/company/ghaith-digital/';
