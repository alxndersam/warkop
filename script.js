import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= CART =================
let cart = [];

window.addToCart = function(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  updateUI();
};

function updateUI() {
  let count = document.getElementById("cartCount");
  let total = document.getElementById("totalPrice");

  let totalQty = cart.reduce((a, b) => a + b.qty, 0);
  let totalPrice = cart.reduce((a, b) => a + b.qty * b.price, 0);

  if (count) count.textContent = totalQty;
  if (total) total.textContent = totalPrice;
}

// ================= CHECKOUT =================
window.checkout = async function() {
  if (cart.length === 0) return alert("Keranjang kosong!");

  let total = cart.reduce((a, b) => a + b.qty * b.price, 0);

  await addDoc(collection(db, "orders"), {
    items: cart,
    total,
    status: "pending",
    createdAt: new Date()
  });

  cart = [];
  updateUI();
  alert("Pesanan masuk!");
};

// ================= KASIR =================
function loadKasir() {
  let container = document.getElementById("pendingOrders");

  onSnapshot(collection(db, "orders"), snapshot => {
    container.innerHTML = "";

    snapshot.forEach(docSnap => {
      let o = docSnap.data();
      let id = docSnap.id;

      container.innerHTML += `
        <div style="border:1px solid white;margin:10px;padding:10px;">
          <h3>${id}</h3>
          <p>Status: ${o.status}</p>
          <p>Total: Rp ${o.total}</p>

          <button onclick="updateStatus('${id}','served')">Sajikan</button>
          <button onclick="updateStatus('${id}','complete')">Selesai</button>
        </div>
      `;
    });
  });
}

// ================= UPDATE STATUS =================
window.updateStatus = async function(id, status) {
  await updateDoc(doc(db, "orders", id), {
    status: status
  });
};

// ================= AUDIT =================
function loadAudit() {
  let container = document.getElementById("auditOrders");

  onSnapshot(collection(db, "orders"), snapshot => {
    container.innerHTML = "";

    snapshot.forEach(docSnap => {
      let o = docSnap.data();

      container.innerHTML += `
        <div style="border:1px solid white;margin:10px;padding:10px;">
          <h3>${docSnap.id}</h3>
          <p>${o.status}</p>
          <p>Rp ${o.total}</p>
        </div>
      `;
    });
  });
}

// ================= AUTO LOAD =================
if (window.location.pathname.includes("kasir")) {
  loadKasir();
}

if (window.location.pathname.includes("audit")) {
  loadAudit();
}
