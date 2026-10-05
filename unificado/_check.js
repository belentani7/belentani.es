(function(){

  'use strict';

  // ============================================================
  // LOADER
  // ============================================================
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  let loadProgress = 0;

  function simulateLoading() {
    const interval = setInterval(() => {
      loadProgress += Math.random() * 15 + 5;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          initHeroAnimations();
        }, 500);
      }
      loaderBar.style.width = loadProgress + '%';
      loaderPercent.textContent = Math.floor(loadProgress) + '%';
    }, 200);
  }

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX - 4 + 'px';
    cursorDot.style.top = mouseY - 4 + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX - 20 + 'px';
    cursorRing.style.top = ringY - 20 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, .glass-card, .hero-cta, .asset-thumb').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // Glass card mouse tracking
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ============================================================
  // THREE.JS — GALAXY UNIVERSE
  // ============================================================
  const canvas = document.getElementById('universe-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050005, 0.0008);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 100);

  // --- GALAXY PARTICLES ---
  const galaxyGeometry = new THREE.BufferGeometry();
  const galaxyCount = 25000;
  const positions = new Float32Array(galaxyCount * 3);
  const colors = new Float32Array(galaxyCount * 3);
  const sizes = new Float32Array(galaxyCount);

  const colorInner = new THREE.Color(0xff0033);
  const colorOuter = new THREE.Color(0x1a0008);
  const colorAccent = new THREE.Color(0xff2d6b);

  for (let i = 0; i < galaxyCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 300 + 10;
    const spinAngle = radius * 0.008;
    const branchAngle = ((i % 5) / 5) * Math.PI * 2;
    
    const randomX = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 80;
    const randomY = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 40;
    const randomZ = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 80;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInner.clone().lerp(colorOuter, radius / 300);
    if (Math.random() > 0.95) mixedColor.lerp(colorAccent, 0.8);
    
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    sizes[i] = Math.random() * 3 + 0.5;
  }

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const galaxyMaterial = new THREE.PointsMaterial({
    size: 1.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);

  // --- NEBULA CLOUDS ---
  const nebulaGeometry = new THREE.BufferGeometry();
  const nebulaCount = 3000;
  const nebulaPositions = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);

  for (let i = 0; i < nebulaCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 150 + Math.random() * 200;
    
    nebulaPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
    nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 100;
    nebulaPositions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const c = new THREE.Color().setHSL(0.97 + Math.random() * 0.03, 1, 0.15 + Math.random() * 0.1);
    nebulaColors[i3] = c.r;
    nebulaColors[i3 + 1] = c.g;
    nebulaColors[i3 + 2] = c.b;
  }

  nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
  scene.add(nebula);

  // --- ORBITING PLANETS ---
  const planets = [];
  const planetData = [
    { radius: 5, distance: 60, speed: 0.003, color: 0xff0033, emissive: 0x880011 },
    { radius: 3, distance: 90, speed: 0.002, color: 0xff2d6b, emissive: 0x660022 },
    { radius: 7, distance: 130, speed: 0.001, color: 0xcc0029, emissive: 0x440011 },
    { radius: 2, distance: 45, speed: 0.005, color: 0xff4466, emissive: 0xaa0033 }
  ];

  planetData.forEach(data => {
    const geo = new THREE.SphereGeometry(data.radius, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.emissive,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7
    });
    const mesh = new THREE.Mesh(geo, mat);
    
    // Glow
    const glowGeo = new THREE.SphereGeometry(data.radius * 1.4, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);

    scene.add(mesh);
    planets.push({ mesh, ...data, angle: Math.random() * Math.PI * 2 });
  });

  // --- LIGHTS ---
  const ambientLight = new THREE.AmbientLight(0x1a0008, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xff0033, 2, 500);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xff2d6b, 1, 300);
  pointLight2.position.set(50, 30, -50);
  scene.add(pointLight2);

  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();
  let scrollY = 0;

  window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Rotate galaxy
    galaxy.rotation.y = elapsed * 0.02;
    nebula.rotation.y = -elapsed * 0.01;

    // Orbit planets
    planets.forEach(p => {
      p.angle += p.speed;
      p.mesh.position.x = Math.cos(p.angle) * p.distance;
      p.mesh.position.z = Math.sin(p.angle) * p.distance;
      p.mesh.position.y = Math.sin(elapsed * 0.5 + p.angle) * 10;
      p.mesh.rotation.y += 0.01;
    });

    // Camera parallax with scroll
    camera.position.y = -scrollY * 0.05;
    camera.position.x = Math.sin(elapsed * 0.1) * 5;
    camera.lookAt(0, -scrollY * 0.05, 0);

    // Pulse center light
    pointLight.intensity = 2 + Math.sin(elapsed * 2) * 0.5;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ============================================================
  // GSAP ANIMATIONS
  // ============================================================
  gsap.registerPlugin(ScrollTrigger);

  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-overline', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
      .to('.hero-title', { opacity: 1, y: 0, duration: 1.2 }, 0.4)
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, 0.7)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 1)
      .to('.scroll-indicator', { opacity: 1, duration: 1 }, 1.3);
  }

  // Nav scroll effect
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      document.getElementById('mainNav').classList.toggle('scrolled', self.progress > 0);
    }
  });

  // Lore blocks reveal
  gsap.utils.toArray('.lore-block').forEach(block => {
    gsap.to(block, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: block,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Section reveals
  gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section.querySelectorAll('.section-label, .section-title, .section-desc'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%'
      }
    });
  });

  // Planet cards stagger
  gsap.utils.toArray('.planet-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%'
      }
    });
  });

  // ============================================================
  // START
  // ============================================================
  simulateLoading();


})();
