const API_BASE = "http://localhost:8080/api";

let allFoods = [];
let cart = {};

window.onload = function () {
  fetchMenu();
};

async function fetchMenu() {
  try {
    const response = await fetch(`${API_BASE}/food`);
    allFoods = await response.json();
    renderFoods(allFoods);
  } catch (error) {
    document.getElementById("food-grid").innerHTML =
      `<p style="color:red">Could not load menu. Is the backend running?</p>`;
  }
}

function renderFoods(foods) {
  const grid = document.getElementById("food-grid");
  if (foods.length === 0) {
    grid.innerHTML = `<p class="loading">No items found.</p>`;
    return;
  }
  grid.innerHTML = foods.map(food => `
    <div class="food-card">
      <div class="food-emoji">${food.emoji || "🍽️"}</div>
      <div class="food-info">
        <div class="food-name">${food.name}</div>
        <div class="food-desc">${food.description}</div>
        <div class="food-bottom">
          <span class="food-price">₹${food.price}</span>
          <button class="add-btn" onclick="addToCart(${food.id})">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

function filterMenu(category, btn) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("search-input").value = "";
  if (category === "all") {
    renderFoods(allFoods);
  } else {
    const filtered = allFoods.filter(f => f.category === category);
    renderFoods(filtered);
  }
}

function searchFood(query) {
  const filtered = allFoods.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
  renderFoods(filtered);
}

function addToCart(foodId) {
  const food = allFoods.find(f => f.id === foodId);
  if (!food) return;
  if (cart[foodId]) {
    cart[foodId].qty += 1;
  } else {
    cart[foodId] = { item: food, qty: 1 };
  }
  updateCartCount();
}

function changeQty(foodId, delta) {
  if (!cart[foodId]) return;
  cart[foodId].qty += delta;
  if (cart[foodId].qty <= 0) delete cart[foodId];
  renderCartItems();
  updateCartCount();
}

function updateCartCount() {
  const total = Object.values(cart).reduce((sum, c) => sum + c.qty, 0);
  document.getElementById("cart-count").textContent = total;
}

function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  const entries = Object.values(cart);
  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-msg">Your cart is empty</p>`;
    document.getElementById("cart-total").textContent = "₹0";
    return;
  }
  let total = 0;
  container.innerHTML = entries.map(({ item, qty }) => {
    const subtotal = item.price * qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.emoji} ${item.name}</div>
          <div class="cart-item-price">₹${subtotal}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
    `;
  }).join("");
  document.getElementById("cart-total").textContent = `₹${total}`;
}

function showCheckout() {
  if (Object.keys(cart).length === 0) {
    alert("Add some items first!");
    return;
  }
  const entries = Object.values(cart);
  const itemsSummary = entries.map(({ item, qty }) => `${item.name} x${qty}`).join(", ");
  const total = entries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  document.getElementById("modal-items").textContent = itemsSummary;
  document.getElementById("modal-total").textContent = `₹${total}`;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

async function placeOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  if (!name || !address) {
    alert("Please enter your name and address.");
    return;
  }
  const entries = Object.values(cart);
  const itemsSummary = entries.map(({ item, qty }) => `${item.name} x${qty}`).join(", ");
  const total = entries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);

  const order = {
    customerName: name,
    address: address,
    itemsOrdered: itemsSummary,
    totalAmount: total
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    const savedOrder = await response.json();
    alert(`Order placed! Your order ID is #${savedOrder.id} 🎉`);
    cart = {};
    updateCartCount();
    closeModal();
    toggleCart();
  } catch (error) {
    alert("Could not place order. Is the backend running?");
  }
}
function goToPayment() {
  if (Object.keys(cart).length === 0) {
    alert('Add some items first!');
    return;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('allFoods', JSON.stringify(allFoods));
  window.location.href = 'payment.html';
}