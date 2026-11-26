document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("price");
  const button = document.getElementById("add");
  const data = document.getElementById("produse");
  const calcul = document.getElementById("price-client");

  let prices = [];

  function getTotal() {
    return prices.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function render() {
    const total = getTotal();
    console.log(total);
    data.innerHTML =
      prices
        .map(
          (item, idx) => `
        <div class="produse" data-id="${item.id}">
            <span class="number">${idx + 1}</span>
            <span></span>
            <div class="cantitatea">
                <button class="plus" data-action="inc" data-id="${item.id}">+</button>
                <span class="total-produs">${item.qty}</span>
                <button class="minus" data-action="dec" data-id="${item.id}">-</button>
            </div>
            <span></span>
            <span class="pret-pozitie">${item.price * item.qty}MDL</span>
            
        </div>        
        `,
        )
        .join("") +
      `      
        <div>
            <span class="number-total">TOTAL: ${total}MDL</span>
        </div>
        `;

    buttonEvent();
    updatePayment();
  }

  button.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    prices.push({
      id: crypto.randomUUID(),
      qty: 1,
      price: Number(value),
    });
    input.value = "";
    render();
  });

  function buttonEvent() {
    data.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;

        const update = prices.map((item) => {
          if (item.id !== id) return item;
          if (action === "inc") return { ...item, qty: item.qty + 1 };
          if (action === "dec")
            return { ...item, qty: Math.max(1, item.qty - 1) };
          return item;
        });
        prices = update;
        render();
      });
    });
  }

  function renderRest() {
    calcul.innerHTML = `
        <div id="price">
            <span class="achitare">0.00MDL</span>
            <span></span>
            <input id="clientCash" type="number" placeholder="0.00 MDL">
            <span></span>
            <span id="rest" class="rest">0.00MDL</span>
        </div>
    `;

    const cashInput = document.getElementById("clientCash");
    cashInput?.addEventListener("input", () => {
      updatePayment();
    });
    updatePayment();
  }
  renderRest();

  function updatePayment() {
    const cashInput = document.getElementById("clientCash");
    const totalEl = calcul.querySelector(".achitare");
    const restEl = document.getElementById("rest");

    const cash = cashInput ? Number(cashInput.value) || 0 : 0;
    const total = getTotal();
    const rest = cash - total;

    if (rest < 0) {
      restEl.style.color = " rgb(237, 17, 17)";
      restEl.style.fontWeight = "bold";
    } else if (rest == 0) {
      restEl.style.color = "white";
    } else {
      restEl.style.color = " rgb(22, 175, 22)";
      restEl.style.fontWeight = "bold";
    }

    if (totalEl) totalEl.textContent = `${total}MDL`;
    if (restEl) restEl.textContent = `${rest}MDL`;
  }

  const finsh = document.getElementById("finish");
  finsh.addEventListener("click", () => {
    console.log("finish");
    prices = [];
    render();
  });
});
