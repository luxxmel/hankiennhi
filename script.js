// --- DỮ LIỆU SẢN PHẨM ---
const allProducts = [
    { id: 1, name: "Nhẫn Cưới Kim Cương CVD Vàng Trắng 10K ", price: 69520000, category: "nhan", img: "/images/1.png" },
    { id: 2, name: "Dây Chuyền Nữ Vàng Trắng 10K", price: 22630000, category: "day-chuyen", img: "/images/2.png" },
    { id: 3, name: "Bông Tai Nữ Vàng Trắng 610", price: 11480000, category: "bong-tai", img: "/images/3.png" },
    { id: 4, name: "Lắc Tay Nữ Vàng Trắng 10K ", price: 4470000, category: "lac-tay", img: "/images/4.png" },
    { id: 5, name: "Nhẫn Cầu Hôn Kim Cương CVD Vàng Trắng 10K", price: 11410000, category: "nhan", img: "/images/5.png" },
    { id: 6, name: "Dây Chuyền Nữ Vàng Vàng 610", price: 39700000, category: "day-chuyen", img: "/images/6.png" },
    { id: 7, name: "Bông Tai Nữ Vàng Vàng 18K ", price: 13830000, category: "bong-tai", img: "/images/7.png" },
    { id: 8, name: "Lắc Tay Nữ Vàng Vàng 610 ", price: 7220000, category: "lac-tay", img: "/images/8.png" },    { id: 7, name: "Bông Tai Nữ Vàng Vàng 18K ", price: 13830000, category: "bong-tai", img: "/images/7.png" },
    { id: 9, name: "Nhẫn Cầu Hôn Vàng Trắng 10K – MTN1587 ", price: 4290000, category: "nhan", img: "/images/9.png" },    { id: 7, name: "Bông Tai Nữ Vàng Vàng 18K ", price: 13830000, category: "bong-tai", img: "/images/7.png" },
    { id: 10, name: "Mặt Dây Vàng Trắng Vàng 18K – MTM0659-1 ", price: 12190000, category: "bong-tai", img: "/images/10.png" },
];

function formatPrice(price) { return price.toLocaleString('vi-VN') + 'đ'; }

// --- QUẢN LÝ GIỎ HÀNG (LocalStorage) ---
let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];

function updateCartCount() {
    const cartBtn = document.getElementById('cart-btn');
    if(cartBtn) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.innerText = `Giỏ hàng (${totalItems})`;
    }
}

function addToCart(id, quantity = 1) {
    const product = allProducts.find(p => p.id === id);
    if(!product) return;
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) { existingItem.quantity += quantity; } 
    else { cart.push({ ...product, quantity }); }
    
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// --- LOGIC TRANG CHỦ (Hiển thị, Lọc & Phân trang) ---
const productList = document.getElementById("product-list");
const paginationControls = document.getElementById("pagination-controls");

if(productList) {
    let currentCategory = 'all';
    let currentPage = 1;
    const itemsPerPage = 8; 
    function renderProducts() {
        const filtered = allProducts.filter(p => currentCategory === 'all' || p.category === currentCategory);
        
        // Tính toán phân trang
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filtered.slice(startIndex, endIndex);

        productList.innerHTML = "";
        
        if (pageItems.length === 0) {
            productList.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding: 50px;'>Không tìm thấy sản phẩm nào.</p>";
        } else {
            pageItems.forEach(p => {
                productList.innerHTML += `
                    <div class="product-card">
                        <a href="chi-tiet.html?id=${p.id}" style="text-decoration: none; color: inherit;">
                            <img src="${p.img}" alt="${p.name}" class="product-img">
                            <h4 class="product-name">${p.name}</h4>
                            <p class="product-price">${formatPrice(p.price)}</p>
                        </a>
                        <button class="add-to-cart" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
                    </div>`;
            });
        }
        renderPagination(filtered.length);
    }

    function renderPagination(totalItems) {
        if (!paginationControls) return;
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        paginationControls.innerHTML = "";

        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.add("page-btn");
            if (i === currentPage) btn.classList.add("active");

            btn.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
                window.scrollTo({ top: 400, behavior: 'smooth' }); 
            });
            paginationControls.appendChild(btn);
        }
    }

    window.setCategory = function(cat, el) {
        currentCategory = cat;
        currentPage = 1; // Reset về trang 1 khi lọc danh mục
        document.querySelectorAll('.categories li').forEach(li => li.classList.remove('active'));
        if(el) el.classList.add('active');
        renderProducts();
    };

    renderProducts();
}

// --- LOGIC TRANG CHI TIẾT SẢN PHẨM ---
const detailContainer = document.getElementById("product-detail-render");
if(detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = allProducts.find(p => p.id === productId) || allProducts[0];

    detailContainer.innerHTML = `
        <div class="product-image-gallery"><img src="${product.img}" alt="${product.name}"></div>
        <div class="product-info-detail">
            <h1 class="product-title">${product.name}</h1>
            <p class="product-price">${formatPrice(product.price)}</p>
            <div class="product-description">
                <h3>Thông tin chi tiết:</h3>
                <ul><li>Chất liệu cao cấp từ ANH PHUONG Jewelry</li><li>Bảo hành trọn đời</li></ul>
            </div>
            <div class="product-actions">
                <input type="number" id="detail-qty" value="1" min="1" class="qty-input">
                <button class="btn" onclick="addToCart(${product.id}, parseInt(document.getElementById('detail-qty').value))">Thêm vào giỏ hàng</button>
            </div>
        </div>`;
}

// --- LOGIC TRANG GIỎ HÀNG ---
const cartItemsContainer = document.getElementById("cart-items-container");
if (cartItemsContainer) {
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        
        if(cart.length === 0) {
            cartItemsContainer.innerHTML = "<p style='text-align:center; padding: 20px; color: #777;'>Giỏ hàng đang trống!</p>";
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item-row">
                        <div class="cart-item-info">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>${formatPrice(item.price)}</p>
                            </div>
                        </div>
                        <div class="cart-item-controls">
                            <div class="qty-group">
                                <button class="qty-btn" onclick="updateQty(${index}, ${item.quantity - 1})">-</button>
                                <input type="number" value="${item.quantity}" class="qty-input" onchange="updateQty(${index}, this.value)" min="1">
                                <button class="qty-btn" onclick="updateQty(${index}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
                        </div>
                    </div>`;
            });
        }
        
        const cartTotalEl = document.getElementById("cart-total");
        if(cartTotalEl) cartTotalEl.innerText = formatPrice(total);
        
        const subtotalEl = document.getElementById("cart-subtotal");
        if(subtotalEl) subtotalEl.innerText = formatPrice(total);
    }
    
    window.updateQty = (index, val) => { 
        let newVal = parseInt(val);
        if (newVal < 1) newVal = 1;
        cart[index].quantity = newVal; 
        localStorage.setItem('shop_cart', JSON.stringify(cart)); 
        renderCart(); 
        updateCartCount(); 
    };
    
    window.removeItem = (index) => { 
        cart.splice(index, 1); 
        localStorage.setItem('shop_cart', JSON.stringify(cart)); 
        renderCart(); 
        updateCartCount(); 
    };
    
    renderCart();
}

// --- LOGIC TRANG THANH TOÁN ---
const checkoutTotal = document.getElementById('checkout-total');
if (checkoutTotal) {
    function loadCheckoutData() {
        let subtotal = 0;
        const checkoutItems = document.getElementById('checkout-items');
        
        if (cart.length === 0) {
            if (checkoutItems) checkoutItems.innerHTML = "<p style='color: red; font-size: 14px;'>Giỏ hàng đang trống!</p>";
        } else {
            let htmlItems = "";
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                htmlItems += `
                    <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 15px; font-size: 14px; line-height: 1.4;">
                        <span style="flex: 1; text-align: left; color: #555;">${item.quantity} x ${item.name}</span>
                        <span style="font-weight: 700; color: var(--text-main); white-space: nowrap;">${formatPrice(itemTotal)}</span>
                    </div>`;
            });
            if (checkoutItems) checkoutItems.innerHTML = htmlItems;
        }

        const shippingFee = 30000;
        const total = subtotal > 0 ? subtotal + shippingFee : 0;

        const subtotalEl = document.getElementById('checkout-subtotal');
        if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);
        checkoutTotal.innerText = formatPrice(total);
    }

    window.processCheckout = function() {
        const form = document.getElementById('checkout-form');
        if (form && !form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        alert('Cảm ơn Bạn! Đặt hàng thành công.');
        cart = [];
        localStorage.removeItem('shop_cart');
        window.location.href = 'index.html';
    };

    loadCheckoutData();
}
const slider = document.getElementById('slider');

if (slider) {
    let currentSlide = 0;
    // Tự động đếm xem bạn đã thêm bao nhiêu khối .slide trong HTML
    const slides = slider.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function moveSlide() {
        if (totalSlides <= 1) return; // Nếu chỉ có 1 ảnh thì không lướt
        
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Dịch chuyển đúng 100% chiều rộng của khung nhìn cho mỗi ảnh
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Lướt mỗi 3 giây (3000ms)
    setInterval(moveSlide, 3000);
}
// Khởi chạy
document.addEventListener("DOMContentLoaded", updateCartCount);