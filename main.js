const WHATSAPP = '5492235537354';

// ---- Navbar ----
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
const waFloat = document.querySelector('.wa-float');

const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const setMenu = open => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Link activo según la sección visible
const links = [...menu.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---- Aparición suave ----
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Consulta de disponibilidad por WhatsApp ----
const form = document.getElementById('reservar');
const llegada = document.getElementById('llegada');
const salida = document.getElementById('salida');
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = new Date();
llegada.min = iso(today);
salida.min = iso(new Date(today.getTime() + 864e5));

llegada.addEventListener('change', () => {
  if (!llegada.value) return;
  const next = new Date(llegada.value + 'T12:00');
  next.setDate(next.getDate() + 1);
  salida.min = iso(next);
  if (!salida.value || salida.value <= llegada.value) salida.value = iso(next);
});

const fmt = v => v.split('-').reverse().join('/');
form.addEventListener('submit', e => {
  e.preventDefault();
  const n = document.getElementById('huespedes').value;
  const personas = n === '6+' ? 'más de 5 personas' : `${n} ${n === '1' ? 'persona' : 'personas'}`;
  const msg = `¡Hola! Quisiera consultar disponibilidad en Cabañas Las Juanas del ${fmt(llegada.value)} al ${fmt(salida.value)} para ${personas}.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// ---- Video: la sección aparece solo si el archivo existe ----
const tour = document.getElementById('recorrido');
const video = document.getElementById('tourVideo');
const play = document.getElementById('tourPlay');
video.addEventListener('loadedmetadata', () => {
  tour.hidden = false;
  video.parentElement.classList.toggle('is-portrait', video.videoHeight > video.videoWidth);
  io.observe(tour);
});
play.addEventListener('click', () => {
  video.controls = true;
  video.play();
  tour.classList.add('is-playing');
});
video.addEventListener('ended', () => tour.classList.remove('is-playing'));

// ---- Galería con lightbox ----
const imgs = [...document.querySelectorAll('.gallery__grid img')];
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lightbox__img');
const lbCap = lb.querySelector('.lightbox__caption');
let current = 0;

const show = i => {
  current = (i + imgs.length) % imgs.length;
  lbImg.src = imgs[current].src;
  lbImg.alt = imgs[current].alt;
  lbCap.textContent = `${current + 1} / ${imgs.length} · ${imgs[current].alt}`;
};
const openLb = i => { show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

document.querySelectorAll('.g').forEach(btn => btn.addEventListener('click', () => openLb(+btn.dataset.index)));
lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
lb.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
lb.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLb(); setMenu(false); }
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Deslizar en celular
let startX = 0;
lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
});

document.getElementById('year').textContent = new Date().getFullYear();
