let selectedColor = 0;
let selectedSize = -1;
let cart = [];
let currentProduct = null;

// Leggi l'ID del prodotto dall'URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));
currentProduct = products.find(p => p.id === productId);

if (!currentProduct) {
  window.location.href = 'index.html';
}

// Popola la pagina
document.title = `Hooperz — ${currentProduct.name}`;
document.getElementById('mainImg').src = currentProduct.image;
document.getElementById('mainImg').alt = currentProduct.name;
document.getElementById('productTag').textContent = currentProduct.style;
document.getElementById('productName').textContent = currentProduct.name;
document.getElementById('productPrice').textContent = `€${currentProduct.price}`;
document.getElementById('productDesc').textContent = currentProduct.desc;

// Colori
function renderColors() {
  const swatches = document.getElementById('swatches');
  const label = document.getElementById('colorLabel');
  label.textContent = currentProduct.colors[selectedColor].name;
  swatches.innerHTML = currentProduct.colors.map((c, i) => `
    <div class="swatch ${i === selectedColor ? 'active' : ''}"
         style="background:${c.hex}"
         title="${c.name}"
         onclick="selectColor(${i})">
    </div>
  `).join('');
}

function selectColor(idx) {
  selectedColor = idx;
  renderColors();
}

// Taglie
function renderSizes() {
  const sizesEl = document.getElementById('sizes');
  sizesEl.innerHTML = currentProduct.sizes.map((s, i) => `
    <button class="size ${i === selectedSize ? 'active' : ''}"
            onclick="selectSize(${i})">
      ${s}
    </button>
  `).join('');
}

function selectSize(idx) {
  selectedSize = idx;
  renderSizes();
}

// Aggiungi al carrello
document.getElementById('addToCartBtn').addEventListener('click', () => {
  if (selectedSize === -1) {
    alert('Seleziona una taglia!');
    return;
  }
  cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    color: currentProduct.colors[selectedColor].name,
    size: currentProduct.sizes[selectedSize],
    price: currentProduct.price,
    image: currentProduct.image
  });
  updateCartUI();
  openCart();
});

// Carrello
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
  items.innerHTML = cart.map(item => `
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

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

renderColors();
renderSizes();