document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Année dans le footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Navbar : ombre au scroll + lien actif ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = sections[0]?.id;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu burger (mobile) ---------- */
  const burger = document.getElementById('burger');
  const navLinksList = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });
  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });

  /* ---------- Effet machine à écrire (hero) ---------- */
  const roles = ['Développeur Web', 'Étudiant en Cybersécurité', 'Passionné de Cryptographie'];
  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  typeLoop();

  /* ---------- Halo qui suit le curseur ---------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  } else {
    glow.style.display = 'none';
  }

  /* ---------- Animations au scroll (reveal + compteurs + barres) ---------- */
  const revealTargets = document.querySelectorAll(
    '.about__grid, .stats, .skills-grid, .projects-grid, .contact__grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const statNums = document.querySelectorAll('.stat__num');
  const skillBars = document.querySelectorAll('.skill-bar span');

  function animateCounters() {
    statNums.forEach(num => {
      const target = parseInt(num.dataset.count, 10);
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        count = Math.min(target, count + step);
        num.textContent = count;
        if (count < target) requestAnimationFrame(tick);
      };
      tick();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');

      if (entry.target.classList.contains('stats')) animateCounters();
      if (entry.target.classList.contains('skills-grid')) {
        skillBars.forEach(bar => bar.classList.add('animate'));
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- Formulaire de contact (envoi AJAX vers PHP) ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const result = await response.json();

      if (result.success) {
        feedback.textContent = result.message || 'Message envoyé avec succès !';
        feedback.classList.add('success');
        form.reset();
      } else {
        feedback.textContent = result.message || "Une erreur est survenue, réessayez.";
        feedback.classList.add('error');
      }
    } catch (err) {
      feedback.textContent = "Impossible de contacter le serveur. Réessayez plus tard.";
      feedback.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer le message';
    }
  });

});
