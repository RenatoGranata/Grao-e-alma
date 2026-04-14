// checkout/index.js — cuida da página de finalizar pedido

function fmtPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function renderCheckout() {
  var carrinho = cartGetAll();

  if (carrinho.length === 0) {
    document.getElementById('empty-warning').style.display    = 'flex';
    document.getElementById('checkout-content').style.display = 'none';
    return;
  }

  var html       = '';
  var totalGeral = 0;

  for (var i = 0; i < carrinho.length; i++) {
    var item         = carrinho[i];
    var subtotalItem = item.price * item.qty;
    totalGeral       = totalGeral + subtotalItem;

    html += '<div class="order-item-row">';
    html += '<span class="oi-emoji">' + item.emoji + '</span>';
    html += '<div class="oi-info">';
    html += '<div class="oi-name">' + item.name + '</div>';
    html += '<div class="oi-qty">' + item.qty + 'x · ' + fmtPreco(item.price) + '</div>';
    if (item.delivery === false) {
      html += '<div class="oi-local-warn">📍 Somente local</div>';
    }
    html += '</div>';
    html += '<span class="oi-price">' + fmtPreco(subtotalItem) + '</span>';
    html += '</div>';
  }

  document.getElementById('checkout-items-list').innerHTML = html;
  document.getElementById('co-subtotal').textContent        = fmtPreco(totalGeral);
  document.getElementById('co-total').textContent           = fmtPreco(totalGeral);
}

function setupOrderType() {
  var select = document.getElementById('order-type');
  if (select === null) return;

  select.addEventListener('change', function() {
    var tipo = select.value;

    var campoMesa = document.getElementById('mesa-field');
    if (tipo === 'mesa') { campoMesa.style.display = 'flex'; }
    else                 { campoMesa.style.display = 'none'; }

    var campoDelivery = document.getElementById('delivery-fields');
    if (tipo === 'entrega') { campoDelivery.style.display = 'block'; }
    else                    { campoDelivery.style.display = 'none'; }

    verificarConflitosDelivery();
  });
}

function verificarConflitosDelivery() {
  var select  = document.getElementById('order-type');
  var avisoEl = document.getElementById('delivery-conflict-warning');
  if (avisoEl === null) return;

  if (select.value !== 'entrega') {
    avisoEl.style.display = 'none';
    return;
  }

  var incompativeis = itensIncompativeisComDelivery();

  if (incompativeis.length === 0) {
    avisoEl.style.display = 'none';
  } else {
    document.getElementById('conflict-items-list').textContent = incompativeis.join(', ');
    avisoEl.style.display = 'flex';
  }
}

function setupPayment() {
  var opcoes = document.querySelectorAll('.payment-opt');

  for (var i = 0; i < opcoes.length; i++) {
    opcoes[i].addEventListener('click', function() {
      for (var j = 0; j < opcoes.length; j++) {
        opcoes[j].classList.remove('selected');
      }
      this.classList.add('selected');
    });
  }
}

function setupTelMask() {
  var campoTel = document.getElementById('field-tel');
  if (campoTel === null) return;

  campoTel.addEventListener('input', function() {
    var soNumeros = campoTel.value.replace(/\D/g, '');
    if (soNumeros.length > 11) soNumeros = soNumeros.slice(0, 11);

    var formatado = soNumeros;
    if (soNumeros.length <= 10) {
      formatado = soNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      formatado = soNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    campoTel.value = formatado;
  });
}

function confirmarPedido() {
  var campoNome  = document.getElementById('field-nome');
  var selectTipo = document.getElementById('order-type');

  if (campoNome.value.trim() === '') {
    campoNome.classList.add('error');
    campoNome.focus();
    setTimeout(function() { campoNome.classList.remove('error'); }, 2500);
    showToast('⚠️ Por favor, preencha seu nome.');
    return;
  }

  // bloqueia se tiver item só-local com delivery selecionado
  if (selectTipo.value === 'entrega') {
    var incompativeis = itensIncompativeisComDelivery();
    if (incompativeis.length > 0) {
      var avisoEl = document.getElementById('delivery-conflict-warning');
      if (avisoEl !== null) avisoEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('🚫 Remova os itens "Somente local" ou escolha retirada.');
      return;
    }
  }

  var numeroPedido = Math.floor(1000 + Math.random() * 9000);
  cartClear();

  document.getElementById('checkout-content').style.display = 'none';

  var telaSucesso = document.getElementById('success-screen');
  document.getElementById('order-id-display').textContent = 'PEDIDO #' + numeroPedido;
  telaSucesso.classList.add('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
  renderCheckout();
  setupOrderType();
  setupPayment();
  setupTelMask();

  var btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar !== null) {
    btnConfirmar.addEventListener('click', confirmarPedido);
  }
});
