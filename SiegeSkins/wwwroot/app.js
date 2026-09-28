const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.skin-card')];
const search = document.querySelector('#searchInput');
const count = document.querySelector('#resultCount');
const empty = document.querySelector('#emptyState');
const loadoutCount = document.querySelector('#loadoutCount');
const toast = document.querySelector('#toast');
let currentFilter = 'all';
let selected = new Set();

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchesType = currentFilter === 'all' || card.dataset.rarity === currentFilter;
    const matchesQuery = card.dataset.name.includes(query);
    card.hidden = !(matchesType && matchesQuery);
    if (!card.hidden) visible++;
  });
  count.textContent = visible;
  empty.hidden = visible !== 0;
}

filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  currentFilter = button.dataset.filter;
  applyFilters();
}));

search.addEventListener('input', applyFilters);

document.querySelectorAll('.add').forEach((button, index) => button.addEventListener('click', () => {
  if (selected.has(index)) {
    selected.delete(index);
    button.classList.remove('added');
    button.textContent = '+';
    toast.textContent = 'УДАЛЕНО ИЗ НАБОРА';
  } else {
    selected.add(index);
    button.classList.add('added');
    button.textContent = '✓';
    toast.textContent = 'ДОБАВЛЕНО В НАБОР';
  }
  loadoutCount.textContent = selected.size;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}));

document.querySelector('#loadoutBtn').addEventListener('click', () => {
  toast.textContent = selected.size ? `В НАБОРЕ: ${selected.size}` : 'НАБОР ПОКА ПУСТ';
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
});
