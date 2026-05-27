// Bengaluru coordinates
const RESTAURANT_LAT = 12.9716;
const RESTAURANT_LNG = 77.5946;

const DELIVERY_LAT = 12.9352;
const DELIVERY_LNG = 77.6245;

// Get order ID from localStorage
const orderId = localStorage.getItem('lastOrderId') || '1';
document.getElementById('order-id').textContent = orderId;

// Initialize Leaflet Map
const map = L.map('map').setView([12.9534, 77.6096], 13);

// Add map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Restaurant marker
const restaurantIcon = L.divIcon({
    html: '<div style="font-size:28px">🍔</div>',
    iconSize: [30, 30],
    className: ''
});

const restaurantMarker = L.marker([RESTAURANT_LAT, RESTAURANT_LNG], { icon: restaurantIcon })
    .addTo(map)
    .bindPopup('QuickBite Restaurant')
    .openPopup();

// Delivery location marker
const deliveryIcon = L.divIcon({
    html: '<div style="font-size:28px">📍</div>',
    iconSize: [30, 30],
    className: ''
});

L.marker([DELIVERY_LAT, DELIVERY_LNG], { icon: deliveryIcon })
    .addTo(map)
    .bindPopup('Your Location');

// Delivery person marker
const bikeIcon = L.divIcon({
    html: '<div style="font-size:28px">🛵</div>',
    iconSize: [30, 30],
    className: ''
});

let deliveryMarker = L.marker([RESTAURANT_LAT, RESTAURANT_LNG], { icon: bikeIcon })
    .addTo(map)
    .bindPopup('Delivery Partner — Ravi Kumar');

// Draw route line
const routeLine = L.polyline([
    [RESTAURANT_LAT, RESTAURANT_LNG],
    [DELIVERY_LAT, DELIVERY_LNG]
], { color: '#e05a2b', weight: 3, dashArray: '6, 10' }).addTo(map);

// Status update function
function updateStatus(step) {
    // Reset all steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-line').forEach(l => l.classList.remove('active'));

    if (step >= 1) {
        document.getElementById('step-placed').classList.add('active');
        document.getElementById('map-status').textContent = '✅ Order placed successfully!';
        document.getElementById('eta-time').textContent = '30 minutes';
    }
    if (step >= 2) {
        document.getElementById('step-preparing').classList.add('active');
        document.getElementById('line-1').classList.add('active');
        document.getElementById('map-status').textContent = '👨‍🍳 Restaurant is preparing your food...';
        document.getElementById('eta-time').textContent = '20 minutes';
    }
    if (step >= 3) {
        document.getElementById('step-onway').classList.add('active');
        document.getElementById('line-2').classList.add('active');
        document.getElementById('map-status').textContent = '🛵 Delivery partner is on the way!';
        document.getElementById('eta-time').textContent = '10 minutes';
    }
    if (step >= 4) {
        document.getElementById('step-delivered').classList.add('active');
        document.getElementById('line-3').classList.add('active');
        document.getElementById('map-status').textContent = '🎉 Order delivered! Enjoy your food!';
        document.getElementById('eta-time').textContent = 'Delivered!';
    }
}

// Animate delivery marker moving from restaurant to delivery location
function animateDelivery() {
    const steps = 100;
    let currentStep = 0;

    const latDiff = (DELIVERY_LAT - RESTAURANT_LAT) / steps;
    const lngDiff = (DELIVERY_LNG - RESTAURANT_LNG) / steps;

    const interval = setInterval(() => {
        currentStep++;
        const newLat = RESTAURANT_LAT + (latDiff * currentStep);
        const newLng = RESTAURANT_LNG + (lngDiff * currentStep);
        deliveryMarker.setLatLng([newLat, newLng]);

        if (currentStep >= steps) {
            clearInterval(interval);
            updateStatus(4); // Delivered!
        }
    }, 300); // moves every 300ms
}

// Auto update status with timing
updateStatus(1); // Order placed immediately

setTimeout(() => {
    updateStatus(2); // Preparing after 3 seconds
}, 3000);

setTimeout(() => {
    updateStatus(3); // On the way after 6 seconds
    animateDelivery(); // Start moving delivery marker
}, 6000);

// Delivered after animation completes (100 steps x 300ms = 30 seconds)
// animateDelivery handles the delivered status
