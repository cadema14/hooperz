const translations = {
  it: {
    nav_products: 'Prodotti',
    nav_about: 'Chi siamo',
    hero_title: 'Stile da campo,',
    hero_title2: 'ogni giorno',
    hero_subtitle: 'Maglie streetwear per chi vive la pallacanestro',
    hero_cta: 'Scopri le maglie',
    filter_all: 'Tutte',
    filter_oversized: 'Oversized',
    filter_classic: 'Classic',
    filter_retro: 'Retro',
    filter_minimal: 'Minimal',
    search_placeholder: 'Cerca una maglia...',
    no_results: 'Nessuna maglia trovata per',
    add_to_cart: '+ Aggiungi',
    cart_title: 'Il tuo carrello',
    cart_empty: 'Il carrello è vuoto',
    cart_checkout: 'Vai al checkout',
    footer_text: 'Maglie streetwear per cestisti. Spedizione in tutta Italia.',
    select_size: 'Seleziona una taglia prima di aggiungere al carrello!',
    new: 'Nuovo'
  },
  en: {
    nav_products: 'Products',
    nav_about: 'About',
    hero_title: 'Court style,',
    hero_title2: 'every day',
    hero_subtitle: 'Streetwear jerseys for basketball lovers',
    hero_cta: 'Shop now',
    filter_all: 'All',
    filter_oversized: 'Oversized',
    filter_classic: 'Classic',
    filter_retro: 'Retro',
    filter_minimal: 'Minimal',
    search_placeholder: 'Search a jersey...',
    no_results: 'No jerseys found for',
    add_to_cart: '+ Add',
    cart_title: 'Your cart',
    cart_empty: 'Your cart is empty',
    cart_checkout: 'Go to checkout',
    footer_text: 'Streetwear jerseys for ballers. Shipping worldwide.',
    select_size: 'Please select a size before adding to cart!',
    new: 'New'
  },
  es: {
    nav_products: 'Productos',
    nav_about: 'Nosotros',
    hero_title: 'Estilo de cancha,',
    hero_title2: 'cada día',
    hero_subtitle: 'Camisetas streetwear para amantes del baloncesto',
    hero_cta: 'Ver camisetas',
    filter_all: 'Todas',
    filter_oversized: 'Oversized',
    filter_classic: 'Clásico',
    filter_retro: 'Retro',
    filter_minimal: 'Minimal',
    search_placeholder: 'Buscar una camiseta...',
    no_results: 'No se encontraron camisetas para',
    add_to_cart: '+ Añadir',
    cart_title: 'Tu carrito',
    cart_empty: 'El carrito está vacío',
    cart_checkout: 'Ir al pago',
    footer_text: 'Camisetas streetwear para jugadores. Envío a todo el mundo.',
    select_size: '¡Selecciona una talla antes de añadir al carrito!',
    new: 'Nuevo'
  },
  fr: {
    nav_products: 'Produits',
    nav_about: 'À propos',
    hero_title: 'Style de terrain,',
    hero_title2: 'chaque jour',
    hero_subtitle: 'Maillots streetwear pour les passionnés de basket',
    hero_cta: 'Voir les maillots',
    filter_all: 'Tous',
    filter_oversized: 'Oversized',
    filter_classic: 'Classique',
    filter_retro: 'Retro',
    filter_minimal: 'Minimal',
    search_placeholder: 'Rechercher un maillot...',
    no_results: 'Aucun maillot trouvé pour',
    add_to_cart: '+ Ajouter',
    cart_title: 'Votre panier',
    cart_empty: 'Le panier est vide',
    cart_checkout: 'Aller au paiement',
    footer_text: 'Maillots streetwear pour les joueurs. Livraison mondiale.',
    select_size: 'Veuillez sélectionner une taille avant d\'ajouter au panier!',
    new: 'Nouveau'
  }
};

let currentLang = localStorage.getItem('hooperz_lang') || 'it';

function t(key) {
  return translations[currentLang][key] || translations['it'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('hooperz_lang', lang);
  updatePageText();
  renderProducts(currentFilter, currentSearch);
}

function updatePageText() {
  // Nav
  const navLinks = document.querySelectorAll('.nav a');
  if (navLinks[0]) navLinks[0].textContent = t('nav_products');
  if (navLinks[1]) navLinks[1].textContent = t('nav_about');

  // Hero
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) heroTitle.innerHTML = `${t('hero_title')}<br><span class="accent">${t('hero_title2')}</span>`;
  const heroSubtitle = document.querySelector('.hero p');
  if (heroSubtitle) heroSubtitle.textContent = t('hero_subtitle');
  const heroCta = document.querySelector('.hero .btn-primary');
  if (heroCta) heroCta.textContent = t('hero_cta');

  // Filtri
  const filters = document.querySelectorAll('.filter');
  const filterKeys = ['filter_all', 'filter_oversized', 'filter_classic', 'filter_retro', 'filter_minimal'];
  filters.forEach((f, i) => { if (filterKeys[i]) f.textContent = t(filterKeys[i]); });

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search_placeholder');

  // Carrello
  const cartTitle = document.querySelector('.cart-header h2');
  if (cartTitle) cartTitle.textContent = t('cart_title');
  const cartCheckout = document.querySelector('.cart-footer .btn-primary');
  if (cartCheckout) cartCheckout.textContent = t('cart_checkout');

  // Footer
  const footerText = document.querySelector('.footer p');
  if (footerText) footerText.textContent = t('footer_text');

  // Lingua attiva
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}