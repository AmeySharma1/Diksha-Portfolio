/**
 * DIKSHA SHARMA PORTFOLIO – MAIN JAVASCRIPT
 * Handles: Navigation, theme toggle, cursor glow, scroll reveal,
 *           3D tilt, typewriter, skill bars, count-up, work tabs, contact form
 */

// ── THEME TOGGLE (runs FIRST to avoid flash) ──────────
(function initTheme() {
    const saved = localStorage.getItem('ds-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    // sync once body is parsed
    document.addEventListener('DOMContentLoaded', () => {
        syncThemeIcon(saved);
    });
})();

function syncThemeIcon(theme) {
    const thumb = document.getElementById('theme-thumb-icon');
    if (thumb) thumb.textContent = theme === 'light' ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ds-theme', next);
        syncThemeIcon(next);
    });
});

// ── NAVBAR ────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
}, { passive: true });

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        navLinks?.classList.remove('open');
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger?.contains(e.target)) {
        hamburger?.classList.remove('open');
        navLinks.classList.remove('open');
    }
});

// Active nav link
(function setActiveLink() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
})();

// ── CURSOR GLOW ───────────────────────────────────────
const cursor = document.querySelector('.cursor-glow');
if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, { passive: true });
}

// ── SCROLL REVEAL ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ── 3D TILT CARD ──────────────────────────────────────
// Only on non-touch devices
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = (-y / (rect.height / 2)) * 8;
            const rotY = (x / (rect.width / 2)) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.018)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ── TYPEWRITER EFFECT ─────────────────────────────────
function typewriter(el, texts, speed = 105, pause = 1800) {
    if (!el) return;
    let tIdx = 0, cIdx = 0, deleting = false;
    function tick() {
        const text = texts[tIdx];
        if (!deleting) {
            el.textContent = text.slice(0, ++cIdx);
            if (cIdx === text.length) { deleting = true; setTimeout(tick, pause); return; }
        } else {
            el.textContent = text.slice(0, --cIdx);
            if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; }
        }
        setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
}

const twEl = document.getElementById('typewriter-text');
if (twEl) {
    typewriter(twEl, ['Graphic Designer', 'Video Editor', 'Brand Storyteller', 'Creative Director', 'Visual Artist']);
}

// ── SKILL BAR ANIMATION ───────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                const pct = bar.getAttribute('data-pct') || '80';
                bar.style.width = pct + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.25 });

document.querySelectorAll('.skills-group').forEach(g => skillObserver.observe(g));

// ── COUNT-UP ANIMATION ────────────────────────────────
function countUp(el, target, duration = 1600) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(start); }
    }, 16);
}

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const val = parseInt(el.getAttribute('data-count'), 10);
            if (!isNaN(val)) countUp(el, val);
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ── WORK PAGE TABS ────────────────────────────────────
const tabs = document.querySelectorAll('.work-tab');
const sections = document.querySelectorAll('.work-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`section-${target}`)?.classList.add('active');
    });
});

// ── CONTACT FORM ──────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('success-msg');
const submitBtn = document.getElementById('submit-btn');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const service = document.getElementById('service')?.value || 'Not specified';
    const budget = document.getElementById('budget')?.value || 'Not specified';
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) return;

    // Loading state
    if (submitBtn) { submitBtn.innerHTML = '<span class="spinner"></span> Sending…'; submitBtn.disabled = true; }

    // Build mailto
    const subject = encodeURIComponent(`Portfolio Inquiry – ${name} (${service})`);
    const body = encodeURIComponent(
        `Hello Diksha,\n\nMy name is ${name} and I found you through your portfolio website.\n\n` +
        `Service Required: ${service}\nBudget: ${budget}\n\nMessage:\n${message}\n\n` +
        `Best regards,\n${name}\nReply to: ${email}`
    );

    await new Promise(r => setTimeout(r, 700));
    window.open(`mailto:diksk2025@gmail.com?subject=${subject}&body=${body}`);

    if (submitBtn) { submitBtn.innerHTML = '✉️ Send Message'; submitBtn.disabled = false; }
    if (contactForm && successMsg) {
        contactForm.style.display = 'none';
        successMsg.classList.add('show');
    }
});

// ── PAGE FADE IN ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.45s ease';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });
});
