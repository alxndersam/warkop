class WarkopPOS {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('warkopOrders')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        if (window.location.pathname.includes('kasir.html')) {
            this.initKasir();
        } else if (window.location.pathname.includes('audit.html')) {
            this.initAudit();
        } else {
            this.initCustomer();
        }
    }

    // ================= CUSTOMER =================
    initCustomer() {
        this.menu = [
            { name: "Kopi Hitam", price: 10000, category: "kopi", img: "https://via.placeholder.com/300" },
            { name: "Es Teh", price: 5000, category: "minuman", img: "https://via.placeholder.com/300" },
            { name: "Indomie Goreng", price: 12000, category: "makanan", img: "https://via.placeholder.com/300" }
        ];

        this.renderMenu(this.menu);
        this.updateCartUI();

        document.getElementById("searchInput")?.addEventListener("input", (e) => {
            let val = e.target.value.toLowerCase();
            let filtered = this.menu.filter(m => m.name.toLowerCase().includes(val));
            this.renderMenu(filtered);
        });

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let cat = btn.dataset.category;
                let filtered = cat === "all" ? this.menu : this.menu.filter(m => m.category === cat);
                this.renderMenu(filtered);
            });
        });

        document.querySelector('.cart-icon')?.addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'block';
            this.renderCart();
        });

        document.getElementById("closeModal")?.addEventListener("click", () => {
            document.getElementById('cartModal').style.display = 'none';
        });
    }

    renderMenu(data) {
        let container = document.getElementById("menuGrid");
        if (!container) return;

        container.innerHTML = "";

        data.forEach(item => {
            container.innerHTML += `
                <div class="menu-card">
                    <img src="${item.img}" class="menu-image">
                    <div class="menu-name">${item.name}</div>
                    <div class="menu-price">Rp ${item.price}</div>
                    <button class="btn-order" onclick="app.addToCart('${item.name}', ${item.price})">Pesan</button>
                </div>
            `;
        });
    }

    addToCart(name, price) {
        let existing = this.cart.find(i => i.name === name);
        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({ name, price, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.updateCartUI();
    }

    updateCartUI() {
        let count = document.getElementById("cartCount");
        let total = document.getElementById("totalPrice");

        let totalQty = this.cart.reduce((a, b) => a + b.qty, 0);
        let totalPrice = this.cart.reduce((a, b) => a + b.qty * b.price, 0);

        if (count) count.textContent = totalQty;
        if (total) total.textContent = "Rp " + totalPrice;
    }

    renderCart() {
        let container = document.getElementById("cartItems");
        let totalEl = document.getElementById("cartTotal");

        container.innerHTML = "";

        let total = 0;

        this.cart.forEach(item => {
            total += item.qty * item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} x${item.qty}</span>
                    <span>Rp ${item.qty * item.price}</span>
                </div>
            `;
        });

        totalEl.textContent = "Rp " + total;
    }

    checkout() {
        if (this.cart.length === 0) return alert("Keranjang kosong!");

        let total = this.cart.reduce((a, b) => a + b.qty * b.price, 0);

        let newOrder = {
            id: Date.now(),
            items: this.cart,
            total,
            status: "pending",
            date: new Date().toISOString()
        };

        this.orders.push(newOrder);

        localStorage.setItem("warkopOrders", JSON.stringify(this.orders));
        localStorage.removeItem("cart");

        alert("Pesanan masuk!");
        location.reload();
    }

    // ================= KASIR =================
    initKasir() {
        this.loadOrders();
        this.updateStats();
    }

    loadOrders() {
        let container = document.getElementById("pendingOrders");
        let count = document.getElementById("pendingCount");

        let pending = this.orders.filter(o => o.status !== "complete");

        count.textContent = pending.length;

        if (pending.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>Tidak ada pesanan</h3></div>`;
            return;
        }

        container.innerHTML = "";

        pending.forEach(o => {
            container.innerHTML += `
                <div class="order-card ${o.status}">
                    <div class="order-status"> ${o.status} </div>
                    <h3>#${o.id}</h3>
                    <p>${new Date(o.date).toLocaleString()}</p>
                    ${o.items.map(i => `
                        <div class="order-item">
                            <span>${i.name} x${i.qty}</span>
                            <span>Rp ${i.price * i.qty}</span>
                        </div>
                    `).join("")}
                    <strong>Total: Rp ${o.total}</strong>
                    ${
                        o.status === "pending"
                        ? `<button class="btn-serve" onclick="app.updateStatus(${o.id}, 'served')">Sajikan</button>`
                        : `<button class="btn-complete" onclick="app.updateStatus(${o.id}, 'complete')">Selesai</button>`
                    }
                </div>
            `;
        });
    }

    updateStatus(id, status) {
        this.orders = this.orders.map(o => {
            if (o.id === id) o.status = status;
            return o;
        });

        localStorage.setItem("warkopOrders", JSON.stringify(this.orders));
        this.loadOrders();
        this.updateStats();
    }

    updateStats() {
        let today = new Date().toDateString();

        let todayOrders = this.orders.filter(o => new Date(o.date).toDateString() === today);

        let total = todayOrders.reduce((a, b) => a + b.total, 0);

        document.getElementById("totalToday").textContent = "Rp " + total;
        document.getElementById("ordersToday").textContent = todayOrders.length;
    }

    // ================= AUDIT =================
    initAudit() {
        this.renderAudit(this.orders);
    }

    renderAudit(data) {
        let container = document.getElementById("auditOrders");

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state">Belum ada transaksi</div>`;
            return;
        }

        container.innerHTML = "";

        data.forEach(o => {
            container.innerHTML += `
                <div class="order-card">
                    <h3>#${o.id}</h3>
                    <p>${new Date(o.date).toLocaleString()}</p>
                    <p>Status: ${o.status}</p>
                    <strong>Total: Rp ${o.total}</strong>
                </div>
            `;
        });
    }
}

// GLOBAL
const app = new WarkopPOS();

// biar tombol HTML bisa akses
function checkout() { app.checkout(); }
