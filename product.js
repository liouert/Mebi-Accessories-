/**
 * MEBI ACCESSORIES — Product details page
 * Reads ?id= from the URL, renders the product, and handles colour/size
 * and qty selection so the correct option + quantity is stored in the cart.
 */

onProductsReady(() => {
  const root = document.getElementById("pdpRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id"));

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#128269;</div>
        <h2>We couldn't find that item</h2>
        <p>It may have sold out and been removed. Browse the shop for similar items.</p>
        <a href="shop.html" class="btn btn--primary">Back to shop</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — ${STORE.name}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", product.description);

  let activeImage = 0;
  let selectedSize = product.sizes[0];
  let qty = 1;
  const soldOut = isSoldOut(product);
  const limited = product.badge === "LIMITED";

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a> <span>/</span>
      <a href="shop.html">Shop</a> <span>/</span>
      <a href="shop.html?category=${encodeURIComponent(product.category)}">${product.category}</a> <span>/</span>
      <span>${product.name}</span>
    </nav>
    <div class="pdp">
      <div class="pdp__gallery">
        <div class="pdp__gallery-main" id="pdpMainImg">
          <img src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="pdp__thumbs" id="pdpThumbs">
          ${product.images.map((img, i) => `
            <button type="button" class="${i === 0 ? "is-active" : ""}" data-thumb="${i}" aria-label="Show image ${i + 1}">
              <img src="${img}" alt="${product.name} view ${i + 1}">
            </button>`).join("")}
        </div>
      </div>

      <div class="pdp__info">
        <span class="pdp__info__cat">${product.category}</span>
        <h1>${product.name}</h1>
        ${product.orders > 0 ? `<div class="pdp__rating-row">
          ${starsMarkup(product.rating)}
          <span>${product.rating.toFixed(1)} &middot; ${product.orders} orders</span>
        </div>` : ""}
        <div class="pdp__price">${formatNaira(product.price)}</div>

        <span class="availability-pill ${soldOut ? "availability-pill--out" : limited ? "availability-pill--limited" : "availability-pill--in"}">
          &#9679; ${soldOut ? "Sold out" : limited ? "Limited — few left" : "Available to order"}
        </span>

        <p class="pdp__desc">${product.description}</p>

        <div class="pdp__facts">
          <div class="pdp__fact"><strong>Category</strong>${product.category}</div>
          <div class="pdp__fact"><strong>Delivery</strong>Arranged on WhatsApp</div>
          <div class="pdp__fact"><strong>Item No.</strong>MEB-${String(product.id).padStart(4, "0")}</div>
        </div>

        ${hasOptions(product) ? `<div class="field-block">
          <div class="field-block__label"><span>Choose colour / size: <b id="chosenOption">${product.sizes[0]}</b></span></div>
          <div class="size-grid" id="sizeGrid" role="group" aria-label="Colour or size">
            ${product.sizes.map((s, i) => `<button type="button" class="size-pill ${i === 0 ? "is-selected" : ""}" data-size="${s}" ${soldOut ? "disabled" : ""}>${s}</button>`).join("")}
          </div>
        </div>` : ""}

        <div class="field-block">
          <div class="field-block__label"><span>Quantity</span></div>
          <div class="qty-stepper">
            <button type="button" id="qtyMinus" aria-label="Decrease quantity">&minus;</button>
            <input type="text" id="qtyInput" value="1" readonly aria-label="Quantity">
            <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="pdp__actions">
          <button class="btn btn--outline btn--block" id="addToCartBtn" ${soldOut ? "disabled" : ""}>
            ${soldOut ? "Sold out" : "Add to cart"}
          </button>
          <button class="btn btn--primary btn--block" id="buyNowBtn" ${soldOut ? "disabled" : ""}>
            Buy now
          </button>
        </div>
        <button type="button" class="btn btn--x btn--block" style="margin-top:10px;"
             onclick='sendViaWhatsApp(${JSON.stringify(`Hi ${STORE.name}, I'm interested in the ${product.name} (MEB-${String(product.id).padStart(4, "0")}). Is it available?`).replace(/'/g, "&#39;")})'>Ask about this on WhatsApp</button>
        <p class="pdp__note">Checkout completes on WhatsApp: we confirm availability, delivery and payment with you personally in a DM.</p>
      </div>
    </div>

    <section class="section related-strip">
      <div class="section-head__row">
        <h2 class="section-title" style="font-size:var(--step-2);">You might also like</h2>
      </div>
      <div class="product-grid" id="relatedGrid"></div>
    </section>
  `;

  const mainImg = document.querySelector("#pdpMainImg img");
  const mainWrap = document.getElementById("pdpMainImg");
  document.querySelectorAll("#pdpThumbs button").forEach(btn => {
    btn.addEventListener("click", () => {
      activeImage = Number(btn.dataset.thumb);
      mainImg.src = product.images[activeImage];
      document.querySelectorAll("#pdpThumbs button").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });
  mainWrap.addEventListener("click", () => mainWrap.classList.toggle("is-zoomed"));

  document.querySelectorAll("#sizeGrid .size-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      document.querySelectorAll("#sizeGrid .size-pill").forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      const label = document.getElementById("chosenOption");
      if (label) label.textContent = selectedSize;
    });
  });

  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyInput.value = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyInput.value = qty;
  });

  document.getElementById("addToCartBtn")?.addEventListener("click", (e) => {
    Cart.add(product.id, selectedSize, qty);
    e.target.classList.add("is-added");
    setTimeout(() => e.target.classList.remove("is-added"), 650);
    showToast(`Added ${qty} × "${product.name}"${selectedSize !== "One Size" ? " (" + selectedSize + ")" : ""} to your cart`);
  });
  document.getElementById("buyNowBtn")?.addEventListener("click", () => {
    Cart.add(product.id, selectedSize, qty);
    window.location.href = "checkout.html";
  });

  const stickyBar = document.getElementById("stickyCartBar");
  if (stickyBar) {
    stickyBar.innerHTML = `
      <button class="btn btn--outline" id="stickyAdd" ${soldOut ? "disabled" : ""}>Add to cart</button>
      <button class="btn btn--primary" id="stickyBuy" ${soldOut ? "disabled" : ""}>Buy now — ${formatNaira(product.price)}</button>`;
    document.getElementById("stickyAdd").addEventListener("click", () => {
      Cart.add(product.id, selectedSize, qty);
      showToast(`Added "${product.name}" to your cart`);
    });
    document.getElementById("stickyBuy").addEventListener("click", () => {
      Cart.add(product.id, selectedSize, qty);
      window.location.href = "checkout.html";
    });
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fallback = related.length ? related : products.filter(p => p.id !== product.id).slice(0, 4);
  document.getElementById("relatedGrid").innerHTML = fallback.map(renderProductCard).join("");
  bindQuickAddButtons(document.getElementById("relatedGrid"));

  observeReveals();
});
