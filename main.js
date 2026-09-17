// ===== CURSOR =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, 80);
});
document.querySelectorAll('a, button, .service-card, .review-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; follower.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

// ===== NAV SCROLL =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.close-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ===== THREE.JS BACKGROUND =====
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particles
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color1 = new THREE.Color(0x00b4d8);
  const color2 = new THREE.Color(0x0077b6);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const c = Math.random() > 0.5 ? color1 : color2;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // DNA/Spine helix lines
  const helixGroup = new THREE.Group();
  scene.add(helixGroup);
  const helixMat1 = new THREE.LineBasicMaterial({ color: 0x00b4d8, transparent: true, opacity: 0.25 });
  const helixMat2 = new THREE.LineBasicMaterial({ color: 0x90e0ef, transparent: true, opacity: 0.2 });

  function makeHelix(mat, offset) {
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 8;
      pts.push(new THREE.Vector3(Math.cos(t + offset) * 6, (i / 200) * 60 - 30, Math.sin(t + offset) * 6));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(g, mat);
  }

  helixGroup.add(makeHelix(helixMat1, 0));
  helixGroup.add(makeHelix(helixMat2, Math.PI));
  helixGroup.position.set(-18, 0, -10);

  // Spine vertebrae spheres
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00b4d8, transparent: true, opacity: 0.35, wireframe: true });
  for (let i = 0; i < 10; i++) {
    const sg = new THREE.SphereGeometry(0.6, 8, 8);
    const sm = new THREE.Mesh(sg, sphereMat);
    sm.position.set(-18 + Math.sin(i * 0.8) * 6, -22 + i * 5, -10);
    scene.add(sm);
  }

  // Ambient floating torus rings
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x0077b6, transparent: true, opacity: 0.12, wireframe: true });
  const rings = [];
  for (let i = 0; i < 5; i++) {
    const tg = new THREE.TorusGeometry(4 + i, 0.3, 8, 40);
    const tm = new THREE.Mesh(tg, ringMat);
    tm.position.set(20 + i * 3, -10 + i * 6, -20 + i * 2);
    tm.rotation.x = Math.random() * Math.PI;
    scene.add(tm);
    rings.push(tm);
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;
    helixGroup.rotation.y = t * 0.15;
    rings.forEach((r, i) => { r.rotation.x += 0.003 + i * 0.001; r.rotation.z += 0.002; });
    camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();

// ===== GSAP ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Hero
gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, delay: 0.3 });
gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, delay: 0.5 });
gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 0.8, delay: 0.7 });
gsap.from('.hero-stars', { opacity: 0, y: 20, duration: 0.6, delay: 0.9 });
gsap.from('.hero-btns', { opacity: 0, y: 20, duration: 0.6, delay: 1.1 });
gsap.from('.scroll-indicator', { opacity: 0, duration: 0.6, delay: 1.5 });

// Stats
gsap.from('.stat-card', {
  scrollTrigger: { trigger: '#stats', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, y: 30, stagger: 0.12, duration: 0.7
});

// Counters
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el, start: 'top 95%', once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target, duration: 2, ease: 'power2.out',
        onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + (el.dataset.suffix || ''); }
      });
    }
  });
});

// About
gsap.from('.about-content .fade-up', {
  scrollTrigger: { trigger: '#about', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, y: 30, stagger: 0.15, duration: 0.7
});
gsap.from('.about-card-3d', {
  scrollTrigger: { trigger: '#about', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, x: 40, duration: 0.9, ease: 'power3.out'
});

// Services
gsap.from('.service-card', {
  scrollTrigger: { trigger: '#services', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, y: 40, stagger: 0.1, duration: 0.7
});

// Reviews
gsap.from('.review-card', {
  scrollTrigger: { trigger: '#reviews', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, scale: 0.95, stagger: 0.08, duration: 0.6
});

// Contact
gsap.from('.contact-item', {
  scrollTrigger: { trigger: '#contact', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, x: -20, stagger: 0.12, duration: 0.7
});
gsap.from('.contact-form .form-group', {
  scrollTrigger: { trigger: '#contact', start: 'top 95%' },
  immediateRender: false,
  opacity: 0, x: 20, stagger: 0.08, duration: 0.6
});

// ===== FORM SUBMIT =====
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#00c853';
  setTimeout(() => { btn.textContent = 'Book Appointment'; btn.style.background = ''; this.reset(); }, 3000);
});
