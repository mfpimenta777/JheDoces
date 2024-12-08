const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCunter = document.getElementById("cart-count"); // Atualizar o contador
const adressInput = document.getElementById("address"); // Atualizado para 'address'
const adressWarn = document.getElementById("adress-warn");
const sabor = document.getElementById("sabor");
const saborWarn = document.getElementById("sabor-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

// Fechar o modal ao clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o modal ao clicar no botão de fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Evento de clique no menu para adicionar itens ao carrinho
menu.addEventListener("click", function (event) {
    const parentButton = event.target.closest(".add-to-cart-btn"); // Garante que é o botão certo
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        if (name && !isNaN(price)) {
            addToCart(name, price);
        } else {
            console.error("Erro: nome ou preço do produto não definidos.");
        }
    }
});

// Função para adicionar itens ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1; // Se o item já existir, aumenta a quantidade
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal(); // Atualiza o modal do carrinho
    updateCartCounter(); // Atualiza o contador de itens
}

// Atualizar o conteúdo do modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpa o container antes de recriar os itens
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity; // Atualiza o total do carrinho

        // Criação dos elementos do carrinho
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="cart-item flex items-center justify-between mb-4">
                <div class="cart-item-info">
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-from-cart-btn font-bold text-red-500 hover:text-red-700" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Atualiza o total no modal
    cartTotal.textContent = ` ${total.toFixed(2)}`;
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1; // Se a quantidade for maior que 1, apenas diminui a quantidade
        } else {
            cart.splice(index, 1); // Se a quantidade for 1, remove o item completamente
        }

        updateCartModal(); // Atualiza o modal
        updateCartCounter(); // Atualiza o contador
    }
}

// Função para atualizar o contador de itens no carrinho
function updateCartCounter() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0); // Soma as quantidades dos itens
    cartCunter.textContent = totalItems; // Atualiza o texto do contador
}

// Atualiza o contador de itens no carrinho assim que a página carrega
updateCartCounter();

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
})

checkoutBtn.addEventListener("click", function () {
    // Verificar se o carrinho está vazio
    if (cart.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    // Verificar se o endereço está preenchido
    if (adressInput.value.trim() === "") {
        adressWarn.classList.remove("hidden");
        adressInput.classList.add("border-red-500");
    } else {
        adressWarn.classList.add("hidden");
        adressInput.classList.remove("border-red-500");
    }

    // Verificar se o sabor está preenchido
    if (sabor.value.trim() === "") {
        saborWarn.classList.remove("hidden");
        sabor.classList.add("border-red-500");
        return; // Interrompe a execução caso o sabor não esteja preenchido
    } else {
        saborWarn.classList.add("hidden");
        sabor.classList.remove("border-red-500");
    }

    // Se todos os campos estiverem válidos, monta a mensagem e abre o WhatsApp
    const cartItem = cart.map(item => ` ${item.name} (Quantidade: ${item.quantity})`).join(", ");
    const message = encodeURIComponent(`${cartItem}\n\nEndereço: ${adressInput.value}\nSabor: ${sabor.value}`);
    const phone = "45984087311";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});
