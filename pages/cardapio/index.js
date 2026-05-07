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
  { id: 1,  emoji: "☕", name: "Espresso Simples",        price: 7.00,  tags: ["cafe"],               delivery: false, desc: "Blend exclusivo da casa, 30ml de puro prazer. Base para todos os nossos drinks." },
  { id: 2,  emoji: "☕", name: "Espresso Duplo",           price: 9.00,  tags: ["cafe"],               delivery: false, desc: "Para os que não brincam em serviço. Extração dupla, intensidade máxima." },
  { id: 3,  emoji: "🥛", name: "Cappuccino",               price: 14.00, tags: ["cafe"],               delivery: false, desc: "Espresso, leite vaporizado e espuma densa. Clássico italiano feito com perfeição." },
  { id: 4,  emoji: "🥛", name: "Latte de Baunilha",        price: 18.00, tags: ["cafe"],               delivery: false, badge: "⭐ Favorito", desc: "Espresso duplo com leite vaporizado e extrato natural de baunilha de Madagascar." },
  { id: 5,  emoji: "☕", name: "Flat White",               price: 15.00, tags: ["cafe"],               delivery: false, desc: "Origem australiana. Espresso ristretto duplo com microespuma sedosa e leve." },
  { id: 6,  emoji: "🫖", name: "Coado V60",                price: 16.00, tags: ["cafe"],               delivery: false, desc: "Método por imersão e gotejamento. Destaca as notas frutadas e florais do grão." },
  { id: 7,  emoji: "🍵", name: "Matcha Latte",             price: 18.00, tags: ["cafe"],               delivery: false, desc: "Matcha premium do Japão com leite de aveia vaporizado. Suave e energizante." },
  { id: 8,  emoji: "🌙", name: "Café da Lua",              price: 20.00, tags: ["cafe", "especiais"],  delivery: false, desc: "Espresso com leite de coco, cúrcuma e pimenta preta. Um drink noturno e reconfortante." },
  { id: 9,  emoji: "☕", name: "Espresso Signature G&A",   price: 22.00, tags: ["cafe", "especiais"],  delivery: false, badge: "✨ Exclusivo", desc: "Blend secreto com grãos de três origens. Notas de chocolate, frutas vermelhas e caramelo." },
  { id: 10, emoji: "🧊", name: "Cold Brew 24h (garrafa)",  price: 22.00, tags: ["frio"],               delivery: true,  badge: "🧊 Top Frio", desc: "Infusão a frio por 24 horas em garrafa 500ml. Vai lacrado e mantém qualidade por 3 dias." },
  { id: 11, emoji: "🧋", name: "Iced Latte",               price: 17.00, tags: ["frio"],               delivery: true,  desc: "Espresso sobre gelo e leite gelado em copo lacrado. Perfeito para o delivery." },
  { id: 12, emoji: "🧃", name: "Cold Brew Tônica",         price: 19.00, tags: ["frio"],               delivery: true,  desc: "Cold brew com água tônica e casca de laranja. Refrescante e diferente — vai lacrado." },
  { id: 13, emoji: "🍹", name: "Limonada com Espresso",    price: 18.00, tags: ["frio"],               delivery: true,  desc: "Limonada fresca com um shot de espresso. Cítrico, intenso e gelado." },
  { id: 14, emoji: "🍦", name: "Affogato",                 price: 19.00, tags: ["sobremesa"],          delivery: false, desc: "Espresso quente despejado sobre sorvete artesanal. Só pode ser apreciado aqui!" },
  { id: 15, emoji: "🍫", name: "Brownie Belga",            price: 13.00, tags: ["sobremesa"],          delivery: false, desc: "Chocolate 70% cacau com nozes e flor de sal, servido quente. Melhor na hora." },
  { id: 16, emoji: "🍰", name: "Fatia de Cheesecake",      price: 19.00, tags: ["sobremesa"],          delivery: false, desc: "Base amanteigada, recheio de cream cheese e geleia de maracujá. Fresco e cremoso." },
  { id: 17, emoji: "🎂", name: "Bolo Inteiro de Cenoura",  price: 65.00, tags: ["sobremesa"],          delivery: true,  badge: "📦 Para Lelet", desc: "Bolo inteiro embalado (serve 10 pessoas). Ideal para pedir com antecedência." },
  { id: 18, emoji: "🍪", name: "Kit 6 Cookies",            price: 28.00, tags: ["sobremesa"],          delivery: true,  desc: "Seis cookies de chocolate belga embalados. Duram 4 dias e viajam bem." },
  { id: 19, emoji: "🥐", name: "Croissant de Manteiga",    price: 12.00, tags: ["comida"],             delivery: false, desc: "Folhado artesanal assado no dia. Crocante por fora, macio por dentro — melhor quente." },
  { id: 20, emoji: "🥪", name: "Sanduíche Club",           price: 22.00, tags: ["comida"],             delivery: false, desc: "Frango grelhado, queijo colonial e pesto caseiro. Servido na hora." },
  { id: 21, emoji: "🍳", name: "Tostex Especial",          price: 16.00, tags: ["comida"],             delivery: false, desc: "Pão brioche, queijo gruyère e presunto cozido. Saindo fresquinho da chapa." },
  { id: 22, emoji: "📦", name: "Caixa Café da Manhã",      price: 55.00, tags: ["comida"],             delivery: true,  badge: "📦 Para Lelet", desc: "Caixa com 2 croissants, 2 cookies, granola e geleia artesanal. Embalada para viagem." },
  { id: 23, emoji: "🫘", name: "Grão Arábica 250g",        price: 38.00, tags: ["graos"],              delivery: true,  desc: "Grão inteiro torrado na semana. Origem única, Etiópia Yirgacheffe. Notas de mirtilo." },
  { id: 24, emoji: "🫘", name: "Grão Blend G&A 250g",      price: 35.00, tags: ["graos"],              delivery: true,  badge: "⭐ Mais Pedido", desc: "Nosso blend exclusivo de 3 origens. O mesmo que usamos no espresso — agora na sua casa." },
  { id: 25, emoji: "🫘", name: "Grão Arábica Moído 250g",  price: 36.00, tags: ["graos"],              delivery: true,  desc: "Mesmo grão da Etiópia, já moído na granulometria ideal para filtro. Pronto para usar." },
  { id: 26, emoji: "🎁", name: "Kit Presente Café",        price: 89.00, tags: ["graos", "especiais"], delivery: true,  badge: "🎁 Presente", desc: "Caixinha com 250g de grão blend, 6 cookies e cartão personalizado. Embrulhado para presente." },
  { id: 27, emoji: "✨", name: "Grão Signature",           price: 28.00, tags: ["especiais"],          delivery: false, badge: "🏆 Premium", desc: "Nossa bebida exclusiva preparada na sua frente. Segredo da casa — experimente aqui." }
];

const FILTER_LABEL_MAP = {
  "cafe":      "☕ Cafés Quentes",
  "frio":      "🧊 Bebidas Frias",
  "sobremesa": "🍨 Sobremesas",
  "comida":    "🥐 Comidas",
  "graos":     "🫘 Grãos & Produtos",
  "especiais": "✨ Especiais"
};

function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function buildCardHTML(item) {
  let tagsHTML = '';
  for (let i = 0; i < item.tags.length; i++) {
    let label = FILTER_LABEL_MAP[item.tags[i]];
    if (label !== undefined) tagsHTML += '<span>' + label + '</span>';
  }

  let badgeHTML = '';
  if (item.badge !== undefined) badgeHTML = '<div class="item-card-badge">' + item.badge + '</div>';

  let deliveryTagHTML = '';
  if (item.delivery === false) deliveryTagHTML = '<div class="item-local-only-tag">📍 Somente local</div>';
  else                         deliveryTagHTML = '<div class="item-local-only-tag">📍 Local e disponível para entrega</div>';

  let featuredClass = '';
  if (item.badge !== undefined) featuredClass = ' featured';

  return `
    <div class="item-card ${featuredClass}"
        data-id="${item.id}"
        data-tags="${item.tags.join(',')}"
        data-nome="${item.name.toLowerCase()}"
        data-delivery="${item.delivery}">
      ${badgeHTML}${deliveryTagHTML}
      <div class="content-card-container">
        <span class="card-emoji">${item.emoji}</span>
        <div class="item-info">
          <div class="item-price">
            <strong>${item.name}</strong>
            <span>${formatPrice(item.price)}</span>
          </div>
          <p>${item.desc}</p>
          <div class="filters">${tagsHTML}</div>
          <div class="item-actions">
            <div class="qty-control">
              <button class="qty-btn" data-action="dec">−</button>
              <span class="qty-value">1</span>
              <button class="qty-btn" data-action="inc">+</button>
            </div>
            <button class="btn-add-cart" data-action="add">+ Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMenu() {
  const container = document.getElementById('cards-container');
  let html = '';
  for (let i = 0; i < MENU.length; i++) {
    html += buildCardHTML(MENU[i]);
  }
  container.innerHTML = html;
}

function filterCards() {
  const searchTerm   = document.getElementById('search-input').value.toLowerCase().trim();
  const activeFilter = document.querySelector('input[name="filter-items"]:checked').id;

  const filterTagMap = {
    'all-items':      null,
    'coffee-items':   'cafe',
    'cold-items':     'frio',
    'dessert-items':  'sobremesa',
    'food-items':     'comida',
    'graos-items':    'graos',
    'specials-items': 'especiais',
    'delivery-items': 'delivery'
  };

  const activeTag = filterTagMap[activeFilter];
  const allCards  = document.querySelectorAll('.item-card');
  let visibleCount = 0;

  for (let i = 0; i < allCards.length; i++) {
    let card = allCards[i];

    let matchesCategory = true;
    if (activeTag !== null) {
      if (activeTag === 'delivery') matchesCategory = (card.dataset.delivery === 'true');
      else                          matchesCategory = card.dataset.tags.includes(activeTag);
    }

    let matchesSearch = true;
    if (searchTerm !== '') matchesSearch = card.dataset.nome.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  }

  const searchMessageEl = document.getElementById('search-msg');
  if (searchTerm !== '') {
    if (visibleCount === 0) {
      searchMessageEl.textContent = 'Nenhum item encontrado para "' + searchTerm + '".';
      searchMessageEl.style.color = '#e57373';
    } else {
      searchMessageEl.textContent = visibleCount + ' item(s) encontrado(s).';
      searchMessageEl.style.color = 'var(--caramelo)';
    }
  } else {
    searchMessageEl.textContent = '';
  }
}

function setupCardEvents() {
  const container = document.getElementById('cards-container');

  container.addEventListener('click', function (event) {
    let button = event.target;
    if (button.tagName !== 'BUTTON' || button.dataset.action === undefined) return;

    let action = button.dataset.action;
    let card   = button.closest('.item-card');
    if (card === null) return;

    if (action === 'dec' || action === 'inc') {
      let quantityDisplay = card.querySelector('.qty-value');
      let quantity = parseInt(quantityDisplay.textContent);
      if (action === 'inc') quantity++;
      else                  quantity--;
      if (quantity < 1)  quantity = 1;
      if (quantity > 10) quantity = 10;
      quantityDisplay.textContent = quantity;
      return;
    }

    if (action === 'add') {
      let itemId          = parseInt(card.dataset.id);
      let quantityDisplay = card.querySelector('.qty-value');
      let requestedQty    = parseInt(quantityDisplay.textContent);

      let product = null;
      for (let i = 0; i < MENU.length; i++) {
        if (MENU[i].id === itemId) { product = MENU[i]; break; }
      }

      if (product === null) return;

      let addedQty = cartAdd(product, requestedQty);

      if (addedQty === 0) { showToast('🚫 Limite de 10 itens atingido!'); return; }

      quantityDisplay.textContent = 1;
      updateCartUI();

      let toastMessage = '✓ ' + product.name + ' adicionado!';
      if (addedQty < requestedQty) toastMessage = '✓ ' + product.name + ' adicionado (limite atingido)!';
      showToast(toastMessage);

      button.textContent = '✓ Adicionado!';
      button.style.background = 'var(--dourado)';
      setTimeout(function () {
        button.textContent      = '+ Adicionar';
        button.style.background = '';
      }, 1400);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();
  setupCardEvents();

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', filterCards);
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { searchInput.value = ''; filterCards(); }
  });

  const filterRadios = document.querySelectorAll('input[name="filter-items"]');
  for (let i = 0; i < filterRadios.length; i++) {
    filterRadios[i].addEventListener('change', filterCards);
  }
});