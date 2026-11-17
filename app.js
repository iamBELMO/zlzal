const cards = [...document.querySelectorAll('.card')];
const search = document.querySelector('#q');
const sort = document.querySelector('#sort');
const filters = [...document.querySelectorAll('[data-filter]')];
const all = filters[0].dataset.filter;
const grid = document.querySelector('.cards');
const alphabet = new Intl.Collator('ar');
let category = all;
function normalize(text) {
  return text.trim().toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
}
function renderCatalog() {
  const terms = normalize(search.value).split(/\s+/).filter(Boolean);
  const ordered = [...cards];
  if (sort.value === 'name') {
    ordered.sort((left, right) => alphabet.compare(left.querySelector('h2').textContent, right.querySelector('h2').textContent));
  }
  let visibleCount = 0;
  for (const card of ordered) {
    const text = normalize([card.dataset.keywords, card.dataset.category, card.querySelector('h2').textContent, card.querySelector('p').textContent].join(' '));
    card.hidden = (category !== all && category !== card.dataset.category) || !terms.every(term => text.includes(term));
    if (!card.hidden) visibleCount++;
    grid.append(card);
  }
  for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  document.querySelector('#empty').hidden = visibleCount !== 0;
  document.querySelector('#results').textContent = 'عدد الخدمات المطابقة ' + visibleCount.toLocaleString('ar');
}
for (const button of filters) {
  button.addEventListener('click', () => { category = button.dataset.filter; renderCatalog(); });
}
search.addEventListener('input', renderCatalog);
sort.addEventListener('change', renderCatalog);
document.querySelector('#reset').addEventListener('click', () => {
  search.value = '';
  category = all;
  renderCatalog();
  search.focus();
});
const dialog = document.querySelector('dialog');
const heading = document.querySelector('#order-heading');
const platform = document.querySelector('#platform');
const note = document.querySelector('#note');
const next = document.querySelector('#send-order');
function updateOrder() {
  const lines = ['مرحباً زلزال، أود طلب خدمة ' + heading.textContent, 'المنصة: ' + platform.value];
  if (note.value.trim()) lines.push('تفاصيل الطلب: ' + note.value.trim());
  next.href = 'https://wa.me/972597969542?text=' + encodeURIComponent(lines.join('\n'));
}
for (const link of document.querySelectorAll('.order')) {
  link.addEventListener('click', event => {
    if (!dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.querySelector('#order-form').reset();
    heading.textContent = link.dataset.title;
    updateOrder();
    dialog.showModal();
  });
}
platform.addEventListener('change', updateOrder);
note.addEventListener('input', updateOrder);
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
