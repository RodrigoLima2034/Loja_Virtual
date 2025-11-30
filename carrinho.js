// ---------------- CARREGAR CARRINHO ----------------
function loadCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("total-carrinho");
    const cart = loadCart();

    if (!container || !totalEl) return;

    if (cart.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalEl.textContent = "0,00";
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">${item.price.toFixed(2)}</p>
                    <div class="quantity-container">
                        <input type="number" min="1" value="${item.quantity}" class="item-quantity" data-id="${item.id}">
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remover</button>
                </div>
            </div>
        `).join("");
    }

    updateCartTotal();
    attachCartEvents();

    // Mostra endereço só se sessão indicar
    if (sessionStorage.getItem("showAddress") === "true") {
        mostrarEnderecoNoCarrinho();
        sessionStorage.removeItem("showAddress"); // mostra só uma vez
    }
}

// ---------------- EVENTOS DO CARRINHO ----------------
function attachCartEvents() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => removeItem(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll(".quantity-container input").forEach(input => {
        input.addEventListener("change", () => {
            const id = parseInt(input.dataset.id);
            const qty = parseInt(input.value) || 1;
            updateQuantity(id, qty);
        });
    });
}

function removeItem(id) {
    let cart = loadCart();
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function updateQuantity(id, quantity) {
    let cart = loadCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function updateCartTotal() {
    const cart = loadCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("total-carrinho").textContent = total.toFixed(2).replace('.', ',');
}

// ---------------- MOSTRAR ENDEREÇO ----------------
function mostrarEnderecoNoCarrinho() {
    const resumo = document.querySelector(".carrinho-resumo");
    if (!resumo) return;

    let div = document.getElementById("resumo-endereco");
    if (!div) {
        div = document.createElement("div");
        div.id = "resumo-endereco";
        div.className = "resumo-endereco"; // mantém CSS existente
        resumo.insertAdjacentElement("afterend", div);
    }

    const endereco = JSON.parse(localStorage.getItem("endereco") || "{}");

    div.innerHTML = endereco && Object.keys(endereco).length > 0 ? `
        <h4>Endereço de Entrega:</h4>
        <p>${endereco.nome}</p>
        <p>${endereco.rua}, ${endereco.numero}</p>
        <p>${endereco.bairro}</p>
        <p>${endereco.cidade} - ${endereco.estado}</p>
        <p>CEP: ${endereco.cep}</p>
    ` : "";
}

// ---------------- PAGAMENTO ----------------
function checkout(method) {
    const cart = loadCart();
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Recupera endereço; obrigatório para pagar
    const endereco = JSON.parse(localStorage.getItem("endereco") || "{}");
    if (!endereco.nome) return alert("Defina o endereço de entrega antes de pagar!");

    switch (method) {
        case "pagseguro":
            // === PAGSEGURO SANDBOX (teste) ===
            // Para produção, gerar checkoutCode via API PagSeguro e redirecionar:
            // https://pagseguro.uol.com.br/v2/checkout/payment.html?code=SEU_CHECKOUT_CODE
            window.open(`https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?amount=${total.toFixed(2)}`, "_blank");
            break;

        case "pix":
            // === PIX SANDBOX (teste) ===
            // Para produção, gerar QR Code real via API de cobrança do banco ou PSP
            // Aqui abrimos link simulado com valor
            const pixLink = `https://www.qrcodepix.exemplo.com.br/?valor=${total.toFixed(2)}`;
            window.open(pixLink, "_blank");
            break;

        case "boleto":
            // === BOLETO SANDBOX (teste) ===
            // Para produção, gerar boleto via API do banco/PSP e abrir PDF
            const boletoLink = `https://www.boletobancario.com/teste?valor=${total.toFixed(2)}`;
            window.open(boletoLink, "_blank");
            break;

        case "mercadopago":
            // === MERCADOPAGO SANDBOX (teste) ===
            // Para produção, usar API MercadoPago para criar pagamento e redirecionar
            window.open(`https://www.mercadopago.com.br/checkout?amount=${total.toFixed(2)}`, "_blank");
            break;

        default:
            alert("Selecione um método de pagamento válido.");
    }
}

// ---------------- INICIALIZAÇÃO ----------------
document.addEventListener("DOMContentLoaded", () => {
    // Remove resumo do endereço ao carregar página
    const div = document.getElementById("resumo-endereco");
    if (div) div.remove();

    renderCart();

    // Botões de pagamento
    document.querySelectorAll(".pay-button").forEach(btn => {
        btn.addEventListener("click", () => checkout(btn.dataset.method));
    });

    // Botão ir para endereço
    document.getElementById("btn-endereco").addEventListener("click", () => {
        sessionStorage.setItem("showAddress", "true"); // indica que deve aparecer ao voltar
        window.location.href = "endereco.html";
    });

    // Botão voltar para loja
    document.getElementById("back-to-store").addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
