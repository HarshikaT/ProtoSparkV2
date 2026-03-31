/* ═══════════════════════════════════════════
   PROTOSPARK — Main Script v2
   ═══════════════════════════════════════════ */

/* ── Logo image fallback ── */
document.querySelectorAll('.logo-img').forEach(img => {
  img.addEventListener('error', function () {
    this.classList.add('broken');
    const fallback = this.nextElementSibling;
    if (fallback && fallback.classList.contains('logo-fallback')) {
      fallback.classList.add('show');
    }
  });
});

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const mobilePanel = document.querySelector('.nav-mobile-panel');

navToggle?.addEventListener('click', () => {
  const isOpen = mobilePanel?.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close mobile nav when any link inside it is clicked
mobilePanel?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobilePanel.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close if clicking outside
document.addEventListener('click', (e) => {
  if (
    mobilePanel?.classList.contains('open') &&
    !mobilePanel.contains(e.target) &&
    !navToggle?.contains(e.target)
  ) {
    mobilePanel.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ── IntersectionObserver — scroll animations ── */
const animatedEls = document.querySelectorAll(
  '.animate-fade-up, .animate-slide-left, .animate-slide-right'
);

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const parent = el.parentElement;

      // Stagger siblings inside the same grid/flex parent
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll(
          '.animate-fade-up, .animate-slide-left, .animate-slide-right'
        ));
        const index = siblings.indexOf(el);
        if (index > -1) {
          el.style.transitionDelay = (index * 80) + 'ms';
        }
      }

      el.classList.add('is-visible');
      scrollObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

animatedEls.forEach(el => scrollObserver.observe(el));

/* ── Stats counter animation ── */
function animateCounter(el, target, suffix) {
  const duration = 1400;
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + eased * (target - startVal));
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('[data-count]');
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statsObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

statEls.forEach(el => statsObserver.observe(el));

/* ── AJAX form submission via Formspree ── */
function handleFormSubmit(formEl, successEl, errorEl) {
  if (!formEl) return;

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = formEl.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent || 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    // Hide any previous messages
    if (successEl) successEl.classList.remove('show');
    if (errorEl)   errorEl.classList.remove('show');

    try {
      const data = new FormData(formEl);
      const response = await fetch(formEl.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formEl.reset();
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.errors?.[0]?.message || 'Submission failed');
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = 'Something went wrong. Please try again or email contact@protospark.org.';
        errorEl.classList.add('show');
      }
      console.error('Form error:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

// Student registration form
handleFormSubmit(
  document.getElementById('student-registration-form'),
  document.getElementById('student-form-success'),
  document.getElementById('student-form-error')
);

// Leadership / volunteer application form
handleFormSubmit(
  document.getElementById('leadership-application-form'),
  document.getElementById('volunteer-form-success'),
  document.getElementById('volunteer-form-error')
);
