// cart.js — carrinho compartilhado por todas as páginas
// Os itens ficam salvos no localStorage do navegador

var CHAVE_CARRINHO = 'grao-alma-cart';
var LIMITE_ITENS   = 10;
var carrinhoAberto = false;

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function cartGetAll() {
  var salvo = localStorage.getItem(CHAVE_CARRINHO);
  if (salvo === null) return [];
  return JSON.parse(salvo);
}

function cartSave(carrinho) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function contarItensCarrinho() {
  var carrinho = cartGetAll();
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].qty;
  }
  return total;
}

function getCartTotal() {
  var carrinho = cartGetAll();
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total = total + (carrinho[i].price * carrinho[i].qty);
  }
  return total;
}

function cartAdd(item, quantidade) {
  var carrinho = cartGetAll();
  var qtdAtual = contarItensCarrinho();

  if (qtdAtual >= LIMITE_ITENS) return 0;

  var quantosPodemEntrar = LIMITE_ITENS - qtdAtual;
  var quantidadeReal = quantidade;
  if (quantidadeReal > quantosPodemEntrar) quantidadeReal = quantosPodemEntrar;

  // verifica se o produto já está no carrinho
  var itemExistente = null;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === item.id) {
      itemExistente = carrinho[i];
      break;
    }
  }

  if (itemExistente !== null) {
    itemExistente.qty = itemExistente.qty + quantidadeReal;
  } else {
    carrinho.push({
      id:       item.id,
      emoji:    item.emoji,
      name:     item.name,
      price:    item.price,
      delivery: item.delivery,
      qty:      quantidadeReal
    });
  }

  cartSave(carrinho);
  return quantidadeReal;
}

function cartChangeQty(id, delta) {
  var carrinho = cartGetAll();
  var itemEncontrado = null;

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      itemEncontrado = carrinho[i];
      break;
    }
  }

  if (itemEncontrado === null) return;

  if (delta === 1 && contarItensCarrinho() >= LIMITE_ITENS) {
    showToast('🚫 Limite de ' + LIMITE_ITENS + ' itens atingido!');
    return;
  }

  itemEncontrado.qty = itemEncontrado.qty + delta;

  if (itemEncontrado.qty <= 0) {
    cartRemove(id);
    return;
  }

  cartSave(carrinho);
  updateCartUI();
}

function cartRemove(id) {
  var carrinho    = cartGetAll();
  var novoCarrinho = [];

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id !== id) novoCarrinho.push(carrinho[i]);
  }

  cartSave(novoCarrinho);
  updateCartUI();
}

function cartClear() {
  localStorage.removeItem(CHAVE_CARRINHO);
}

// retorna nomes dos itens que não podem ser entregues
function itensIncompativeisComDelivery() {
  var carrinho = cartGetAll();
  var incompativeis = [];

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].delivery === false) {
      incompativeis.push(carrinho[i].name);
    }
  }

  return incompativeis;
}

function montarHTMLItemCarrinho(item) {
  var html = '';
  html += '<div class="cart-item" data-id="' + item.id + '">';
  html += '<span class="cart-item-emoji">'  + item.emoji + '</span>';
  html += '<div class="cart-item-info">';
  html += '<strong>' + item.name + '</strong>';
  html += '<span>' + formatarPreco(item.price) + ' cada</span>';
  if (item.delivery === false) {
    html += '<span class="cart-item-local-badge">📍 Só local</span>';
  }
  html += '</div>';
  html += '<div class="cart-item-qty">';
  html += '<button class="cqty-btn" data-caction="dec" data-id="' + item.id + '">−</button>';
  html += '<span class="cqty-val">' + item.qty + '</span>';
  html += '<button class="cqty-btn" data-caction="inc" data-id="' + item.id + '">+</button>';
  html += '</div>';
  html += '<button class="cart-item-remove" data-caction="remove" data-id="' + item.id + '" title="Remover">✕</button>';
  html += '</div>';
  return html;
}

function updateCartUI() {
  var carrinho    = cartGetAll();
  var qtdTotal    = contarItensCarrinho();
  var valorTotal  = getCartTotal();
  var porcentagem = (qtdTotal / LIMITE_ITENS) * 100;
  if (porcentagem > 100) porcentagem = 100;

  var htmlItens = '';
  if (carrinho.length === 0) {
    htmlItens = '<div class="cart-empty"><span>🛒</span>Nenhum item ainda</div>';
  } else {
    for (var i = 0; i < carrinho.length; i++) {
      htmlItens += montarHTMLItemCarrinho(carrinho[i]);
    }
  }

  var textoLimite = 'Máximo de ' + LIMITE_ITENS + ' itens por pedido';
  if (qtdTotal >= LIMITE_ITENS) textoLimite = '⚠️ Limite de ' + LIMITE_ITENS + ' itens atingido';

  var elContagem = document.getElementById('cart-count');
  if (elContagem !== null) {
    elContagem.textContent = qtdTotal;
    if (qtdTotal > 0) { elContagem.classList.add('visible'); }
    else              { elContagem.classList.remove('visible'); }
  }

  var elLista = document.getElementById('cart-items-list');
  if (elLista !== null) elLista.innerHTML = htmlItens;

  var elTotal = document.getElementById('cart-total-display');
  if (elTotal !== null) elTotal.textContent = formatarPreco(valorTotal);

  var elBadge = document.getElementById('cart-limit-badge');
  if (elBadge !== null) elBadge.textContent = qtdTotal + ' / ' + LIMITE_ITENS;

  var elTexto = document.getElementById('cart-limit-text');
  if (elTexto !== null) elTexto.textContent = textoLimite;

  var elBarra = document.getElementById('cart-fill-bar');
  if (elBarra !== null) {
    elBarra.style.width = porcentagem + '%';
    if (qtdTotal >= LIMITE_ITENS) { elBarra.classList.add('full'); }
    else                          { elBarra.classList.remove('full'); }
  }

  var elFinalizar = document.getElementById('btn-finalizar');
  if (elFinalizar !== null) elFinalizar.disabled = (qtdTotal === 0);
}

function toggleCart() {
  if (carrinhoAberto === false) { carrinhoAberto = true; }
  else                          { carrinhoAberto = false; }

  var dropdown = document.getElementById('cart-dropdown');
  var overlay  = document.getElementById('cart-overlay');

  if (carrinhoAberto === true) {
    if (dropdown !== null) dropdown.classList.add('open');
    if (overlay  !== null) overlay.classList.add('active');
  } else {
    if (dropdown !== null) dropdown.classList.remove('open');
    if (overlay  !== null) overlay.classList.remove('active');
  }
}

function closeCart() {
  carrinhoAberto = false;
  var dropdown = document.getElementById('cart-dropdown');
  var overlay  = document.getElementById('cart-overlay');
  if (dropdown !== null) dropdown.classList.remove('open');
  if (overlay  !== null) overlay.classList.remove('active');
}

function setupCartEvents() {
  var lista = document.getElementById('cart-items-list');
  if (lista === null) return;

  lista.addEventListener('click', function(evento) {
    var botao = evento.target;
    if (botao.tagName !== 'BUTTON' || botao.dataset.caction === undefined) return;

    var acao = botao.dataset.caction;
    var id   = parseInt(botao.dataset.id);

    if (acao === 'remove')      { cartRemove(id); }
    else if (acao === 'dec')    { cartChangeQty(id, -1); }
    else if (acao === 'inc')    { cartChangeQty(id, +1); }
  });
}

function showToast(mensagem) {
  var toast = document.getElementById('toast');
  if (toast === null) return;
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2200);
}

function setupHamburger() {
  var botao   = document.getElementById('hamburger');
  var menuMob = document.getElementById('mobile-nav');
  if (botao === null || menuMob === null) return;

  botao.addEventListener('click', function() {
    var estaAberto = menuMob.classList.contains('open');
    if (estaAberto) {
      menuMob.classList.remove('open');
      botao.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      menuMob.classList.add('open');
      botao.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  var links = menuMob.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      menuMob.classList.remove('open');
      botao.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

function setupNavbarScroll() {
  var header = document.getElementById('header-page');
  if (header === null) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) { header.classList.add('scrolled'); }
    else                     { header.classList.remove('scrolled'); }
  });
}

function setupCanvas() {
  var canvas = document.getElementById('bgCanvas');
  if (canvas === null) return;

  var ctx      = canvas.getContext('2d');
  var largura, altura;
  var bolinhas  = [];
  var particulas = [];

  var cores = [
    'rgba(92,64,32,',
    'rgba(196,136,58,',
    'rgba(61,44,20,',
    'rgba(232,185,106,',
    'rgba(26,18,8,',
    'rgba(120,80,35,'
  ];

  function ajustarTamanho() {
    largura = canvas.width  = window.innerWidth;
    altura  = canvas.height = window.innerHeight;
  }

  function criarBolinhas() {
    bolinhas = [];

    // bolhas grandes — lentas, bem visíveis
    for (var i = 0; i < 8; i++) {
      bolinhas.push({
        x:     Math.random() * largura,
        y:     Math.random() * altura,
        raio:  Math.random() * 180 + 120,
        dx:    (Math.random() - 0.5) * 0.18,
        dy:    (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.1 + 0.04,
        cor:   cores[Math.floor(Math.random() * cores.length)]
      });
    }

    // bolhas médias
    for (var j = 0; j < 10; j++) {
      bolinhas.push({
        x:     Math.random() * largura,
        y:     Math.random() * altura,
        raio:  Math.random() * 80 + 40,
        dx:    (Math.random() - 0.5) * 0.35,
        dy:    (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.08 + 0.02,
        cor:   cores[Math.floor(Math.random() * cores.length)]
      });
    }

    // bolhas pequenas — rápidas
    for (var k = 0; k < 10; k++) {
      bolinhas.push({
        x:     Math.random() * largura,
        y:     Math.random() * altura,
        raio:  Math.random() * 35 + 12,
        dx:    (Math.random() - 0.5) * 0.55,
        dy:    (Math.random() - 0.5) * 0.55,
        alpha: Math.random() * 0.06 + 0.01,
        cor:   cores[Math.floor(Math.random() * cores.length)]
      });
    }
  }

  function criarParticulas() {
    particulas = [];
    for (var i = 0; i < 55; i++) {
      particulas.push({
        x:       Math.random() * largura,
        y:       Math.random() * altura,
        tamanho: Math.random() * 2 + 0.3,
        alpha:   Math.random() * 0.15 + 0.03,
        dy:      -(Math.random() * 0.45 + 0.06),
        dx:      (Math.random() - 0.5) * 0.2
      });
    }
  }

  function animar() {
    ctx.clearRect(0, 0, largura, altura);

    for (var i = 0; i < bolinhas.length; i++) {
      var b = bolinhas[i];
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.raio)          b.x = largura + b.raio;
      if (b.x > largura + b.raio) b.x = -b.raio;
      if (b.y < -b.raio)          b.y = altura + b.raio;
      if (b.y > altura + b.raio)  b.y = -b.raio;

      var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.raio);
      grad.addColorStop(0, b.cor + b.alpha + ')');
      grad.addColorStop(1, b.cor + '0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.raio, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    for (var j = 0; j < particulas.length; j++) {
      var p = particulas[j];
      p.x    += p.dx;
      p.y    += p.dy;
      p.alpha -= 0.0003;

      if (p.y < -10 || p.alpha <= 0) {
        p.x     = Math.random() * largura;
        p.y     = largura;
        p.alpha = Math.random() * 0.15 + 0.03;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,136,58,' + p.alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(animar);
  }

  ajustarTamanho();
  criarBolinhas();
  criarParticulas();
  animar();

  window.addEventListener('resize', function() {
    ajustarTamanho();
    criarBolinhas();
    criarParticulas();
  });
}

function initGlobal() {
  setupCanvas();
  setupNavbarScroll();
  setupHamburger();
  setupCartEvents();
  updateCartUI();

  var botaoCarrinho = document.getElementById('cart-btn');
  if (botaoCarrinho !== null) {
    botaoCarrinho.addEventListener('click', toggleCart);
  }

  var overlay = document.getElementById('cart-overlay');
  if (overlay !== null) {
    overlay.addEventListener('click', closeCart);
  }

  var botaoFinalizar = document.getElementById('btn-finalizar');
  if (botaoFinalizar !== null) {
    botaoFinalizar.addEventListener('click', function() {
      if (cartGetAll().length === 0) return;
      closeCart();
      var estaEmSubpasta = window.location.pathname.includes('/pages/');
      if (estaEmSubpasta) { window.location.href = '../checkout/index.html'; }
      else                { window.location.href = 'pages/checkout/index.html'; }
    });
  }
}

document.addEventListener('DOMContentLoaded', initGlobal);
