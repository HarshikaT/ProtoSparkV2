/* ═══════════════════════════════════════════
   PROTOSPARK — Main Script
   ═══════════════════════════════════════════ */

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Page routing ── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId)?.classList.add('active');
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(initScrollAnimations, 80);
}

/* ── Scroll-in animations ── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.page.active .fade-up:not(.visible)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

/* ── FAQ accordion ── */
document.addEventListener('click', (e) => {
  const summary = e.target.closest('.faq-item summary');
  if (!summary) return;
  const item = summary.closest('.faq-item');
  const isOpen = item.hasAttribute('open');
  document.querySelectorAll('.faq-item[open]').forEach(i => i.removeAttribute('open'));
  if (!isOpen) item.setAttribute('open', '');
});

/* ── Storage helpers ── */
function getStudents()    { try { return JSON.parse(localStorage.getItem('ps_students') || '[]'); } catch(e) { return []; } }
function getVolunteers()  { try { return JSON.parse(localStorage.getItem('ps_volunteers') || '[]'); } catch(e) { return []; } }
function saveStudents(d)  { localStorage.setItem('ps_students', JSON.stringify(d)); }
function saveVolunteers(d){ localStorage.setItem('ps_volunteers', JSON.stringify(d)); }

/* ── Student form ── */
document.getElementById('student-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const entry = {
    id: Date.now(),
    submittedAt: new Date().toLocaleString(),
    parentName:  form.querySelector('[name="parent-name"]').value.trim(),
    studentName: form.querySelector('[name="student-name"]').value.trim(),
    contactPref: form.querySelector('[name="contact-pref"]').value,
    email:       form.querySelector('[name="email"]').value.trim(),
    phone:       form.querySelector('[name="phone"]').value.trim(),
    ageGroup:    form.querySelector('[name="age-group"]').value,
    country:     form.querySelector('[name="country"]').value,
    notes:       form.querySelector('[name="notes"]').value.trim(),
  };
  if (!entry.parentName || !entry.studentName || !entry.email || !entry.contactPref || !entry.ageGroup) {
    showToast('⚠️ Please fill in all required fields.'); return;
  }
  const students = getStudents();
  students.push(entry);
  saveStudents(students);
  showToast('🎉 Registration received! We\'ll be in touch at ' + entry.email);
  form.reset();
  const subject = encodeURIComponent('New Student Registration: ' + entry.studentName);
  const body = encodeURIComponent('New student registration!\n\nParent: ' + entry.parentName + '\nStudent: ' + entry.studentName + '\nEmail: ' + entry.email + '\nAge Group: ' + entry.ageGroup + '\nCountry: ' + entry.country + '\nNotes: ' + entry.notes);
  setTimeout(() => window.open('mailto:contact@protospark.org?subject=' + subject + '&body=' + body), 500);
});

/* ── Volunteer form ── */
document.getElementById('volunteer-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const entry = {
    id: Date.now(),
    submittedAt: new Date().toLocaleString(),
    name:       form.querySelector('[name="vol-name"]').value.trim(),
    email:      form.querySelector('[name="vol-email"]').value.trim(),
    phone:      form.querySelector('[name="vol-phone"]').value.trim(),
    region:     form.querySelector('[name="vol-region"]').value,
    timezone:   form.querySelector('[name="vol-timezone"]').value,
    languages:  form.querySelector('[name="vol-languages"]').value.trim(),
    codingBg:   form.querySelector('[name="vol-coding-bg"]').value.trim(),
    role:       form.querySelector('[name="vol-role"]').value,
    motivation: form.querySelector('[name="vol-motivation"]').value.trim(),
  };
  if (!entry.name || !entry.email || !entry.region || !entry.timezone || !entry.languages || !entry.codingBg || !entry.motivation) {
    showToast('⚠️ Please fill in all required fields.'); return;
  }
  const vols = getVolunteers();
  vols.push(entry);
  saveVolunteers(vols);
  showToast('✅ Application submitted! Welcome to the ProtoSpark family.');
  form.reset();
  const subject = encodeURIComponent('New Volunteer Application: ' + entry.name);
  const body = encodeURIComponent('New volunteer application!\n\nName: ' + entry.name + '\nEmail: ' + entry.email + '\nRegion: ' + entry.region + '\nRole: ' + entry.role + '\nLanguages: ' + entry.languages + '\nCoding BG: ' + entry.codingBg + '\nMotivation: ' + entry.motivation);
  setTimeout(() => window.open('mailto:contact@protospark.org?subject=' + subject + '&body=' + body), 500);
});

/* ── Toast ── */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1A1040; color: #fff;
    padding: 16px 28px; border-radius: 50px;
    font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 0.95rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25); z-index: 9999;
    transition: transform 0.3s ease; white-space: nowrap;
    max-width: 90vw; text-align: center;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }));
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Admin panel ── */
function openAdmin() {
  document.getElementById('admin-panel').style.display = 'flex';
  renderAdmin('students');
  updateAdminCounts();
}
function closeAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
}
function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAdmin(tab);
}
function updateAdminCounts() {
  document.getElementById('admin-count-students').textContent = getStudents().length;
  document.getElementById('admin-count-vols').textContent = getVolunteers().length;
}
function renderAdmin(tab) {
  const el = document.getElementById('admin-content');
  if (tab === 'students') {
    const data = getStudents();
    if (!data.length) { el.innerHTML = '<p class="admin-empty">No student registrations yet.</p>'; return; }
    el.innerHTML = `<div class="admin-row-head"><strong>${data.length} registration(s)</strong><button class="admin-clear-btn" onclick="clearStudents()">Clear All</button></div>` +
      data.map(s => `<div class="admin-card">
        <div class="admin-meta">${s.submittedAt}</div>
        <div class="admin-grid">
          <span class="af">Parent</span><span>${s.parentName}</span>
          <span class="af">Student</span><span>${s.studentName}</span>
          <span class="af">Email</span><span>${s.email}</span>
          <span class="af">Phone</span><span>${s.phone || '—'}</span>
          <span class="af">Contact Pref</span><span>${s.contactPref}</span>
          <span class="af">Age Group</span><span>${s.ageGroup}</span>
          <span class="af">Country</span><span>${s.country || '—'}</span>
          <span class="af">Notes</span><span>${s.notes || '—'}</span>
        </div>
      </div>`).join('');
  } else {
    const data = getVolunteers();
    if (!data.length) { el.innerHTML = '<p class="admin-empty">No volunteer applications yet.</p>'; return; }
    el.innerHTML = `<div class="admin-row-head"><strong>${data.length} application(s)</strong><button class="admin-clear-btn" onclick="clearVolunteers()">Clear All</button></div>` +
      data.map(v => `<div class="admin-card">
        <div class="admin-meta">${v.submittedAt}</div>
        <div class="admin-grid">
          <span class="af">Name</span><span>${v.name}</span>
          <span class="af">Email</span><span>${v.email}</span>
          <span class="af">Phone</span><span>${v.phone || '—'}</span>
          <span class="af">Region</span><span>${v.region}</span>
          <span class="af">Timezone</span><span>${v.timezone}</span>
          <span class="af">Languages</span><span>${v.languages}</span>
          <span class="af">Role</span><span>${v.role || '—'}</span>
          <span class="af">Coding BG</span><span>${v.codingBg}</span>
          <span class="af">Motivation</span><span>${v.motivation}</span>
        </div>
      </div>`).join('');
  }
}
function clearStudents()   { if(confirm('Clear all student registrations?')) { saveStudents([]); renderAdmin('students'); updateAdminCounts(); } }
function clearVolunteers() { if(confirm('Clear all volunteer applications?')) { saveVolunteers([]); renderAdmin('volunteers'); updateAdminCounts(); } }

/* ── Nav active style injection ── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { background: var(--purple-light); color: var(--purple); }`;
document.head.appendChild(style);
