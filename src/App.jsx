import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Nav, Rail } from './components/Nav';
import { Contact, Hero, ServicePanel } from './components/Sections';
import { SERVICES } from './content';
import { measure, rawStage, registerPanels } from './lib/scroll';

// three.js + R3F live entirely in this lazy chunk. Start fetching it immediately
// (in parallel with fonts) so the page text never waits on the 3D download.
const loadExperience = () => import('./three/Experience');
loadExperience();
const Experience = lazy(loadExperience);
const LABELS = ['Intro', ...SERVICES.map((s) => s.label), 'Contact'];

/** Labels in the 3D scene are drawn to canvas, so wait for the web fonts first (max 1.5 s). */
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.race([
      Promise.all([document.fonts.load('600 48px Sora'), document.fonts.ready]),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(() => setReady(true));
  }, []);
  return ready;
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function App() {
  const fontsReady = useFontsReady();
  const [hasGL] = useState(webglAvailable);
  const [sceneReady, setSceneReady] = useState(false);
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const panels = useRef([]);

  useEffect(() => {
    if (!hasGL) document.body.classList.add('no-webgl');
  }, [hasGL]);

  useEffect(() => {
    const els = panels.current;
    registerPanels(els);

    const onScroll = () => {
      const r = rawStage();
      setActive(Math.round(r));
      setShowHint(r < 0.2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.querySelector('main'));

    // Fade each card in once its section scrolls into view.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.3 }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const scrollToPanel = (i) => panels.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const setPanel = (i) => (el) => { panels.current[i] = el; };

  return (
    <>
      {/* Text renders immediately; the 3D fades in behind it once its first frame is drawn. */}
      {hasGL && fontsReady && (
        <div className={`scene ${sceneReady ? 'ready' : ''}`} aria-hidden="true">
          <Suspense fallback={null}>
            <Experience onReady={() => setSceneReady(true)} />
          </Suspense>
        </div>
      )}
      <div className="vignette" />

      <Nav />
      <Rail labels={LABELS} active={active} onSelect={scrollToPanel} />
      <div className="scroll-hint" style={{ opacity: showHint ? 1 : 0 }}>
        <span>Scroll</span>
        <i />
      </div>

      <main>
        <Hero ref={setPanel(0)} />
        {SERVICES.map((s, i) => (
          <ServicePanel key={s.id} ref={setPanel(i + 1)} service={s} />
        ))}
        <Contact ref={setPanel(SERVICES.length + 1)} />
      </main>
    </>
  );
}
