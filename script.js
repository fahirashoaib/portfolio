// ============================================================
// Mobile nav toggle
// ============================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// ============================================================
// Custom cursor dot (desktop only, purely decorative)
// ============================================================
const cursorDot = document.getElementById('cursorDot');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.width = '32px';
      cursorDot.style.height = '32px';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.width = '18px';
      cursorDot.style.height = '18px';
    });
  });
}

// ============================================================
// Reveal sections on scroll (fade + rise), plays once per element
// ============================================================
const fadeTargets = document.querySelectorAll('.project-card, .skill-card');
fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => fadeObserver.observe(el));

// ============================================================
// Slide-in-from-left reveal for hero text + section titles.
// Triggers once, only as the user scrolls down past the
// element (matches "moves slightly right into place" effect).
// ============================================================
const slideTargets = document.querySelectorAll('.reveal-right');

const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      slideObserver.unobserve(entry.target); // only ever plays once
    }
  });
}, { threshold: 0.2 });

slideTargets.forEach(el => slideObserver.observe(el));

// Hero elements should animate in immediately on page load,
// since they're visible before any scrolling happens.
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal-right').forEach(el => {
    el.classList.add('in-view');
    slideObserver.unobserve(el);
  });
});

// ============================================================
// Scroll-spy: highlight the current section's nav link with
// an underline as the user scrolls through the page.
// ============================================================
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const spySections = document.querySelectorAll('main section[id]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

spySections.forEach(sec => spyObserver.observe(sec));

// ============================================================
// Project modal
// ============================================================
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');
const modalGithub = document.getElementById('modalGithub');
//const modalVisit = document.getElementById('modalVisit');
const modalClose = document.getElementById('modalClose');

function openModal(card) {
  modalTitle.textContent = card.dataset.title || '';
  modalDesc.textContent = card.dataset.desc || '';

  modalTech.innerHTML = '';
  (card.dataset.tech || '').split(',').filter(Boolean).forEach(tech => {
    const li = document.createElement('li');
    li.textContent = tech.trim();
    modalTech.appendChild(li);
  });

  modalGithub.href = card.dataset.github || '#';
  // modalVisit.href = card.dataset.visit || '#';

  modalOverlay.classList.add('open');
  modalClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

// ============================================================
// Contact form (front-end only demo — wire up to a real
// backend or form service, see setup guide)
// ============================================================
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  status.textContent = 'Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.textContent = '✓ Message sent. I\'ll get back to you soon.';
      form.reset();
    } else {
      const data = await response.json().catch(() => null);
      console.error('Formspree error:', data);
      status.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    console.error('Network error:', err);
    status.textContent = 'Something went wrong. Please try again.';
  }
});
