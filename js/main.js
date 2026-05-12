// =============================================
// EBG CREATIVE — MAIN JS
// All animations, interactions, transitions
// =============================================

(function() {

// ── SCROLL PROGRESS BAR
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:0%;background:#B8C9E8;z-index:9999;transition:width 0.1s linear;pointer-events:none;';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
});

// ── CUSTOM CURSOR
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

// ── NAV SCROLL
const nav = document.querySelector('nav');
const isLightPage = document.body.classList.contains('light-page');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav && nav.classList.add('scrolled');
    if (isLightPage) nav && nav.classList.add('light');
  } else {
    nav && nav.classList.remove('scrolled');
    if (isLightPage) nav && nav.classList.remove('light');
  }
});

// ── PAGE TRANSITIONS
const curtain = document.createElement('div');
curtain.style.cssText = 'position:fixed;inset:0;background:#1C2B4A;z-index:99999;transform:translateY(-100%);transition:transform 0.5s cubic-bezier(0.76,0,0.24,1);pointer-events:none;';
document.body.appendChild(curtain);
setTimeout(() => { curtain.style.transform = 'translateY(-100%)'; }, 50);

document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || href.startsWith('//')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    curtain.style.transform = 'translateY(0%)';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 480);
  });
});

// ── INJECT ANIMATION STYLES
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity:0; transform:translateY(36px); transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-delay-1 { transition-delay:0.1s; }
  .reveal-delay-2 { transition-delay:0.2s; }
  .reveal-delay-3 { transition-delay:0.3s; }
  .reveal-delay-4 { transition-delay:0.4s; }
  .tilt-card { transform-style:preserve-3d; will-change:transform; }
  .magnetic-btn { display:inline-block; transition:transform 0.3s cubic-bezier(0.16,1,0.3,1); }
  .portfolio-tile-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(28,43,74,0.96) 0%,transparent 55%);opacity:0;transition:opacity 0.4s ease;pointer-events:none; }
  .portfolio-tile:hover .portfolio-tile-overlay { opacity:1; }
  .portfolio-tile { position:relative;overflow:hidden; }
  .form-group label { transition:color 0.2s; display:block; }
  .form-group:focus-within label { color:#7A99BF; }
  .form-group input:focus,.form-group select:focus,.form-group textarea:focus { transform:translateY(-1px); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
`;
document.head.appendChild(style);

// ── STAGGER REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ── COUNT UP
function animateCount(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g,''));
  if (isNaN(target) || target <= 1) return;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const isInt = Number.isInteger(target);
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + (isInt ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count-up').forEach(c => animateCount(c));
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-strip,.about-stats').forEach(el => countObs.observe(el));

// ── TILT CARDS
document.querySelectorAll('.service-item,.testimonial-card,.shop-card').forEach(card => {
  card.classList.add('tilt-card');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y - r.height/2) / (r.height/2)) * -6;
    const ry = ((x - r.width/2) / (r.width/2)) * 6;
    card.style.transform = 'perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) scale(1.02)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// ── MAGNETIC BUTTONS
document.querySelectorAll('.btn-primary,.btn-dark,.btn-ghost,.nav-cta').forEach(btn => {
  btn.classList.add('magnetic-btn');
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.28;
    const y = (e.clientY - r.top - r.height/2) * 0.38;
    btn.style.transform = 'translate('+x+'px,'+y+'px)';
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// ── PARALLAX MASCOT
const mascot = document.querySelector('.about-mascot-img');
if (mascot) {
  window.addEventListener('scroll', () => {
    const r = mascot.parentElement.getBoundingClientRect();
    const offset = (r.top + r.height/2 - window.innerHeight/2) * 0.12;
    mascot.style.transform = 'translateY('+offset+'px)';
  });
}

// ── PORTFOLIO TILE OVERLAY
document.querySelectorAll('.portfolio-tile').forEach(tile => {
  if (!tile.querySelector('.portfolio-tile-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-tile-overlay';
    tile.appendChild(overlay);
  }
});

// ── DRAGGABLE HORIZONTAL PORTFOLIO SCROLL
const portfolioTiles = document.querySelector('.portfolio-tiles');
if (portfolioTiles) {
  portfolioTiles.style.cssText += ';display:flex;overflow-x:auto;gap:1.5rem;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:1rem;cursor:grab;';
  portfolioTiles.querySelectorAll('.portfolio-tile').forEach(t => {
    t.style.cssText += ';min-width:min(480px,80vw);scroll-snap-align:start;flex-shrink:0;';
  });
  let isDown = false, startX, scrollLeft;
  portfolioTiles.addEventListener('mousedown', e => { isDown = true; portfolioTiles.style.cursor = 'grabbing'; startX = e.pageX - portfolioTiles.offsetLeft; scrollLeft = portfolioTiles.scrollLeft; });
  portfolioTiles.addEventListener('mouseleave', () => { isDown = false; portfolioTiles.style.cursor = 'grab'; });
  portfolioTiles.addEventListener('mouseup', () => { isDown = false; portfolioTiles.style.cursor = 'grab'; });
  portfolioTiles.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); portfolioTiles.scrollLeft = scrollLeft - (e.pageX - portfolioTiles.offsetLeft - startX) * 1.5; });
}

// ── FORM FIELD STAGGER
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach((g, i) => {
  g.style.opacity = '0';
  g.style.transform = 'translateY(18px)';
  g.style.transition = 'opacity 0.5s '+( i * 0.08)+'s ease,transform 0.5s '+(i * 0.08)+'s ease';
});
const formObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.form-group').forEach(g => { g.style.opacity='1'; g.style.transform='translateY(0)'; });
      formObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.contact-form').forEach(f => formObs.observe(f));

// ── ACTIVE NAV LINK
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.style.color = '#B8C9E8';
});

// ── MARK COUNT-UP ELEMENTS
document.querySelectorAll('.stat-value,.about-stat-value').forEach(el => {
  const n = parseFloat(el.textContent);
  if (!isNaN(n) && n > 1) { el.dataset.target = n; el.classList.add('count-up'); }
});

})();
