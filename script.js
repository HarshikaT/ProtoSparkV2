/* ═══════════════════════════════════════════
   PROTOSPARK — Main Script
   ═══════════════════════════════════════════ */

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Scroll-in animations ── */
const fadeEls = document.querySelectorAll(
  '.about-card, .learn-card, .recruit-card, .chapter-step, .schedule-day, .faq-item'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── Form submissions ── */
document.getElementById('student-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('🎉 Registration received! We\'ll be in touch soon.');
  e.target.reset();
});

document.getElementById('volunteer-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✅ Application submitted! Welcome to the ProtoSpark family.');
  e.target.reset();
});

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1A1040;
    color: #fff;
    padding: 16px 28px;
    border-radius: 50px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    z-index: 9999;
    transition: transform 0.3s ease;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Nav active style ── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { background: var(--purple-light); color: var(--purple); }`;
document.head.appendChild(style);
