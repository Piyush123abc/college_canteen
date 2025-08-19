// --------------------
// 🔄 Unchanged Variables
// --------------------
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const menuContainer = document.getElementById('menu');
const cartContainer = document.getElementById('cart');
const totalPriceSpan = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let currentPage = 1;
const pageSize = 5;

// --------------------
// 🆕 Sample Menu with Categories
// --------------------
let menuItems = [
  { id: 1, name: 'Veg Sandwich', description: 'Fresh veggies with tasty sauces', price: 50, type: 'veg', category: 'snacks' },
  { id: 2, name: 'Paneer Tikka', description: 'Spicy grilled paneer cubes', price: 120, type: 'veg', category: 'meals' },
  { id: 3, name: 'French Fries', description: 'Crispy golden fries', price: 40, type: 'veg', category: 'snacks' },
  { id: 4, name: 'Cold Coffee', description: 'Chilled creamy coffee', price: 60, type: 'veg', category: 'drinks' },
  { id: 5, name: 'Chicken Burger', description: 'Juicy chicken patty with sauces', price: 150, type: 'nonveg', category: 'meals' },
  { id: 6, name: 'Chocolate Cake Slice', description: 'Rich chocolate delight', price: 80, type: 'veg', category: 'snacks' },
  { id: 7, name: 'Masala Dosa', description: 'Crispy dosa with spicy potato filling', price: 70, type: 'veg', category: 'meals' },
  { id: 8, name: 'Egg Roll', description: 'Delicious egg roll with spices', price: 90, type: 'nonveg', category: 'snacks' },
];

// --------------------
// 🔄 Cart + Orders
// --------------------
let cart = {};
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// --------------------
// 🔄 Current User
// --------------------
const currentUser = localStorage.getItem('currentUser');
const users = JSON.parse(localStorage.getItem('users')) || {};
let currentRole = users[currentUser]?.role || 'student';

if (!currentUser) {
  window.location.href = 'index.html';
} else {
  userNameSpan.textContent = `Hello, ${currentUser} (${currentRole})`;
  if (currentRole === 'chef') {
    document.getElementById('chef-panel').style.display = 'block';
    document.getElementById('student-cart').style.display = 'none';
  }
}

// --------------------
// 🔄 Logout
// --------------------
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// --------------------
// 🔄 Filters
// --------------------
const searchBox = document.getElementById('search-box');
const categoryFilter = document.getElementById('category-filter');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.getAttribute('data-filter');
    currentPage = 1;
    renderMenu();
  });
});

searchBox.addEventListener('input', () => {
  currentPage = 1;
  renderMenu();
});
categoryFilter.addEventListener('change', () => {
  currentPage = 1;
  renderMenu();
});

// --------------------
// 🔄 Render Menu with Pagination
// --------------------
function renderMenu() {
  menuContainer.innerHTML = '';

  let filteredItems = menuItems;

  if (currentFilter !== 'all') {
    filteredItems = filteredItems.filter(i => i.type === currentFilter);
  }
  if (categoryFilter.value !== 'all') {
    filteredItems = filteredItems.filter(i => i.category === categoryFilter.value);
  }
  if (searchBox.value.trim()) {
    const query = searchBox.value.toLowerCase();
    filteredItems = filteredItems.filter(i => i.name.toLowerCase().includes(query));
  }

  const start = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(start, start + pageSize);

  if (paginatedItems.length === 0) {
    menuContainer.innerHTML = '<p style="text-align:center; color:#bf360c; font-weight:700;">No items available.</p>';
  }

  paginatedItems.forEach(item => {
    const vegIcon = item.type === 'veg' ? '🌿' : '🍗';
    const menuItemDiv = document.createElement('div');
    menuItemDiv.className = 'menu-item';
    menuItemDiv.innerHTML = `
      <h3>${vegIcon} ${item.name}</h3>
      <p>${item.description}</p>
      <div class="price">₹${item.price.toFixed(2)}</div>
      ${currentRole === 'student' ? `<button data-id="${item.id}">Add to Cart</button>` : ''}
    `;
    if (currentRole === 'student') {
      menuItemDiv.querySelector('button').addEventListener('click', () => {
        addToCart(item.id);
      });
    }
    menuContainer.appendChild(menuItemDiv);
  });

  renderPaginationControls(filteredItems.length);
}

function renderPaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return;

  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = i;
      renderMenu();
    });
    paginationDiv.appendChild(btn);
  }

  menuContainer.appendChild(paginationDiv);
}

// --------------------
// 🔄 Cart Functions (Unchanged except order storage)
// --------------------
function addToCart(id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
  renderCart();
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id]--;
    if (cart[id] <= 0) {
      delete cart[id];
    }
    renderCart();
  }
}

function renderCart() {
  cartContainer.innerHTML = '';
  const cartEntries = Object.entries(cart);

  if (cartEntries.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalPriceSpan.textContent = '0.00';
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  cartEntries.forEach(([id, qty]) => {
    const item = menuItems.find(i => i.id === parseInt(id));
    if (!item) return;

    total += item.price * qty;

    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.innerHTML = `
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-qty">x${qty}</span>
      </div>
      <div>
        ₹${(item.price * qty).toFixed(2)}
        <button title="Remove one" data-id="${item.id}">&times;</button>
      </div>
    `;
    cartItemDiv.querySelector('button').addEventListener('click', () => {
      removeFromCart(item.id);
    });

    cartContainer.appendChild(cartItemDiv);
  });

  totalPriceSpan.textContent = total.toFixed(2);
  checkoutBtn.disabled = false;
}

checkoutBtn.addEventListener('click', () => {
  placeOrder();
  cart = {};
  renderCart();
});

// --------------------
// 🆕 Orders System
// --------------------
function placeOrder() {
  const newOrder = {
    id: Date.now(),
    user: currentUser,
    items: { ...cart },
    status: 'PENDING'
  };
  orders.unshift(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  alert('Order placed! Thank you for your purchase.');
}

function viewLatestOrders() {
  const ordersDiv = document.getElementById('orders-list');
  ordersDiv.innerHTML = '';

  const latest = orders.slice(0, 10);
  if (latest.length === 0) {
    ordersDiv.innerHTML = '<p>No recent orders.</p>';
    return;
  }

  latest.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <p><b>User:</b> ${order.user} | <b>Status:</b> ${order.status}</p>
      <ul>
        ${Object.entries(order.items).map(([id, qty]) => {
          const item = menuItems.find(i => i.id === parseInt(id));
          return `<li>${item?.name || 'Item'} x${qty}</li>`;
        }).join('')}
      </ul>
      <select data-id="${order.id}">
        <option ${order.status==='PENDING'?'selected':''}>PENDING</option>
        <option ${order.status==='COMPLETED'?'selected':''}>COMPLETED</option>
        <option ${order.status==='CANCELLED'?'selected':''}>CANCELLED</option>
      </select>
    `;
    div.querySelector('select').addEventListener('change', (e) => {
      updateOrderStatus(order.id, e.target.value);
    });
    ordersDiv.appendChild(div);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders));
    viewLatestOrders();
  }
}

// --------------------
// 🆕 Chef: Add Menu Item
// --------------------
const addItemBtn = document.getElementById('add-item-btn');
if (addItemBtn) {
  addItemBtn.addEventListener('click', () => {
    const name = document.getElementById('new-item-name').value.trim();
    const desc = document.getElementById('new-item-desc').value.trim();
    const price = parseFloat(document.getElementById('new-item-price').value);
    const type = document.getElementById('new-item-type').value;
    const category = document.getElementById('new-item-category').value;

    if (!name || !desc || isNaN(price)) {
      alert('Please fill all fields correctly');
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      description: desc,
      price,
      type,
      category
    };
    menuItems.push(newItem);
    renderMenu();
    alert('Item added successfully!');
  });
}

// --------------------
// 🔄 Initial Render
// --------------------
renderMenu();
renderCart();
if (currentRole === 'chef') viewLatestOrders();
