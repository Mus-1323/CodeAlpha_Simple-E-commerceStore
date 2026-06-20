const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");
const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

function showOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  orderItems.innerHTML = "";

  if (cart.length === 0) {
    orderItems.innerHTML = "<p>No items in order.</p>";
    orderTotal.textContent = "Total: Rs. 0";
    return;
  }

  let totalAmount = 0;

  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;

    orderItems.innerHTML += `
      <div class="card mb-3 p-3">
        <h5>${item.title}</h5>
        <p>Price: Rs. ${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: Rs. ${item.price * item.quantity}</p>
      </div>
    `;
  });

  orderTotal.textContent = "Total: Rs. " + totalAmount;
}

showOrderSummary();

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    orderMessage.textContent = "Cart is empty.";
    return;
  }

  let totalAmount = 0;

  cart.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  const orderData = {
    items: cart.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
    totalAmount,
    customerName: document.getElementById("customerName").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
  };

  const response = await fetch("/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();

  if (result.success) {
    localStorage.removeItem("cart");
    orderMessage.textContent = "Order placed successfully!";
    orderItems.innerHTML = "<p>Order placed successfully.</p>";
orderTotal.textContent = "Total: Rs. 0";
orderForm.reset();
  }
});