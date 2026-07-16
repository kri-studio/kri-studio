// case-cursor.js — shared custom cursor logic for case pages
(function () {
  if (!matchMedia('(hover:hover)').matches) return;
  document.body.classList.add('has-cursor');
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }, { passive: true });

  (function loop() {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  function setMode(mode, label) {
    ring.classList.remove('hot');
    ring.removeAttribute('data-label');
    if (mode === 'open') { ring.classList.add('hot'); ring.setAttribute('data-label', label || 'смотреть'); }
    else if (mode === 'link') { ring.classList.add('hot'); ring.setAttribute('data-label', label || '→'); }
  }
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]');
    if (t) { setMode(t.getAttribute('data-cursor'), t.getAttribute('data-cursor-label')); return; }
    const a = e.target.closest('a, button');
    if (a) { setMode('link'); return; }
    setMode();
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = .9; });
})();
