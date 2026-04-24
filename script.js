// Data Menu Warkop (10+ menu)
const menuData = [
    { id: 1, name: "Kopi Hitam Tubruk", price: 5000, category: "kopi", image: "https://images.unsplash.com/photo-1494314671902-399b18174975?w=400", desc: "Kopi hitam tubruk asli" },
    { id: 2, name: "Kopi Susu Gula Aren", price: 7000, category: "kopi", image: "https://images.unsplash.com/photo-1577968897966-f97b70901b4b?w=400", desc: "Kopi susu manis legit" },
    { id: 3, name: "Nasi Goreng Spesial", price: 15000, category: "makanan", image: "https://images.unsplash.com/photo-1541599468178-0b64063fd727?w=400", desc: "Nasi goreng kampung pedas" },
    { id: 4, name: "Mie Goreng Jumbo", price: 12000, category: "makanan", image: "https://images.unsplash.com/photo-1588166524941-3bf61a3ce9b2?w=400", desc: "Mie goreng porsi besar" },
    { id: 5, name: "Es Teh Manis", price: 4000, category: "minuman", image: "https://images.unsplash.com/photo-1621396451951-6f3e92e79366?w=400", desc: "Es teh manis dingin" },
    { id: 6, name: "Jus Jeruk Segar", price: 8000, category: "minuman", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c119a55?w=400", desc: "Jus jeruk fresh" },
    { id: 7, name: "Kopi Arabika Premium", price: 12000, category: "kopi", image: "https://images.unsplash.com/photo-1512568400610-42fe6036961c?w=400", desc: "Kopi arabika pilihan" },
    { id: 8, name: "Ayam Bakar Kecap", price: 20000, category: "makanan", image: "https://images.unsplash.com/photo-1591195853828-375f2bd91350?w=400", desc: "Ayam bakar pedas manis" },
    { id: 9, name: "Pisang Goreng Madu", price: 5000, category: "makanan", image: "https://images.unsplash.com/photo-1587349812411-2f0c72d44315?w=400", desc: "Pisang goreng topping madu" },
    { id: 10, name: "Es Kopi Susu", price: 9000, category: "minuman", image: "https://images.unsplash.com/photo-1572448804205-745d375e2a21?w=400", desc: "Es kopi susu gula aren" },
    { id: 11, name: "Roti Bakar Coklat", price: 8000, category: "makanan", image: "https://images.unsplash.com/photo-1542994983-9b54f4e41217?w=400", desc: "Roti bakar coklat keju" }
];

let cart = [];

// Render Menu
function renderMenu(menuItems = menuData) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-card" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}" class="menu-image" 
                 onerror="this.src='https://via.placeholder.com/320x220/1a1a2e/ffc107?text=${item.name.replace(/ /g,'+')}'">
            <h3 class="menu-name">${item.name}</h3>
            <p class="menu-price">Rp ${item.price.toLocaleString()}</p>
            <p class="menu-desc">${item.desc}</p>
            <button class="btn-order" onclick="addToCart(${item.id})">
                🛒 Pesan (Rp ${item.price.toLocaleString()})
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
    showNotification(`✅ ${item.name} ditambahkan! (${item.quantity}x)`);
}

// Update Cart UI (Header)
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    totalPrice.textContent = `Rp ${total.toLocaleString()}`;
}

// Cart Modal Functions
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(248,249,250,0.7);">
                <div style="font-size: 3rem; margin-bottom: 20px;">🛒</div>
                <p style="font-size: 1.3rem; margin-bottom: 10px;">Keranjang kosong</p>
                <small>Pilih menu favoritmu di atas!</small>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div style="flex: 1;">
                    <strong style="font-size: 1.1rem;">${item.name}</strong><br>
                    <small style="color: rgba(248,249,250,0.7);">Rp ${item.price.toLocaleString()} × ${item.quantity}</small><br>
                    <small style="color: #ffc107; font-weight: 700;">Rp ${(item.price * item.quantity).toLocaleString()}</small>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button onclick="changeQuantity(${item.id}, -1)" 
                            style="background: #6c757d; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.3rem; font-weight: bold;">−</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 700; font-size: 1.2rem; color: #ffc107;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" 
                            style="background: linear-gradient(45deg, #ffc107, #ff8c42); color: #1a1a2e; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.3rem; font-weight: bold;">+</button>
                    <button onclick="removeFromCart(${item.id})" 
                            style="background: #dc3545; color: white; border: none; padding: 10px 18px; border-radius: 25px; cursor: pointer; font-size: 1rem;">🗑️ Hapus</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
}

function changeQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
            renderCartItems();
            showNotification(`${item.name}: ${item.quantity}x`);
        }
    }
}

function removeFromCart(itemId) {
    const itemName = cart.find(item => item.id === itemId)?.name;
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    renderCartItems();
    showNotification(`🗑️ ${itemName} dihapus`);
}

// Checkout & Payment
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang kosong! Pilih menu dulu', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showPaymentModal(total);
}

function showPaymentModal(total) {
    document.getElementById('cartModal').style.display = 'none';
    
    const paymentModal = document.createElement('div');
    paymentModal.id = 'paymentModal';
    paymentModal.className = 'modal payment-modal';
    paymentModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>💳 Pilih Pembayaran</h2>
                <span class="close" onclick="closePaymentModal()">&times;</span>
            </div>
            <div class="payment-options">
                <div class="payment-method active" onclick="selectPayment('transfer', this)">
                    <div class="payment-icon">🏦</div>
                    <div class="payment-title">Transfer Bank</div>
                    <div class="bank-details">
                        <strong style="color: #ffc107; font-size: 1.1rem;">BNI</strong><br>
                        <strong style="font-size: 1.6rem; font-family: monospace;">284027212</strong><br>
                        <small style="color: rgba(248,249,250,0.8);">a/n WARKOP DIGITAL</small>
                    </div>
                </div>
                <div class="payment-method" onclick="selectPayment('qris', this)">
                    <div class="payment-icon">📱</div>
                    <div class="payment-title">QRIS</div>
                    <div style="color: #6c757d; font-style: italic;">Coming Soon</div>
                </div>
                <div class="payment-method" onclick="selectPayment('cash', this)">
                    <div class="payment-icon">💵</div>
                    <div class="payment-title">Cash</div>
                    <div style="color: #ffc107;">Bayar ke pelayan</div>
                </div>
            </div>
            <div class="cart-total" style="font-size: 1.6rem; padding: 25px;">
                <strong>Total Bayar: <span style="color: #ffc107; font-size: 1.8rem;">Rp ${total.toLocaleString()}</span></strong>
            </div>
            <button class="btn-checkout" onclick="confirmPayment(${total})">
                ✅ Konfirmasi Pesanan
            </button>
        </div>
    `;
    
    document.body.appendChild(paymentModal);
}

function selectPayment(method, element) {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
    element.classList.add('active');
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.remove();
}

function confirmPayment(total) {
    const activeMethod = document.querySelector('.payment-method.active .payment-title').textContent;
    
    if (activeMethod === 'Transfer Bank') {
        navigator.clipboard.writeText('284027212').then(() => {
            showNotification(`✅ Pesanan diterima!\nBNI 284027212 DI-COPY!\nTotal: Rp ${total.toLocaleString()}`, 'success');
        }).catch(() => {
            showNotification(`✅ Pesanan diterima!\nTransfer ke BNI 284027212\nTotal: Rp ${total.toLocaleString()}`, 'success');
        });
    } else {
        showNotification(`✅ Pesanan diterima!\n${activeMethod}\nTotal: Rp ${total.toLocaleString()}`, 'success');
    }
    
    cart = [];
    updateCartUI();
    closePaymentModal();
}

// Category Filter & Search
document.addEventListener('DOMContentLoaded', function() {
    // Categories
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

    // Cart events
    document.querySelector('.cart-icon').addEventListener('click', () => {
        document.getElementById('cartModal').style.display = 'block';
        renderCartItems();
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('cartModal').style.display = 'none';
    });
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#dc3545' : '#28a745';
    
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        background: linear-gradient(45deg, ${bgColor}, ${type === 'error' ? '#ff6b6b' : '#20c997'});
        color: white; padding: 20px 30px; border-radius: 20px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.4); z-index: 10000;
        animation: slideIn 0.4s ease; font-weight: 600; max-width: 400px;
        line-height: 1.4; font-size: 1rem;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

// Close modals on
