// cardapio/index.js — lista os produtos e cuida dos filtros e do carrinho

/*
  COMO ADICIONAR UM PRODUTO:
  Copie um objeto do array MENU e edite os campos.
    id       → número único
    emoji    → ícone
    name     → nome
    price    → preço (ex: 14.50)
    desc     → descrição curta
    tags     → ["cafe","frio","sobremesa","comida","graos","especiais"]
    delivery → true = pode entregar | false = só no local
    badge    → (opcional) ex: "⭐ Favorito"
*/

const MENU = [
  { id: 1, emoji: "☕", name: "Espresso Simples", price: 7.00, tags: ["cafe"], delivery: false, desc: "Blend exclusivo da casa, 30ml de puro prazer. Base para todos os nossos drinks." },
  { id: 2, emoji: "☕", name: "Espresso Duplo", price: 9.00, tags: ["cafe"], delivery: false, desc: "Para os que não brincam em serviço. Extração dupla, intensidade máxima." },
  { id: 3, emoji: "🥛", name: "Cappuccino", price: 14.00, tags: ["cafe"], delivery: false, desc: "Espresso, leite vaporizado e espuma densa. Clássico italiano feito com perfeição." },
  { id: 4, emoji: "🥛", name: "Latte de Baunilha", price: 18.00, tags: ["cafe"], badge: "⭐ Favorito", delivery: false, desc: "Espresso duplo com leite vaporizado e extrato natural de baunilha de Madagascar." },
  { id: 5, emoji: "☕", name: "Flat White", price: 15.00, tags: ["cafe"], delivery: false, desc: "Origem australiana. Espresso ristretto duplo com microespuma sedosa e leve." },
  { id: 6, emoji: "🫖", name: "Coado V60", price: 16.00, tags: ["cafe"], delivery: false, desc: "Método por imersão e gotejamento. Destaca as notas frutadas e florais do grão." },
  { id: 7, emoji: "🍵", name: "Matcha Latte", price: 18.00, tags: ["cafe"], delivery: false, desc: "Matcha premium do Japão com leite de aveia vaporizado. Suave e energizante." },
  { id: 8, emoji: "🌙", name: "Café da Lua", price: 20.00, tags: ["cafe", "especiais"], delivery: false, desc: "Espresso com leite de coco, cúrcuma e pimenta preta. Um drink noturno e reconfortante." },
  { id: 9, emoji: "☕", name: "Espresso Signature G&A", price: 22.00, tags: ["cafe", "especiais"], badge: "✨ Exclusivo", delivery: false, desc: "Blend secreto com grãos de três origens. Notas de chocolate, frutas vermelhas e caramelo." },
  { id: 10, emoji: "🧊", name: "Cold Brew 24h (garrafa)", price: 22.00, tags: ["frio"], badge: "🧊 Top Frio", delivery: true, desc: "Infusão a frio por 24 horas em garrafa 500ml. Vai lacrado e mantém qualidade por 3 dias." },
  { id: 11, emoji: "🧋", name: "Iced Latte", price: 17.00, tags: ["frio"], delivery: true, desc: "Espresso sobre gelo e leite gelado em copo lacrado. Perfeito para o delivery." },
  { id: 12, emoji: "🧃", name: "Cold Brew Tônica", price: 19.00, tags: ["frio"], delivery: true, desc: "Cold brew com água tônica e casca de laranja. Refrescante e diferente — vai lacrado." },
  { id: 13, emoji: "🍹", name: "Limonada com Espresso", price: 18.00, tags: ["frio"], delivery: true, desc: "Limonada fresca com um shot de espresso. Cítrico, intenso e gelado." },
  { id: 14, emoji: "🍦", name: "Affogato", price: 19.00, tags: ["sobremesa"], delivery: false, desc: "Espresso quente despejado sobre sorvete artesanal. Só pode ser apreciado aqui!" },
  { id: 15, emoji: "🍫", name: "Brownie Belga", price: 13.00, tags: ["sobremesa"], delivery: false, desc: "Chocolate 70% cacau com nozes e flor de sal, servido quente. Melhor na hora." },
  { id: 16, emoji: "🍰", name: "Fatia de Cheesecake", price: 19.00, tags: ["sobremesa"], delivery: false, desc: "Base amanteigada, recheio de cream cheese e geleia de maracujá. Fresco e cremoso." },
  { id: 17, emoji: "🎂", name: "Bolo Inteiro de Cenoura", price: 65.00, tags: ["sobremesa"], badge: "📦 Para Lelet", delivery: true, desc: "Bolo inteiro embalado (serve 10 pessoas). Ideal para pedir com antecedência." },
  { id: 18, emoji: "🍪", name: "Kit 6 Cookies", price: 28.00, tags: ["sobremesa"], delivery: true, desc: "Seis cookies de chocolate belga embalados. Duram 4 dias e viajam bem." },
  { id: 19, emoji: "🥐", name: "Croissant de Manteiga", price: 12.00, tags: ["comida"], delivery: false, desc: "Folhado artesanal assado no dia. Crocante por fora, macio por dentro — melhor quente." },
  { id: 20, emoji: "🥪", name: "Sanduíche Club", price: 22.00, tags: ["comida"], delivery: false, desc: "Frango grelhado, queijo colonial e pesto caseiro. Servido na hora." },
  { id: 21, emoji: "🍳", name: "Tostex Especial", price: 16.00, tags: ["comida"], delivery: false, desc: "Pão brioche, queijo gruyère e presunto cozido. Saindo fresquinho da chapa." },
  { id: 22, emoji: "📦", name: "Caixa Café da Manhã", price: 55.00, tags: ["comida"], badge: "📦 Para Lelet", delivery: true, desc: "Caixa com 2 croissants, 2 cookies, granola e geleia artesanal. Embalada para viagem." },
  { id: 23, emoji: "🫘", name: "Grão Arábica 250g", price: 38.00, tags: ["graos"], delivery: true, desc: "Grão inteiro torrado na semana. Origem única, Etiópia Yirgacheffe. Notas de mirtilo." },
  { id: 24, emoji: "🫘", name: "Grão Blend G&A 250g", price: 35.00, tags: ["graos"], badge: "⭐ Mais Pedido", delivery: true, desc: "Nosso blend exclusivo de 3 origens. O mesmo que usamos no espresso — agora na sua casa." },
  { id: 25, emoji: "🫘", name: "Grão Arábica Moído 250g", price: 36.00, tags: ["graos"], delivery: true, desc: "Mesmo grão da Etiópia, já moído na granulometria ideal para filtro. Pronto para usar." },
  { id: 26, emoji: "🎁", name: "Kit Presente Café", price: 89.00, tags: ["graos", "especiais"], badge: "🎁 Presente", delivery: true, desc: "Caixinha com 250g de grão blend, 6 cookies e cartão personalizado. Embrulhado para presente." },
  { id: 27, emoji: "✨", name: "Grão Signature", price: 28.00, tags: ["especiais"], badge: "🏆 Premium", delivery: false, desc: "Nossa bebida exclusiva preparada na sua frente. Segredo da casa — experimente aqui." }
];

let NOMES_FILTROS = {
  "cafe": "☕ Cafés Quentes",
  "frio": "🧊 Bebidas Frias",
  "sobremesa": "🍨 Sobremesas",
  "comida": "🥐 Comidas",
  "graos": "🫘 Grãos & Produtos",
  "especiais": "✨ Especiais"
};

function fmtPrice(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function montarHTMLCard(item) {
  let htmlTags = '';
  for (let t = 0; t < item.tags.length; t++) {
    let nome = NOMES_FILTROS[item.tags[t]];
    if (nome !== undefined) htmlTags += '<span>' + nome + '</span>';
  }

  let htmlBadge = '';
  if (item.badge !== undefined) htmlBadge = '<div class="item-card-badge">' + item.badge + '</div>';

  let htmlSoLocal = '';
  if (item.delivery === false) htmlSoLocal = '<div class="item-local-only-tag">📍 Somente local</div>';

  let classeExtra = '';
  if (item.badge !== undefined) classeExtra = ' featured';

  let html = '';
  html += '<div class="item-card' + classeExtra + '"';
  html += ' data-id="' + item.id + '"';
  html += ' data-tags="' + item.tags.join(',') + '"';
  html += ' data-nome="' + item.name.toLowerCase() + '"';
  html += ' data-delivery="' + item.delivery + '">';
  html += htmlBadge + htmlSoLocal;
  html += '<span class="card-emoji">' + item.emoji + '</span>';
  html += '<div class="item-info">';
  html += '<div class="item-price"><strong>' + item.name + '</strong><span>' + fmtPrice(item.price) + '</span></div>';
  html += '<p>' + item.desc + '</p>';
  html += '<div class="filters">' + htmlTags + '</div>';
  html += '<div class="item-actions">';
  html += '<div class="qty-control">';
  html += '<button class="qty-btn" data-action="dec">−</button>';
  html += '<span class="qty-value">1</span>';
  html += '<button class="qty-btn" data-action="inc">+</button>';
  html += '</div>';
  html += '<button class="btn-add-cart" data-action="add">+ Adicionar</button>';
  html += '</div></div></div>';
  return html;
}

function renderMenu() {
  const container = document.getElementById('cards-container');
  let html = '';
  for (let i = 0; i < MENU.length; i++) {
    html += montarHTMLCard(MENU[i]);
  }
  container.innerHTML = html;
}

function filterCards() {
  const busca = document.getElementById('search-input').value.toLowerCase().trim();
  const filtroAtivo = document.querySelector('input[name="filter-items"]:checked').id;

  let mapa = {
    'all-items': null,
    'coffee-items': 'cafe',
    'cold-items': 'frio',
    'dessert-items': 'sobremesa',
    'food-items': 'comida',
    'graos-items': 'graos',
    'specials-items': 'especiais',
    'delivery-items': 'delivery'
  };

  let tagAtiva = mapa[filtroAtivo];
  const todos = document.querySelectorAll('.item-card');
  let visiveis = 0;

  for (let i = 0; i < todos.length; i++) {
    let card = todos[i];

    let passouCategoria = true;
    if (tagAtiva !== null) {
      if (tagAtiva === 'delivery') {
        passouCategoria = (card.dataset.delivery === 'true');
      } else {
        passouCategoria = card.dataset.tags.includes(tagAtiva);
      }
    }

    let passouBusca = true;
    if (busca !== '') passouBusca = card.dataset.nome.includes(busca);

    if (passouCategoria && passouBusca) {
      card.classList.remove('hidden');
      visiveis = visiveis + 1;
    } else {
      card.classList.add('hidden');
    }
  }

  const elMsg = document.getElementById('search-msg');
  if (busca !== '') {
    if (visiveis === 0) {
      elMsg.textContent = 'Nenhum item encontrado para "' + busca + '".';
      elMsg.style.color = '#e57373';
    } else {
      elMsg.textContent = visiveis + ' item(s) encontrado(s).';
      elMsg.style.color = 'let(--caramelo)';
    }
  } else {
    elMsg.textContent = '';
  }
}

function setupCardEvents() {
  const container = document.getElementById('cards-container');

  container.addEventListener('click', function (evento) {
    let botao = evento.target;
    if (botao.tagName !== 'BUTTON' || botao.dataset.action === undefined) return;

    let acao = botao.dataset.action;
    let card = botao.closest('.item-card');
    if (card === null) return;

    // botões de quantidade do card
    if (acao === 'dec' || acao === 'inc') {
      let elQtd = card.querySelector('.qty-value');
      let qtd = parseInt(elQtd.textContent);
      if (acao === 'inc') { qtd = qtd + 1; }
      else { qtd = qtd - 1; }
      if (qtd < 1) qtd = 1;
      if (qtd > 10) qtd = 10;
      elQtd.textContent = qtd;
      return;
    }

    // botão adicionar ao carrinho
    if (acao === 'add') {
      let id = parseInt(card.dataset.id);
      let elQ = card.querySelector('.qty-value');
      let qtdDesejada = parseInt(elQ.textContent);

      let produto = null;
      for (let i = 0; i < MENU.length; i++) {
        if (MENU[i].id === id) { produto = MENU[i]; break; }
      }

      if (produto === null) return;

      let adicionado = cartAdd(produto, qtdDesejada);

      if (adicionado === 0) { showToast('🚫 Limite de 10 itens atingido!'); return; }

      elQ.textContent = 1;
      updateCartUI();

      let msg = '✓ ' + produto.name + ' adicionado!';
      if (adicionado < qtdDesejada) msg = '✓ ' + produto.name + ' adicionado (limite atingido)!';
      showToast(msg);

      botao.textContent = '✓ Adicionado!';
      botao.style.background = 'let(--dourado)';
      setTimeout(function () {
        botao.textContent = '+ Adicionar';
        botao.style.background = '';
      }, 1400);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();
  setupCardEvents();

  const campoBusca = document.getElementById('search-input');
  campoBusca.addEventListener('input', filterCards);
  campoBusca.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { campoBusca.value = ''; filterCards(); }
  });

  const radios = document.querySelectorAll('input[name="filter-items"]');
  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', filterCards);
  }
});
