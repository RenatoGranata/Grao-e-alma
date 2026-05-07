// checkout/index.js — cuida da página de finalizar pedido

function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function renderCheckout() {
  const cart = cartGetAll();

  if (cart.length === 0) {
    document.getElementById('empty-warning').style.display    = 'flex';
    document.getElementById('checkout-content').style.display = 'none';
    return;
  }

  let itemsHTML  = '';
  let orderTotal = 0;

  for (let i = 0; i < cart.length; i++) {
    const item         = cart[i];
    const itemSubtotal = item.price * item.qty;
    orderTotal         = orderTotal + itemSubtotal;

    itemsHTML += '<div class="order-item-row">';
    itemsHTML += '<span class="oi-emoji">' + item.emoji + '</span>';
    itemsHTML += '<div class="oi-info">';
    itemsHTML += '<div class="oi-name">' + item.name + '</div>';
    itemsHTML += '<div class="oi-qty">' + item.qty + 'x · ' + formatPrice(item.price) + '</div>';
    if (item.delivery === false) {
      itemsHTML += '<div class="oi-local-warn">📍 Somente local</div>';
    }
    itemsHTML += '</div>';
    itemsHTML += '<span class="oi-price">' + formatPrice(itemSubtotal) + '</span>';
    itemsHTML += '</div>';
  }

  document.getElementById('checkout-items-list').innerHTML = itemsHTML;
  document.getElementById('co-subtotal').textContent       = formatPrice(orderTotal);
  document.getElementById('co-total').textContent          = formatPrice(orderTotal);
}

function setupOrderType() {
  const orderTypeSelect = document.getElementById('order-type');
  if (orderTypeSelect === null) return;

  orderTypeSelect.addEventListener('change', function () {
    const orderType = orderTypeSelect.value;

    const tableField = document.getElementById('mesa-field');
    if (orderType === 'mesa') { tableField.style.display = 'flex'; }
    else                      { tableField.style.display = 'none'; }

    const deliveryFields = document.getElementById('delivery-fields');
    if (orderType === 'entrega') { deliveryFields.style.display = 'block'; }
    else                         { deliveryFields.style.display = 'none'; }

    checkDeliveryConflicts();
  });
}

function checkDeliveryConflicts() {
  const orderTypeSelect  = document.getElementById('order-type');
  const conflictWarning  = document.getElementById('delivery-conflict-warning');
  if (conflictWarning === null) return;

  if (orderTypeSelect.value !== 'entrega') {
    conflictWarning.style.display = 'none';
    return;
  }

  const localOnlyItems = getLocalOnlyItemNames();

  if (localOnlyItems.length === 0) {
    conflictWarning.style.display = 'none';
  } else {
    document.getElementById('conflict-items-list').textContent = localOnlyItems.join(', ');
    conflictWarning.style.display = 'flex';
  }
}

function setupPayment() {
  const paymentOptions = document.querySelectorAll('.payment-opt');

  for (let i = 0; i < paymentOptions.length; i++) {
    paymentOptions[i].addEventListener('click', function () {
      for (let j = 0; j < paymentOptions.length; j++) {
        paymentOptions[j].classList.remove('selected');
      }
      this.classList.add('selected');
    });
  }
}

function setupPhoneMask() {
  const phoneInput = document.getElementById('field-tel');
  if (phoneInput === null) return;

  phoneInput.addEventListener('input', function () {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);

    const isLandline = digits.length <= 10;
    if (isLandline) digits = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else            digits = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');

    phoneInput.value = digits;
  });
}

function confirmOrder() {
  const nameInput       = document.getElementById('field-nome');
  const orderTypeSelect = document.getElementById('order-type');

  if (nameInput.value.trim() === '') {
    nameInput.classList.add('error');
    nameInput.focus();
    setTimeout(function () { nameInput.classList.remove('error'); }, 2500);
    showToast('⚠️ Por favor, preencha seu nome.');
    return;
  }

  // bloqueia se tiver item só-local com delivery selecionado
  if (orderTypeSelect.value === 'entrega') {
    const localOnlyItems = getLocalOnlyItemNames();
    if (localOnlyItems.length > 0) {
      const conflictWarning = document.getElementById('delivery-conflict-warning');
      if (conflictWarning !== null) conflictWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('🚫 Remova os itens "Somente local" ou escolha retirada.');
      return;
    }
  }

  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  cartClear();

  document.getElementById('checkout-content').style.display = 'none';

  const successScreen = document.getElementById('success-screen');
  document.getElementById('order-id-display').textContent = 'PEDIDO #' + orderNumber;
  successScreen.classList.add('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {
  renderCheckout();
  setupOrderType();
  setupPayment();
  setupPhoneMask();

  const confirmButton = document.getElementById('btn-confirmar');
  if (confirmButton !== null) {
    confirmButton.addEventListener('click', confirmOrder);
  }
});