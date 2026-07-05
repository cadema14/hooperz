// =====================
// PRODOTTI
// =====================
const products = [
  {
    id: 1,
    name: 'Drop Shoulder Mesh',
    style: 'oversized',
    price: 34,
    image: 'images/products/jersey1.png',
    colors: [
      { name: 'Nero', hex: '#1a1a1a' },
      { name: 'Bianco', hex: '#f0f0f0' },
      { name: 'Arancio', hex: '#E8521A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true
  },
  {
    id: 2,
    name: 'Reverse Weave Tank',
    style: 'classic',
    price: 28,
    image: 'images/products/jersey2.png',
    colors: [
      { name: 'Navy', hex: '#1B2A4A' },
      { name: 'Grigio', hex: '#888888' },
      { name: 'Rosso', hex: '#C0392B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false
  },
  {
    id: 3,
    name: 'Old School Pinstripe',
    style: 'retro',
    price: 42,
    image: 'images/products/jersey3.png',
    colors: [
      { name: 'Bianco', hex: '#f0f0f0' },
      { name: 'Verde', hex: '#1D6A47' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: false
  },
  {
    id: 4,
    name: 'Clean Number Tee',
    style: 'minimal',
    price: 26,
    image: 'images/products/jersey4.png',
    colors: [
      { name: 'Bianco', hex: '#f0f0f0' },
      { name: 'Nero', hex: '#1a1a1a' },
      { name: 'Sabbia', hex: '#C8B89A' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isNew: true
  },
  {
    id: 5,
    name: 'Hardwood Classic',
    style: 'retro',
    price: 45,
    image: 'images/products/jersey5.png',
    colors: [
      { name: 'Bordeaux', hex: '#7B1827' },
      { name: 'Oro', hex: '#F0B429' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true
  },
  {
    id: 6,
    name: 'Varsity Colorblock',
    style: 'oversized',
    price: 38,
    image: 'images/products/jersey6.png',
    colors: [
      { name: 'Viola', hex: '#4A2682' },
      { name: 'Oro', hex: '#F0B429' },
      { name: 'Nero', hex: '#1a1a1a' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: false
  },
  {
    id: 7,
    name: 'Street Mesh Jersey',
    style: 'classic',
    price: 32,
    image: 'images/products/jersey7.png',
    colors: [
      { name: 'Blu', hex: '#1B5299' },
      { name: 'Bianco', hex: '#f0f0f0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false
  },
  {
    id: 8,
    name: 'Blank Court Vest',
    style: 'minimal',
    price: 24,
    image: 'images/products/jersey8.png',
    colors: [
      { name: 'Grigio', hex: '#AAAAAA' },
      { name: 'Nero', hex: '#1a1a1a' },
      { name: 'Bianco', hex: '#f0f0f0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false
  }
];

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
      <div class="card" data-id="${p.id}">
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
                   onclick="selectColor(${p.id}, ${i})">
              </div>
            `).join('')}
          </div>
          <div class="sizes">
            ${p.sizes.map((s, i) => `
              <button class="size ${i === sel.sizeIdx ? 'active' : ''}"
                      onclick="selectSize(${p.id}, ${i})">
                ${s}
              </button>
            `).join('')}
          </div>
          <div class="card-footer">
            <span class="price">€${p.price}</span>
            <button class="add-to-cart" onclick="addToCart(${p.id})">
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