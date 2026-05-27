// Get cart and total from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || {};
const foods = JSON.parse(localStorage.getItem('allFoods')) || [];

// Calculate total
let subtotal = 0;
const orderItemsEl = document.getElementById('order-items');

Object.values(cart).forEach(({ item, qty }) => {
    const sub = item.price * qty;
    subtotal += sub;
    orderItemsEl.innerHTML += `
        <div class="order-item">
            <span>${item.emoji} ${item.name} x${qty}</span>
            <span>₹${sub}</span>
        </div>`;
});

const total = subtotal + 30; // 30 = delivery charge
document.getElementById('total-amount').textContent = '₹' + total;

// Update all pay amount spans
document.querySelectorAll('.pay-amount').forEach(el => {
    el.textContent = '₹' + total;
});

// Show selected payment method
function showMethod(method, btn) {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['upi', 'card', 'netbank', 'cod'].forEach(m => {
        document.getElementById(m + '-section').style.display = 'none';
    });
    document.getElementById(method + '-section').style.display = 'block';
}

// Format card number
function formatCard(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

// Verify UPI
function verifyUPI() {
    const id = document.getElementById('upi-id').value.trim();
    if (!id) {
        alert('Please enter your UPI ID!');
        return;
    }
    alert('UPI ID verified! Click Pay to proceed.');
}

// Place order and show success
async function payNow(method) {
    const customerName = localStorage.getItem('loggedInUser') || 'Customer';
    const address = localStorage.getItem('deliveryAddress') || 'Bengaluru';

    const entries = Object.values(cart);
    const itemsSummary = entries.map(({ item, qty }) => `${item.name} x${qty}`).join(', ');

    // Send order to Spring Boot backend
    const order = {
        customerName: customerName,
        address: address,
        itemsOrdered: itemsSummary,
        totalAmount: total
    };

    try {
        const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        const savedOrder = await response.json();

        // Save order ID for tracking page
        localStorage.setItem('lastOrderId', savedOrder.id);

        // Show success page
        document.getElementById('pay-wrap').style.display = 'none';
        const sw = document.getElementById('success-wrap');
        sw.style.display = 'flex';
        document.getElementById('oid').textContent = savedOrder.id;

        if (method === 'Cash on Delivery') {
            document.getElementById('success-msg').textContent =
                'Your order is confirmed! Pay ₹' + total + ' cash on delivery.';
        } else {
            document.getElementById('success-msg').textContent =
                'Payment of ₹' + total + ' via ' + method + ' was successful!';
        }

        // Clear cart
        localStorage.removeItem('cart');

    } catch (error) {
        alert('Could not place order. Is the backend running?');
    }
}
