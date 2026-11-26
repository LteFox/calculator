const root = document.getElementById('page-root');

// Аналог useState в Next.js
let state = {
  items: [], // { id, price, qty }
  paid: 0,
};

function setState(nextPartial) {
  state = { ...state, ...nextPartial };
  render();
}

function getTotal() {
  return state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function render() {
  const total = getTotal();
  const rest = Math.max(0, state.paid - total);

  root.innerHTML = `
    <div class="header-row">
      <span>Nr</span>
      <span>Cantitatea</span>
      <span>Pret</span>
    </div>

    <div id="items-list">
      ${state.items
        .map(
          (item, idx) => `
        <div class="item-row" data-id="${item.id}">
          <span class="number">${idx + 1}</span>
          <div class="cantitatea">
            <button type="button" class="plus" data-action="inc" data-id="${item.id}">+</button>
            <span class="total-produs">${item.qty}</span>
            <button type="button" class="minus" data-action="dec" data-id="${item.id}">-</button>
          </div>
          <span class="pret-pozitie">${item.price * item.qty}MDL</span>
        </div>
      `
        )
        .join('')}
    </div>

    <h3>Pozitii</h3>
    <div class="add-box">
      <input type="number" id="price-input" placeholder="Pret" />
      <button type="button" id="add-btn">+</button>
    </div>

    <div class="summary-labels">
      <span>Cat spre achitare</span>
      <span>Cat a achitat</span>
      <span>Rest</span>
    </div>
    <div class="summary-values">
      <span>${total.toFixed(2)} MDL</span>
      <input type="number" id="paid-input" value="${state.paid || ''}" placeholder="0.00" />
      <span>${rest.toFixed(2)} MDL</span>
    </div>

    <button type="button" id="finish-btn">Finisat</button>
  `;

  bindEvents();
}

function bindEvents() {
  const addBtn = document.getElementById('add-btn');
  const priceInput = document.getElementById('price-input');
  const paidInput = document.getElementById('paid-input');
  const finishBtn = document.getElementById('finish-btn');

  addBtn?.addEventListener('click', () => {
    const price = Number(priceInput.value);
    if (!price || price <= 0) return;

    setState({
      items: [...state.items, { id: crypto.randomUUID(), price, qty: 1 }],
    });
  });

  // Делегирование кликов по + и -
  root.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      const updated = state.items.map((item) => {
        if (item.id !== id) return item;
        if (action === 'inc') return { ...item, qty: item.qty + 1 };
        if (action === 'dec') return { ...item, qty: Math.max(1, item.qty - 1) };
        return item;
      });

      setState({ items: updated });
    });
  });

  paidInput?.addEventListener('input', (e) => {
    state.paid = Number(e.target.value) || 0;
    // Обновляем только Rest без потери фокуса с инпута
    const restVal = Math.max(0, state.paid - getTotal()).toFixed(2);
    const restEl = root.querySelector('.summary-values span:last-child');
    if (restEl) restEl.textContent = `${restVal} MDL`;
  });

  finishBtn?.addEventListener('click', () => {
    setState({ items: [], paid: 0 });
  });
}

render();