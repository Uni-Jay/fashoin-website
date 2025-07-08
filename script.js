// Initial default products if not present// 
if (!localStorage.getItem("products")) {
  const products = [
    { name: "Denim Jacket", price: "49.99", category: "men", image: "download.jpeg" },
    { name: "Snickers", price: "29.99", category: "women", image: "domino-studio-164_6wVEHfI-unsplash.jpg" },
    { name: "Boots", price: "39.99", category: "sales", image: "paul-gaudriault-a-QH9MAAVNI-unsplash.jpg" }
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

function showSection(section) {
  ["products", "cart", "product-form"].forEach(id => {
    document.getElementById(`${id}-section`).style.display = id === section ? 'block' : 'none';
  });
  if (section === "cart") renderCart();
}

function renderProducts() {
  const category = document.getElementById("category-filter").value;
  const query = document.getElementById("search-input").value.toLowerCase();
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach((product, i) => {
    if ((category === "" || product.category === category) && product.name.toLowerCase().includes(query)) {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="images/${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <p><small>${product.category}</small></p>
        <button onclick="addToCart(${i})">Add to Cart</button>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Delete</button>
      `;
      list.appendChild(div);
    }
  });
}

function addToCart(index) {
  const products = JSON.parse(localStorage.getItem("products"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartDiv = document.getElementById("cart-items");
  cartDiv.innerHTML = "";

  if (cartItems.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="images/${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
      <button onclick="removeFromCart(${i})">Remove</button>
    `;
    cartDiv.appendChild(div);
  });
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.length;
}

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem("products"));
  const product = products[index];
  localStorage.setItem("editProduct", JSON.stringify({ ...product, index }));
  fillForm();
  showSection('product-form');
}

function deleteProduct(index) {
  if (!confirm("Delete this product?")) return;
  const products = JSON.parse(localStorage.getItem("products"));
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function fillForm() {
  const editData = JSON.parse(localStorage.getItem("editProduct"));
  if (!editData) return;
  document.getElementById("form-title").innerText = "Edit Product";
  document.getElementById("name").value = editData.name;
  document.getElementById("price").value = editData.price;
  document.getElementById("category").value = editData.category;
  document.getElementById("image").value = editData.image;
  document.getElementById("editIndex").value = editData.index;
}

document.getElementById("product-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const image = document.getElementById("image").value;
  const index = document.getElementById("editIndex").value;
  const product = { name, price, category, image };
  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (index) {
    products[index] = product;
    localStorage.removeItem("editProduct");
  } else {
    products.push(product);
  }

  localStorage.setItem("products", JSON.stringify(products));
  e.target.reset();
  showSection("products");
  renderProducts();
});

document.getElementById("search-input").addEventListener("input", renderProducts);
document.getElementById("category-filter").addEventListener("change", renderProducts);

document.getElementById("clear-cart").addEventListener("click", () => {
  localStorage.setItem("cart", JSON.stringify([]));
  renderCart();
  updateCartCount();
});

document.getElementById("checkout").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  alert("Checkout complete!");
  localStorage.setItem("cart", JSON.stringify([]));
  renderCart();
  updateCartCount();
  showSection("products");
});

document.getElementById("darkmode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("darkmode-toggle").innerText = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// Setup on load
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
  fillForm();
  renderProducts();
  renderCart();
  updateCartCount();
  showSection("products");
});
