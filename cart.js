// cart.js — carrinho compartilhado por todas as páginas
// Os itens ficam salvos no localStorage do navegador

const CART_KEY   = 'grao-alma-cart';
const CART_LIMIT = 10;
let isCartOpen = false;

function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function cartGetAll() {
  const saved = localStorage.getItem(CART_KEY);
  if (saved === null) return [];
  return JSON.parse(saved);
}

function cartSave(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCountItems() {
  const cart = cartGetAll();
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].qty;
  }
  return total;
}

function cartGetTotal() {
  const cart = cartGetAll();
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + (cart[i].price * cart[i].qty);
  }
  return total;
}

function cartAdd(item, quantity) {
  const cart       = cartGetAll();
  const currentQty = cartCountItems();

  if (currentQty >= CART_LIMIT) return 0;

  const availableSlots = CART_LIMIT - currentQty;
  let actualQuantity = quantity;
  if (actualQuantity > availableSlots) actualQuantity = availableSlots;

  // verifica se o produto já está no carrinho
  let existingItem = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === item.id) {
      existingItem = cart[i];
      break;
    }
  }

  if (existingItem !== null) {
    existingItem.qty = existingItem.qty + actualQuantity;
  } else {
    cart.push({
      id:       item.id,
      emoji:    item.emoji,
      name:     item.name,
      price:    item.price,
      delivery: item.delivery,
      qty:      actualQuantity
    });
  }

  cartSave(cart);
  return actualQuantity;
}

function cartChangeQty(id, delta) {
  const cart = cartGetAll();
  let foundItem = null;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      foundItem = cart[i];
      break;
    }
  }

  if (foundItem === null) return;

  if (delta === 1 && cartCountItems() >= CART_LIMIT) {
    showToast('🚫 Limite de ' + CART_LIMIT + ' itens atingido!');
    return;
  }

  foundItem.qty = foundItem.qty + delta;

  if (foundItem.qty <= 0) {
    cartRemove(id);
    return;
  }

  cartSave(cart);
  updateCartUI();
}

function cartRemove(id) {
  const cart        = cartGetAll();
  const updatedCart = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) updatedCart.push(cart[i]);
  }

  cartSave(updatedCart);
  updateCartUI();
}

function cartClear() {
  localStorage.removeItem(CART_KEY);
}

// retorna nomes dos itens que não podem ser entregues
function getLocalOnlyItemNames() {
  const cart        = cartGetAll();
  const localOnly = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].delivery === false) {
      localOnly.push(cart[i].name);
    }
  }

  return localOnly;
}

function buildCartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)} cada</span>
        ${item.delivery === false ? '<div class="cart-item-local-badge">📍 Só local</div>' : ''}
      </div>
      <div class="cart-item-qty">
        <button class="cqty-btn" data-caction="dec" data-id="${item.id}">−</button>
        <span class="cqty-val">${item.qty}</span>
        <button class="cqty-btn" data-caction="inc" data-id="${item.id}">+</button>
      </div>
      <button class="cart-item-remove" data-caction="remove" data-id="${item.id}" title="Remover">✕</button>
    </div>
  `;
}

function updateCartUI() {
  const cart         = cartGetAll();
  const totalQty     = cartCountItems();
  const totalPrice   = cartGetTotal();
  let   fillPercent  = (totalQty / CART_LIMIT) * 100;
  if (fillPercent > 100) fillPercent = 100;

  let itemsHTML = '';
  if (cart.length === 0) {
    itemsHTML = '<div class="cart-empty"><span>🛒</span>Nenhum item ainda</div>';
  } else {
    for (let i = 0; i < cart.length; i++) {
      itemsHTML += buildCartItemHTML(cart[i]);
    }
  }

  let limitText = 'Máximo de ' + CART_LIMIT + ' itens por pedido';
  if (totalQty >= CART_LIMIT) limitText = '⚠️ Limite de ' + CART_LIMIT + ' itens atingido';

  const countEl = document.getElementById('cart-count');
  if (countEl !== null) {
    countEl.textContent = totalQty;
    if (totalQty > 0) { countEl.classList.add('visible'); }
    else              { countEl.classList.remove('visible'); }
  }

  const itemsListEl = document.getElementById('cart-items-list');
  if (itemsListEl !== null) itemsListEl.innerHTML = itemsHTML;

  const totalEl = document.getElementById('cart-total-display');
  if (totalEl !== null) totalEl.textContent = formatPrice(totalPrice);

  const badgeEl = document.getElementById('cart-limit-badge');
  if (badgeEl !== null) badgeEl.textContent = totalQty + ' / ' + CART_LIMIT;

  const limitTextEl = document.getElementById('cart-limit-text');
  if (limitTextEl !== null) limitTextEl.textContent = limitText;

  const fillBarEl = document.getElementById('cart-fill-bar');
  if (fillBarEl !== null) {
    fillBarEl.style.width = fillPercent + '%';
    if (totalQty >= CART_LIMIT) { fillBarEl.classList.add('full'); }
    else                        { fillBarEl.classList.remove('full'); }
  }

  const checkoutButton = document.getElementById('btn-finalizar');
  if (checkoutButton !== null) checkoutButton.disabled = (totalQty === 0);
}

function toggleCart() {
  isCartOpen = !isCartOpen;

  const dropdown = document.getElementById('cart-dropdown');
  const overlay  = document.getElementById('cart-overlay');

  if (isCartOpen) {
    if (dropdown !== null) dropdown.classList.add('open');
    if (overlay  !== null) overlay.classList.add('active');
  } else {
    if (dropdown !== null) dropdown.classList.remove('open');
    if (overlay  !== null) overlay.classList.remove('active');
  }
}

function closeCart() {
  isCartOpen = false;
  const dropdown = document.getElementById('cart-dropdown');
  const overlay  = document.getElementById('cart-overlay');
  if (dropdown !== null) dropdown.classList.remove('open');
  if (overlay  !== null) overlay.classList.remove('active');
}

function setupCartEvents() {
  const itemsListEl = document.getElementById('cart-items-list');
  if (itemsListEl === null) return;

  itemsListEl.addEventListener('click', function (event) {
    const button = event.target;
    if (button.tagName !== 'BUTTON' || button.dataset.caction === undefined) return;

    const action = button.dataset.caction;
    const id     = parseInt(button.dataset.id);

    if (action === 'remove')   { cartRemove(id); }
    else if (action === 'dec') { cartChangeQty(id, -1); }
    else if (action === 'inc') { cartChangeQty(id, +1); }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast === null) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 2200);
}

function setupHamburger() {
  const hamburgerButton = document.getElementById('hamburger');
  const mobileMenu      = document.getElementById('mobile-nav');
  if (hamburgerButton === null || mobileMenu === null) return;

  hamburgerButton.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburgerButton.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      hamburgerButton.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  const navLinks = mobileMenu.querySelectorAll('a');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburgerButton.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

function setupNavbarScroll() {
  const header = document.getElementById('header-page');
  if (header === null) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) { header.classList.add('scrolled'); }
    else                     { header.classList.remove('scrolled'); }
  });
}

function setupCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (canvas === null) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let bubbles   = [];
  let particles = [];

  const colors = [
    'rgba(92,64,32,',
    'rgba(196,136,58,',
    'rgba(61,44,20,',
    'rgba(232,185,106,',
    'rgba(26,18,8,',
    'rgba(120,80,35,'
  ];

  function resizeCanvas() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createBubbles() {
    bubbles = [];

    // bolhas grandes — lentas, bem visíveis
    for (let i = 0; i < 8; i++) {
      bubbles.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        radius: Math.random() * 180 + 120,
        dx:    (Math.random() - 0.5) * 0.18,
        dy:    (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.1 + 0.04,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // bolhas médias
    for (let i = 0; i < 10; i++) {
      bubbles.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        radius: Math.random() * 80 + 40,
        dx:    (Math.random() - 0.5) * 0.35,
        dy:    (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.08 + 0.02,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // bolhas pequenas — rápidas
    for (let i = 0; i < 10; i++) {
      bubbles.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        radius: Math.random() * 35 + 12,
        dx:    (Math.random() - 0.5) * 0.55,
        dy:    (Math.random() - 0.5) * 0.55,
        alpha: Math.random() * 0.06 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x:     Math.random() * width,
        y:     Math.random() * height,
        size:  Math.random() * 2 + 0.3,
        alpha: Math.random() * 0.15 + 0.03,
        dy:    -(Math.random() * 0.45 + 0.06),
        dx:    (Math.random() - 0.5) * 0.2
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.radius)         b.x = width + b.radius;
      if (b.x > width + b.radius)  b.x = -b.radius;
      if (b.y < -b.radius)         b.y = height + b.radius;
      if (b.y > height + b.radius) b.y = -b.radius;

      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      gradient.addColorStop(0, b.color + b.alpha + ')');
      gradient.addColorStop(1, b.color + '0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x    += p.dx;
      p.y    += p.dy;
      p.alpha -= 0.0003;

      if (p.y < -10 || p.alpha <= 0) {
        p.x     = Math.random() * width;
        p.y     = width;
        p.alpha = Math.random() * 0.15 + 0.03;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,136,58,' + p.alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  createBubbles();
  createParticles();
  animate();

  window.addEventListener('resize', function () {
    resizeCanvas();
    createBubbles();
    createParticles();
  });
}

function initGlobal() {
  setupCanvas();
  setupNavbarScroll();
  setupHamburger();
  setupCartEvents();
  updateCartUI();

  const cartButton = document.getElementById('cart-btn');
  if (cartButton !== null) {
    cartButton.addEventListener('click', toggleCart);
  }

  const overlay = document.getElementById('cart-overlay');
  if (overlay !== null) {
    overlay.addEventListener('click', closeCart);
  }

  const checkoutButton = document.getElementById('btn-finalizar');
  if (checkoutButton !== null) {
    checkoutButton.addEventListener('click', function () {
      if (cartGetAll().length === 0) return;
      closeCart();
      const isInSubfolder = window.location.pathname.includes('/pages/');
      if (isInSubfolder) { window.location.href = '../checkout/index.html'; }
      else               { window.location.href = 'pages/checkout/index.html'; }
    });
  }
}

document.addEventListener('DOMContentLoaded', initGlobal);