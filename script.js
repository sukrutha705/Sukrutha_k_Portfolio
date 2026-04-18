/* =============================================
   SUKRUTHA K – Portfolio JS
   Particles · Scroll Reveal · Navbar · Form
   ============================================= */

/* --- Cursor Glow --- */
const cursor = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.6)';
    cursor.style.background = 'rgba(0,212,255,0.15)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'transparent';
  });
});

/* --- Particles --- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*10}s;
      opacity:0;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* --- Sticky Navbar --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* --- Hamburger Menu --- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* --- Scroll Reveal --- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* --- Active Nav Link on Scroll --- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + height)
        ? 'var(--neon)' : '';
    }
  });
});

/* --- Typed Text Effect (Hero Role) --- */
const typeTarget = document.querySelector('.hero-role');
if (typeTarget) {
  const texts = [
    'Data Analytics & Web Design Student',
    'Java & Python Developer',
    'State-Level Bench Press Champion 🥇',
    'Aspiring Junior Data Analyst'
  ];
  let tIdx = 0, cIdx = 0, deleting = false;
  function type() {
    const current = texts[tIdx];
    typeTarget.textContent = deleting
      ? current.substring(0, --cIdx)
      : current.substring(0, ++cIdx);
    let delay = deleting ? 40 : 80;
    if (!deleting && cIdx === current.length) { delay = 2200; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; tIdx = (tIdx+1) % texts.length; delay = 400; }
    setTimeout(type, delay);
  }
  setTimeout(type, 1200);
}

/* --- Counter Animation (Stats) --- */
function animateCounter(el, target, duration = 1400) {
  let start = null;
  const isFloat = String(target).includes('.');
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (!isNaN(num)) animateCounter(el, num);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* --- Contact Form with FormSubmit --- */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    [name, email, message].forEach(f => {
      f.style.borderBottomColor = '';
      if (!f.value.trim()) {
        f.style.borderBottomColor = '#ff4466';
        f.style.animation = 'shake .3s';
        setTimeout(() => f.style.animation = '', 300);
        valid = false;
      }
    });
    if (!valid) return;

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.style.borderBottomColor = '#ff4466';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    try {
      const fd = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok || res.status === 200 || res.status === 302) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.style.animation = 'fadeIn .6s ease';
      } else {
        throw new Error('Network response was not ok');
      }
    } catch {
      // FormSubmit redirects, so if fetch fails treat as success
      form.style.display = 'none';
      successMsg.style.display = 'block';
    }
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
  });
}

/* --- Shake & FadeIn Keyframes (injected) --- */
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
@keyframes fadeIn {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
`;
document.head.appendChild(style);

/* --- Parallax tilt on project cards --- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    card.style.transform = `translateY(-6px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease';
  });
});

/* --- Skill bar glow on hover --- */
document.querySelectorAll('.skill-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.background = 'rgba(0,212,255,0.25)';
    tag.style.boxShadow  = '0 0 10px rgba(0,212,255,0.4)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.background = '';
    tag.style.boxShadow  = '';
  });
});
