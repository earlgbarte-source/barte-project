const products = [
  {id:1,name:"Beef Ribeye Steak",category:"Beef",price:485,unit:"per 500 g",tag:"BEST SELLER",desc:"Rich, tender cut for pan-searing.",image:"https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Ground Beef",category:"Beef",price:220,unit:"per 500 g",tag:"EVERYDAY PICK",desc:"Versatile for burgers, pasta, and more.",image:"https://images.unsplash.com/photo-1588347818036-3c5f8f2d3d4f?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Pork Belly",category:"Pork",price:195,unit:"per 500 g",tag:"FAMILY FAVORITE",desc:"A flavorful choice for roasting or grilling.",image:"https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Pork Chops",category:"Pork",price:185,unit:"per 500 g",tag:"EASY COOK",desc:"Classic chops for a satisfying dinner.",image:"https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Chicken Breast",category:"Chicken",price:165,unit:"per 500 g",tag:"LEAN PICK",desc:"A versatile staple for weekday meals.",image:"https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Chicken Drumsticks",category:"Chicken",price:125,unit:"per 500 g",tag:"GREAT VALUE",desc:"Perfect for baking, frying, or grilling.",image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Fresh Salmon",category:"Seafood",price:360,unit:"per 500 g",tag:"SPECIAL PICK",desc:"A delicious option for a simple dinner.",image:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Pork Sausages",category:"Pork",price:175,unit:"per 500 g",tag:"QUICK MEAL",desc:"Easy to cook for breakfast or barbecue.",image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"}
];

const money = amount => new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(amount);
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotal = document.getElementById("subtotal");
const toast = document.getElementById("toast");
let activeCategory = "All";
let cart = [];
let toastTimer;

function renderProducts() {
  if (!productGrid) return;
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const visible = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query))
  );
  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x600/f0eae2/922222?text=Prime+Cut'">
        <span class="product-tag">${p.tag}</span>
        <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3>${p.name}</h3><span class="product-price">${money(p.price)}</span></div>
        <p class="product-meta">${p.category} · ${p.unit}</p>
      </div>
    </article>`).join("");
  if (emptyState) emptyState.hidden = visible.length > 0;
  productGrid.hidden = visible.length === 0;
  if (resultCount) resultCount.textContent = `${visible.length} ${visible.length === 1 ? "product" : "products"}`;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function addToCart(id) {
  const item = cart.find(entry => entry.id === id);
  if (item) item.qty++;
  else cart.push({id, qty:1});
  renderCart();
  showToast(`${products.find(p => p.id === id).name} added to basket`);
}

function changeQty(id, delta) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(entry => entry.id !== id);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(entry => entry.id !== id);
  renderCart();
  showToast("Item removed from basket");
}

function renderCart() {
  if (!cartCount || !subtotal || !cartItems) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
  cartCount.textContent = count;
  subtotal.textContent = money(total);
  if (!cart.length) {
    cartItems.innerHTML = `<div class="cart-empty"><span>🛒</span><h3>Your basket is empty</h3><p>Add some fresh picks to get started.</p></div>`;
    return;
  }
  cartItems.innerHTML = cart.map(item => {
    const p = products.find(product => product.id === item.id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="">
      <div><h3>${p.name}</h3><p class="item-price">${money(p.price)} · ${p.unit}</p>
        <div class="quantity-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div>
      </div>
      <button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button>
    </div>`;
  }).join("");
}

function openCart() {
  if (!cartOverlay) return;
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  const closeBtn = document.getElementById("closeCart");
  if (closeBtn) closeBtn.focus();
}
function closeCart() {
  if (!cartOverlay) return;
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  const openBtn = document.getElementById("openCart");
  if (openBtn) openBtn.focus();
}

if (productGrid) {
  productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(Number(button.dataset.add));
  });
}
if (filters) {
  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter === button));
    renderProducts();
  });
}
if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}
const resetSearchBtn = document.getElementById("resetSearch");
if (resetSearchBtn) {
  resetSearchBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    activeCategory = "All";
    if (filters) filters.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter.dataset.category === "All"));
    renderProducts();
  });
}
if (cartItems) {
  cartItems.addEventListener("click", event => {
    const qty = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (qty) changeQty(Number(qty.dataset.qty), Number(qty.dataset.delta));
    if (remove) removeFromCart(Number(remove.dataset.remove));
  });
}
const openCartBtn = document.getElementById("openCart");
if (openCartBtn) openCartBtn.addEventListener("click", openCart);

const closeCartBtn = document.getElementById("closeCart");
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);

const closeBackdropBtn = document.getElementById("closeBackdrop");
if (closeBackdropBtn) closeBackdropBtn.addEventListener("click", closeCart);

document.addEventListener("keydown", event => { if (event.key === "Escape" && cartOverlay && !cartOverlay.hidden) closeCart(); });

const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) { showToast("Your basket is empty"); return; }
    const summary = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `${p.name} x${item.qty} (${money(p.price * item.qty)})`;
    }).join("\n");
    const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
    alert(`ORDER REQUEST DEMO\n\n${summary}\n\nSubtotal: ${money(total)}\n\nThis is a demo website. Connect a real order system to accept orders.`);
  });
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
}
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  if (mainNav) mainNav.classList.remove("open");
}));

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderProducts();
renderCart();