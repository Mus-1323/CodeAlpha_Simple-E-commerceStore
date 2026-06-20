const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function showCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: Rs. 0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="card mb-3 p-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" width="90" height="90" style="object-fit: cover;">
          <div class="flex-grow-1">
            <h5>${item.title}</h5>
            <p class="mb-1">Price: Rs. ${item.price}</p>
            <p class="mb-1">Quantity: ${item.quantity}</p>
            <p class="mb-1">Subtotal: Rs. ${item.price * item.quantity}</p>
          </div>
          <button class="btn btn-danger" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = "Total: Rs. " + total;
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

showCart();