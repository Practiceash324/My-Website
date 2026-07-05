// ================= 3D Hero Visual =================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('hero-canvas');
let scene, camera, renderer, shapes = [];
let mouseX = 0, mouseY = 0;

function initThree(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0xff4d8d, 2.2, 30);
  point1.position.set(4, 3, 6);
  scene.add(point1);
  const point2 = new THREE.PointLight(0x4dd8ff, 2.2, 30);
  point2.position.set(-4, -2, 4);
  scene.add(point2);

  const geometries = [
    new THREE.IcosahedronGeometry(1.1, 0),
    new THREE.TorusGeometry(0.8, 0.28, 16, 60),
    new THREE.SphereGeometry(0.7, 24, 24),
    new THREE.OctahedronGeometry(0.9, 0)
  ];
  const colors = [0xff4d8d, 0xffd23f, 0x4dd8ff, 0xb892ff];
  const positions = [
    [2.4, 1.4, 0], [-2.6, -0.6, -1], [1.8, -1.8, -0.5], [-1.6, 1.9, 0.5]
  ];

  geometries.forEach((geo, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i], roughness: 0.35, metalness: 0.15,
      wireframe: i % 2 === 0
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...positions[i]);
    scene.add(mesh);
    shapes.push(mesh);
  });

  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  animate();
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e){
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function animate(){
  requestAnimationFrame(animate);
  const t = Date.now() * 0.0004;
  shapes.forEach((mesh, i) => {
    mesh.rotation.x = t * (0.4 + i * 0.1);
    mesh.rotation.y = t * (0.3 + i * 0.08);
  });
  camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

if (!prefersReduced && window.WebGLRenderingContext) {
  try { initThree(); } catch(e) { console.warn('3D hero skipped:', e); }
}

// ================= Scroll-triggered reveals =================
gsap.registerPlugin(ScrollTrigger);

if (prefersReduced) {
  gsap.set('.reveal', { opacity: 1, y: 0 });
} else {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Parallax drift on background blobs while scrolling
  gsap.to('.bg-blob.one', { y: 120, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  gsap.to('.bg-blob.two', { y: -160, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  gsap.to('.bg-blob.three', { y: 100, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 } });
}
