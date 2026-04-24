// Data Menu Warkop
const menuData = [
    { id: 1, name: "Kopi Hitam", price: 5000, category: "kopi", image: "https://images.unsplash.com/photo-1494314671902-399b18174975?w=400", desc: "Kopi hitam tubruk asli" },
    { id: 2, name: "Kopi Susu", price: 7000, category: "kopi", image: "https://images.unsplash.com/photo-1577968897966-f97b70901b4b?w=400", desc: "Kopi susu gula aren" },
    { id: 3, name: "Nasi Goreng Spesial", price: 15000, category: "makanan", image: "https://images.unsplash.com/photo-1541599468178-0b64063fd727?w=400", desc: "Nasi goreng kampung pedas" },
    { id: 4, name: "Mie Goreng", price: 12000, category: "makanan", image: "https://images.unsplash.com/photo-1588166524941-3bf61a3ce9b2?w=400", desc: "Mie goreng jumbo" },
    { id: 5, name: "Es Teh Manis", price: 4000, category: "minuman", image: "https://images.unsplash.com/photo-1621396451951-6f3e92e79366?w=400", desc: "Es teh manis dingin" },
    { id: 6, name: "Jus Jeruk", price: 8000, category: "minuman", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c119a55?w=400", desc: "Jus jeruk segar" },
    { id: 7, name: "Kopi Arabika", price: 12000, category: "kopi", image: "https://images.unsplash.com/photo-1512568400610-42fe6036961c?w=400", desc: "Kopi arabika premium" },
    { id: 8, name: "Ayam Bakar", price: 20000, category: "makanan", image: "https://images.unsplash.com/photo-1591195853828-375f2bd91350?w=400", desc: "Ayam bakar kecap pedas" }
];

let cart = [];

// Render Menu
function renderMenu(menuItems = menuData) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-card" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}" class="menu-image">
            <h3 class="menu-name">${item.name}</h3>
            <p class="menu-price">Rp ${item.price.toLocaleString()}</p>
            <p class="menu-desc">${item.desc}</p>
            <button class="btn-order" onclick="addToCart(${item.id})">
                🛒 Pesan Sekarang
            </button>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(itemId) {
    const item = menuData.find(menu => menu.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`${item.name} ditambahkan ke keranjang!`);
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    totalPrice.textContent = `Rp ${total.toLocaleString()}`;
}

// Show Cart Modal
document.querySelector('.cart-icon').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'block';
    renderCartItems();
});

// Close Modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('cartModal')) {
        document.getElementById('cartModal').style.display = 'none';
    }
});

// Render Cart Items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Keranjang kosong 😢</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Rp ${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <div>
                    <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Hapus</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    renderCartItems();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Pesanan diterima! Total: Rp ${total.toLocaleString()}\nSilakan tunggu pelayan datang ya! 😊`);
    cart = [];
    updateCartUI();
    document.getElementById('cartModal').style.display = 'none';
}

// Category Filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        const filteredMenu = category === 'all' ? menuData : menuData.filter(item => item.category === category);
        renderMenu(filteredMenu);
    });
});

// Search
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMenu = menuData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.desc.toLowerCase().includes(searchTerm)
    );
    renderMenu(filteredMenu);
});

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initial render
renderMenu();
