// Data
const DESTINATIONS = [
  { name: 'Турция', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop', basePricePerDay: 5200 },
  { name: 'Египет', image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=800&auto=format&fit=crop', basePricePerDay: 4800 },
  { name: 'Таиланд', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop', basePricePerDay: 6500 },
  { name: 'Греция', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop', basePricePerDay: 6200 },
  { name: 'ОАЭ', image: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=800&auto=format&fit=crop', basePricePerDay: 7200 },
];

// Utils
const formatRub = (num) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(num);

// Populate destinations section
function renderDestinations() {
  const wrap = document.getElementById('destinations');
  if (!wrap) return;
  wrap.innerHTML = DESTINATIONS.map((d) => `
    <article class="card reveal">
      <div class="thumb"><img src="${d.image}" alt="${d.name}"></div>
      <h3>${d.name}</h3>
      <div class="price">от ${formatRub(d.basePricePerDay * 5)}</div>
      <div class="actions">
        <button class="btn btn-sm" data-scroll="#lead" data-destination="${d.name}">Подробнее</button>
      </div>
    </article>
  `).join('');
}

// Populate calculator select
function populateCountrySelect() {
  const select = document.getElementById('country');
  if (!select) return;
  select.innerHTML = DESTINATIONS.map((d) => `<option value="${d.name}">${d.name}</option>`).join('');
}

// Calculator logic
function calcPrice() {
  const country = document.getElementById('country').value;
  const days = Number(document.getElementById('days').value || 0);
  const people = Number(document.getElementById('people').value || 0);
  const dest = DESTINATIONS.find((d) => d.name === country);
  if (!dest || days <= 0 || people <= 0) return '—';
  const flightPerPerson = 18000; // simplified flat estimate
  const hotelPerDay = dest.basePricePerDay;
  const subtotal = hotelPerDay * days * people + flightPerPerson * people;
  const serviceFee = Math.max(0.05 * subtotal, 3000);
  return formatRub(subtotal + serviceFee);
}

function updatePrice() {
  const priceEl = document.getElementById('price');
  if (!priceEl) return;
  priceEl.textContent = calcPrice();
}

// Smooth scroll
function setupSmoothScroll() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-scroll]');
    if (!target) return;
    e.preventDefault();
    const sel = target.getAttribute('data-scroll');
    if (sel === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const dest = target.getAttribute('data-destination');
    if (dest) {
      const destInput = document.querySelector('#lead-form input[name="destination"]');
      if (destInput) destInput.value = dest;
    }
  });
}

// Reveal on scroll
function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// Lead form validation (client-side only demo)
function setupLeadForm() {
  const form = document.getElementById('lead-form');
  const status = document.getElementById('lead-status');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Отправляем заявку…';
    status.style.color = '#475569';
    // Simulate async submit
    await new Promise((r) => setTimeout(r, 900));
    status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    status.style.color = 'green';
    form.reset();
  });
}

// Footer year
function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations();
  populateCountrySelect();
  updatePrice();

  ['country','days','people'].forEach((id)=>{
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePrice);
  });

  setupSmoothScroll();
  setupLeadForm();
  setupReveal();
  setYear();
});

