import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%$<{}!@$&*◦◇◆◎'.split('');

function NotFound() {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let lastEmit = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastEmit < 65) return;
      lastEmit = now;

      if (panelRef.current?.contains(event.target as Node)) return;

      const rect = surface.getBoundingClientRect();
      const particle = document.createElement('span');
      particle.className = 'connect-hero__particle';
      particle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      particle.style.left = `${event.clientX - rect.left}px`;
      particle.style.top = `${event.clientY - rect.top}px`;
      surface.appendChild(particle);

      requestAnimationFrame(() => particle.classList.add('is-active'));

      setTimeout(() => {
        particle.remove();
      }, 1200);
    };

    surface.addEventListener('pointermove', handlePointerMove);
    return () => surface.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <section className="connect-hero not-found" aria-labelledby="not-found-title">
      <div className="connect-hero__surface" ref={surfaceRef}>
        <div className="connect-hero__panel not-found__panel" ref={panelRef}>
          <p className="connect-hero__eyebrow">Error 404</p>
          <h1 id="not-found-title">Seems you're lost.</h1>
          <p className="connect-hero__description">
            The link might be outdated, or the page may have been moved. Let&apos;s get you back on track.
          </p>

          <div className="not-found__cta">
            <Link to="/" className="not-found__button not-found__button--primary">
              <span className="top-key" aria-hidden="true" />
              <span className="button-text">Go Home</span>
              <span className="bottom-key-1" aria-hidden="true" />
              <span className="bottom-key-2" aria-hidden="true" />
            </Link>
            <Link to="/help" className="not-found__button not-found__button--secondary">
              <span className="top-key" aria-hidden="true" />
              <span className="button-text">Get Help</span>
              <span className="bottom-key-1" aria-hidden="true" />
              <span className="bottom-key-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="connect-hero__glow" aria-hidden="true" />
      </div>
    </section>
  );
}

export default NotFound;
