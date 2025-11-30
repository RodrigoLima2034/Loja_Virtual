document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("endereco-form");
    const backBtn = document.getElementById("back-to-cart");

    // Voltar para carrinho
    backBtn.addEventListener("click", () => {
        window.location.href = "carrinho.html";
    });

    // Limpa o formulário
    form.reset();

    // Preencher formulário caso endereço já exista
    const enderecoSalvo = JSON.parse(localStorage.getItem("endereco") || "{}");
    if (enderecoSalvo && Object.keys(enderecoSalvo).length > 0) {
        document.getElementById("nome").value = enderecoSalvo.nome || "";
        document.getElementById("cep").value = enderecoSalvo.cep || "";
        document.getElementById("rua").value = enderecoSalvo.rua || "";
        document.getElementById("numero").value = enderecoSalvo.numero || "";
        document.getElementById("bairro").value = enderecoSalvo.bairro || "";
        document.getElementById("cidade").value = enderecoSalvo.cidade || "";
        document.getElementById("estado").value = enderecoSalvo.estado || "";
    }

    // Salvar endereço
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const endereco = {
            nome: document.getElementById("nome").value,
            cep: document.getElementById("cep").value,
            rua: document.getElementById("rua").value,
            numero: document.getElementById("numero").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value
        };

        localStorage.setItem("endereco", JSON.stringify(endereco));
        form.reset();
        setTimeout(() => window.location.href = "carrinho.html", 200);
    });

    // Autopreenchimento ViaCEP
    const cepInput = document.getElementById("cep");
    cepInput.addEventListener("blur", () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            alert("CEP inválido! Deve conter 8 números.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert("CEP não encontrado!");
                    return;
                }
                document.getElementById("rua").value = data.logradouro || "";
                document.getElementById("bairro").value = data.bairro || "";
                document.getElementById("cidade").value = data.localidade || "";
                document.getElementById("estado").value = data.uf || "";
            })
            .catch(err => {
                console.error("Erro ao buscar CEP:", err);
                alert("Erro ao consultar o CEP. Tente novamente.");
            });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("endereco-form");
    const backBtn = document.getElementById("back-to-cart");

    // Limpa o formulário imediatamente ao carregar a página
    form.reset();

    // Voltar para carrinho
    backBtn.addEventListener("click", () => {
        window.location.href = "carrinho.html";
    });

    // Preencher formulário caso endereço já exista (opcional)
    // Se você quiser que **sempre fique limpo**, comente ou remova essa parte:
    /*
    const enderecoSalvo = JSON.parse(localStorage.getItem("endereco") || "{}");
    if (enderecoSalvo && Object.keys(enderecoSalvo).length > 0) {
        document.getElementById("nome").value = enderecoSalvo.nome || "";
        document.getElementById("cep").value = enderecoSalvo.cep || "";
        document.getElementById("rua").value = enderecoSalvo.rua || "";
        document.getElementById("numero").value = enderecoSalvo.numero || "";
        document.getElementById("bairro").value = enderecoSalvo.bairro || "";
        document.getElementById("cidade").value = enderecoSalvo.cidade || "";
        document.getElementById("estado").value = enderecoSalvo.estado || "";
    }
    */
    
    // ... resto do código permanece igual
});
