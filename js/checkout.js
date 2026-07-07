// =====================
// EMAILJS
// =====================
emailjs.init('JfWyfR68eWerAaDhX');

// =====================
// STRIPE
// =====================
const stripe = Stripe('pk_test_51TqCLmRyCOKqf9lEujC9H4aT4WVVaVhanP60kyRCqGWhXKfO5k66zREKuCxbplXEyLBUngMl6JmfF1xhPPTJSnV400sSO7LJdh');
const elements = stripe.elements();

const cardElement = elements.create('card', {
  style: {
    base: {
      color: '#f0f0f0',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#555' }
    },
    invalid: { color: '#E8521A' }
  }
});
cardElement.mount('#card-element');

cardElement.on('change', e => {
  const el = document.getElementById('card-errors');
  el.textContent = e.error ? e.error.message : '';
});

// =====================
// LEGGI CARRELLO
// =====================
const cart = JSON.parse(localStorage.getItem('hooperz_cart') || '[]');
let shippingCost = 5.90;
let shippingType = 'standard';

function getShippingCost(subtotal, type) {
  if (type === 'express') return 12.90;
  if (subtotal >= 60) return 0;
  return 5.90;
}

function updateTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  shippingCost = getShippingCost(subtotal, shippingType);
  const total = subtotal + shippingCost;

  document.getElementById('subtotal').textContent = '€' + subtotal.toFixed(2);
  document.getElementById('shippingCost').textContent = shippingCost === 0 ? '🎉 Gratuita' : '€' + shippingCost.toFixed(2);
  document.getElementById('total').textContent = '€' + total.toFixed(2);

  const banner = document.getElementById('freeshippingBanner');
  if (subtotal >= 60) {
    banner.textContent = '🎉 Hai la spedizione gratuita!';
    banner.style.color = '#4CAF50';
  } else {
    const diff = (60 - subtotal).toFixed(2);
    banner.textContent = `Aggiungi €${diff} per la spedizione gratuita`;
    banner.style.color = '#888';
  }
}

function renderOrder() {
  const itemsEl = document.getElementById('orderItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="color:#666;font-size:14px">Carrello vuoto — <a href="index.html" style="color:#E8521A">torna al negozio</a></p>';
    return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="order-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-detail">${item.color} · Taglia ${item.size}</div>
      </div>
      <div class="order-item-price">€${item.price}</div>
    </div>
  `).join('');
}

// Cambia tipo spedizione
document.getElementById('shippingOptions').addEventListener('change', e => {
  shippingType = e.target.value;
  updateTotals();
});

// =====================
// PAGAMENTO
// =====================
document.getElementById('payBtn').addEventListener('click', async () => {
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const zip = document.getElementById('zip').value;

  if (!name || !email || !address || !city || !zip) {
    alert('Compila tutti i campi!');
    return;
  }

  const btn = document.getElementById('payBtn');
  btn.textContent = 'Elaborazione...';
  btn.disabled = true;

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: { name, email }
  });

  if (error) {
    document.getElementById('card-errors').textContent = error.message;
    btn.textContent = 'Paga ora';
    btn.disabled = false;
    return;
  }

  // Calcola totale
  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const total = subtotal + shippingCost;
  const orderNumber = '#HZ' + Math.floor(Math.random() * 90000 + 10000);
  const orderItems = cart.map(i => `${i.name} (${i.color}, ${i.size})`).join(', ');

  // Invia email con EmailJS
  try {
    await emailjs.send('service_3wkvkzj' , 'template_gmbmcxe', {
      to_name: name,
      to_email: email,
      order_number: orderNumber,
      order_items: orderItems,
      shipping_type: shippingType === 'express' ? 'Express (1-2 giorni)' : 'Standard (5-7 giorni)',
      order_total: '€' + total.toFixed(2)
    });
  } catch(e) {
    console.log('Errore email:', e);
  }

  // Salva ordine e vai alla conferma
  localStorage.setItem('hooperz_last_order', JSON.stringify({
    email: email,
    total: total,
    shippingType: shippingType,
    cart: cart,
    orderNumber: orderNumber
  }));
  localStorage.removeItem('hooperz_cart');
  window.location.href = 'confirmation.html';
});

renderOrder();
updateTotals();