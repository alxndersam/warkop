// POS System - Customer + Kasir + Audit
class WarkopPOS {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('warkopOrders')) || [];
        this.auditLog = JSON.parse(localStorage.getItem('warkopAudit')) || [];
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

    // CUSTOMER MODE (index.html)
    initCustomer() {
        renderMenu();
        updateCartUI();
        
        // Event listeners
        document.querySelector('.cart-icon')?.addEventListener('click', () => {
            document.getElementById('cartModal').style.display = 'block';
            renderCartItems();
        });

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll
