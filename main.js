// ---- Navbar ----
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
const waFloat = document.querySelector('.wa-float');
// En compu el inicio tiene fondo claro, así que la barra va siempre sólida
const desktop = window.matchMedia('(min-width: 1081px)');

const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 40 || desktop.matches);
  waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
desktop.addEventListener('change', onScroll);

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

// ---- Video: la sección aparece solo si el archivo existe ----
const tour = document.getElementById("recorrido");
const video = document.getElementById("tourVideo");
video.addEventListener("loadedmetadata", () => {
  tour.hidden = false;
  video.parentElement.classList.toggle("is-portrait", video.videoHeight > video.videoWidth);
  io.observe(tour);
});
document.getElementById("tourCover").addEventListener("click", () => {
  video.parentElement.classList.add("is-playing");
  video.play();
});

// ---- Carrusel de la galería (celular) ----
const track = document.querySelector(".gallery__grid");
const dotsBox = document.getElementById("galleryDots");
const slides = [...track.querySelectorAll(".g")];
const dots = slides.map((s, i) => {
  const d = document.createElement("button");
  d.setAttribute("aria-label", "Ver foto " + (i + 1));
  d.addEventListener("click", () => track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: "smooth" }));
  dotsBox.appendChild(d);
  return d;
});
const updateDots = () => {
  const center = track.scrollLeft + track.clientWidth / 2;
  let active = 0, best = Infinity;
  slides.forEach((s, i) => {
    const dist = Math.abs(s.offsetLeft - track.offsetLeft + s.offsetWidth / 2 - center);
    if (dist < best) { best = dist; active = i; }
  });
  dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
};
track.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
updateDots();

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
