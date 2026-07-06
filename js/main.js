// =====================
// STATO
// =====================
let selected = {};
let cart = [];

products.forEach(p => {
  selected[p.id] = { colorIdx: 0, sizeIdx: -1 };
});

// =====================
// RENDER PRODOTTI
// =====================
function renderProducts(filter) {
  const grid = document.getElementById('grid');
  const list = filter === 'all'
    ? products
    : products.filter(p => p.style === filter);

  grid.innerHTML = list.map(p => {
    const sel = selected[p.id];
    return `
      <div class="card" data-id="${p.id}" onclick="window.location.href='product.html?id=${p.id}'">
        <div class="card-img">
          <img src="${p.image}" alt="${p.name}" onerror="this.src=''">
        </div>
        <div class="card-body">
          <div class="card-tag">${p.style}${p.isNew ? ' · <span style="color:#E8521A">Nuovo</span>' : ''}</div>
          <div class="card-name">${p.name}</div>
          <div class="swatches">
            ${p.colors.map((c, i) => `
              <div class="swatch ${i === sel.colorIdx ? 'active' : ''}"
                   style="background:${c.hex}"
                   title="${c.name}"
                   onclick="event.stopPropagation(); selectColor(${p.id}, ${i})">
              </div>
            `).join('')}
          </div>
          <div class="sizes">
            ${p.sizes.map((s, i) => `
              <button class="size ${i === sel.sizeIdx ? 'active' : ''}"
                      onclick="event.stopPropagation(); selectSize(${p.id}, ${i})">
                ${s}
              </button>
            `).join('')}
          </div>
          <div class="card-footer">
            <span class="price">€${p.price}</span>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
              + Aggiungi
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =====================
// SELEZIONE COLORE / TAGLIA
// =====================
function selectColor(id, idx) {
  selected[id].colorIdx = idx;
  renderProducts(currentFilter);
}

function selectSize(id, idx) {
  selected[id].sizeIdx = idx;
  renderProducts(currentFilter);
}

// =====================
// CARRELLO
// =====================
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const sel = selected[id];

  if (sel.sizeIdx === -1) {
    alert('Seleziona una taglia prima di aggiungere al carrello!');
    return;
  }

  cart.push({
    id,
    name: p.name,
    color: p.colors[sel.colorIdx].name,
    size: p.sizes[sel.sizeIdx],
    price: p.price,
    image: p.image
  });

  updateCartUI();
  openCart();
}

function updateCartUI() {
  const count = document.getElementById('cartCount');
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const total = document.getElementById('cartTotal');

  count.textContent = cart.length;

  if (cart.length === 0) {
    items.innerHTML = '<p class="cart-empty">Il carrello è vuoto</p>';
    footer.style.display = 'none';
    return;
  }

  items.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.style.background='#333'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-detail">${item.color} · Taglia ${item.size}</div>
      </div>
      <div class="cart-item-price">€${item.price}</div>
    </div>
  `).join('');

  const sum = cart.reduce((s, i) => s + i.price, 0);
  total.textContent = '€' + sum;
  footer.style.display = 'block';
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// =====================
// CHECKOUT
// =====================
function goToCheckout() {
  localStorage.setItem('hooperz_cart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

// =====================
// FILTRI
// =====================
let currentFilter = 'all';

document.getElementById('filters').addEventListener('click', e => {
  if (!e.target.matches('.filter')) return;
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.filter;
  renderProducts(currentFilter);
});

// =====================
// EVENTI CARRELLO
// =====================
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

// =====================
// AVVIO
// =====================
renderProducts('all');