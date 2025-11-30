// lista de 20 perfumes (imagens locais)
const produtos = [
    { id: 1, nome: "Eau de Luxe", preco: 349.90, img: "NARC-05-000088.png" },
    { id: 2, nome: "Golden Rose", preco: 420.00, img: "1e81f346d379897206ef69a4a2c3a242.jpg" },
    { id: 3, nome: "Velvet Night", preco: 379.90, img: "11_11_3_349_ScandalJeanPaulGaultierEaudeParfumPerfumeFemininofrasco.webp" },
    { id: 4, nome: "Scent of Paris", preco: 499.00, img: "71CROoaBvlL._AC_UF1000,1000_QL80_.jpg" },
    { id: 5, nome: "Crystal Bloom", preco: 289.90, img: "1952490168.jpg" },
    { id: 6, nome: "Noir Elegance", preco: 429.00, img: "Perfumes-femininos-marcantes-MIOLO-01.jpg" },
    { id: 7, nome: "Amber Whisper", preco: 349.00, img: "3348901708944_01-shelf-mdp.webp" },
    { id: 8, nome: "Rose Atelier", preco: 319.90, img: "download.jpeg" },
    { id: 9, nome: "Silk Essence", preco: 259.90, img: "images.jpeg" },
    { id: 10, nome: "Velour", preco: 199.90, img: "kalanit-o-boticario.webp" },
    { id: 11, nome: "Luna Bloom", preco: 449.90, img: "OsPerfumes-Liz-O-Boticario.webp" },
    { id: 12, nome: "Pure Amber", preco: 379.90, img: "perfume-fiorucci-feminino-100ml_851370.webp" },
    { id: 13, nome: "Jasmine Gold", preco: 389.90, img: "PerfumePadrao1.webp" },
    { id: 14, nome: "Satin Oud", preco: 499.90, img: "Perfumes-femininos-marcantes-MIOLO-01.jpg" },
    { id: 15, nome: "Orchid Mist", preco: 269.90, img: "perfumes-importados-marcas-internacionais-perfume-essencia-maquiagem-perfumes-sensuais-ambar-oriental-beleza-steal-the-look-20220520203344.webp" },
    { id: 16, nome: "Blush & Gold", preco: 339.90, img: "perfumistta-054.webp" },
    { id: 17, nome: "Midnight Silk", preco: 419.90, img: "pexels-photo-1961791.jpeg" },
    { id: 18, nome: "Vanilla Dream", preco: 249.90, img: "photo-1541643600914-78b084683601.jpeg" },
    { id: 19, nome: "Citrus Luxe", preco: 199.90, img: "novoperfume1.webp" },
    { id: 20, nome: "Eternal Bloom", preco: 459.90, img: "novoperfume2.webp" },
];

// CARRINHO
function loadCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    let cart = loadCart();
    let item = cart.find(i => i.id === id);

    if (item) { item.quantity += 2; }
    else {
        cart.push({
            id: produto.id,
            name: produto.nome,
            price: produto.preco,
            image: produto.img,
            quantity: 2
        });
    }

    saveCart(cart);
    window.location.href = "carrinho.html";
}

// RENDERIZA PRODUTOS EM CARROSSEIS DE 5
function renderProdutos() {
    const container = document.getElementById("produtos-lista");
    container.innerHTML = "";

    const chunkSize = 5;
    for (let i = 0; i < produtos.length; i += chunkSize) {
        const chunk = produtos.slice(i, i + chunkSize);
        const wrapper = document.createElement("div");
        wrapper.classList.add("product-carousel-wrapper");

        const carousel = document.createElement("div");
        carousel.classList.add("product-carousel");

        chunk.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <img src="${p.img}" alt="${p.nome}">
                <h3>${p.nome}</h3>
                <p class="price">R$ ${p.preco.toFixed(2)}</p>
                <button class="buy-button" data-id="${p.id}">Comprar</button>
            `;
            carousel.appendChild(card);
        });

        wrapper.appendChild(carousel);
        container.appendChild(wrapper);
    }

    // adiciona eventos de comprar
    document.querySelectorAll(".buy-button").forEach(btn => {
        btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
    });

    // adiciona lightbox
    setupLightbox();
}

function setupLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");

    closeBtn.addEventListener("click", () => { lightbox.style.display = "none"; });
    lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.style.display = "none"; });

    document.querySelectorAll(".product-card img").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = "flex";
        });
    });
}

document.addEventListener("DOMContentLoaded", renderProdutos);
