const quantityInput = document.getElementById("quantityInput");
const decreaseQty = document.getElementById("decreaseQty");
const increaseQty = document.getElementById("increaseQty");
const addToCartBtn = document.getElementById("addToCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");
const cartMessage = document.getElementById("cartMessage");
let temporaryCart = [];

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    return temporaryCart;
  }
}

function writeCart(cart) {
  temporaryCart = cart;

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    return;
  }
}

function getQuantity() {
  let quantity = Number(quantityInput.value);

  if (!quantity || quantity < 1) {
    quantity = 1;
  }

  if (quantity > 10) {
    quantity = 10;
  }

  quantityInput.value = quantity;
  return quantity;
}

function showMessage(message) {
  cartMessage.textContent = message;
  cartMessage.classList.add("is-visible");

  setTimeout(() => {
    cartMessage.classList.remove("is-visible");
  }, 2500);
}

function saveToCart() {
  const cart = readCart();
  const quantity = getQuantity();
  const product = {
    id: addToCartBtn.dataset.id,
    title: addToCartBtn.dataset.title,
    price: Number(addToCartBtn.dataset.price),
    image: addToCartBtn.dataset.image,
    quantity,
  };

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push(product);
  }

  writeCart(cart);
  return product;
}

decreaseQty.addEventListener("click", () => {
  const quantity = getQuantity();

  if (quantity > 1) {
    quantityInput.value = quantity - 1;
  }
});

increaseQty.addEventListener("click", () => {
  const quantity = getQuantity();

  if (quantity < 10) {
    quantityInput.value = quantity + 1;
  }
});

quantityInput.addEventListener("change", getQuantity);

addToCartBtn.addEventListener("click", () => {
  const product = saveToCart();
  showMessage(`${product.title} added to cart`);
});

buyNowBtn.addEventListener("click", () => {
  const product = saveToCart();
  showMessage(`Ready to buy ${product.title}. Checkout page coming soon.`);
});  