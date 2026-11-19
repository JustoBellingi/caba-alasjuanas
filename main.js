// Navbar: fondo al scrollear y menú mobile
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');

const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
}));

// Aparición suave de secciones
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Galería con lightbox
const items = [...document.querySelectorAll('.gallery__item img')];
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lightbox__img');
let current = 0;

const show = i => {
  current = (i + items.length) % items.length;
  lbImg.src = items[current].src;
  lbImg.alt = items[current].alt;
};
const open = i => { show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); };
const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); };

document.querySelectorAll('.gallery__item').forEach(btn =>
  btn.addEventListener('click', () => open(+btn.dataset.index)));
lb.querySelector('.lightbox__close').addEventListener('click', close);
lb.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
lb.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

document.getElementById('year').textContent = new Date().getFullYear();
