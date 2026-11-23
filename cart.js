/**
 * MEBI ACCESSORIES — Cart engine
 * ----------------------------
 * Cart lives in localStorage as an array of { productId, size, qty }.
 * This file is included on every page so the cart badge/count stays in
 * sync everywhere, even before shop-specific or product-specific JS runs.
 */

const Cart = {
  read() {
    try {
      const raw = localStorage.getItem(STORE.cartStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  write(items) {
    localStorage.setItem(STORE.cartStorageKey, JSON.stringify(items));
    Cart.updateBadge();
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
  },

  add(productId, size, qty) {
    const items = Cart.read();
    const existing = items.find(i => i.productId === productId && i.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ productId, size, qty });
    }
    Cart.write(items);
  },

  updateQty(productId, size, qty) {
    let items = Cart.read();
    if (qty <= 0) {
      items = items.filter(i => !(i.productId === productId && i.size === size));
    } else {
      const item = items.find(i => i.productId === productId && i.size === size);
      if (item) item.qty = qty;
    }
    Cart.write(items);
  },

  remove(productId, size) {
    const items = Cart.read().filter(i => !(i.productId === productId && i.size === size));
    Cart.write(items);
  },

  clear() {
    Cart.write([]);
  },

  count() {
    return Cart.read().reduce((sum, i) => sum + i.qty, 0);
  },

  /** Returns cart rows enriched with live product data, skipping any that no longer exist */
  detailedItems() {
    return Cart.read()
      .map(i => {
        const product = getProductById(i.productId);
        if (!product) return null;
        return {
          product,
          size: i.size,
          qty: i.qty,
          subtotal: product.price * i.qty
        };
      })
      .filter(Boolean);
  },

  total() {
    return Cart.detailedItems().reduce((sum, row) => sum + row.subtotal, 0);
  },

  updateBadge() {
    const count = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = count;
      el.classList.toggle("is-visible", count > 0);
    });
  }
};

document.addEventListener("DOMContentLoaded", Cart.updateBadge);

/* =========================================================
   Cart PAGE rendering (only runs on cart.html, where #cartRoot exists)
   ========================================================= */
onProductsReady(() => {
  const root = document.getElementById("cartRoot");
  if (!root) return;

  function render() {
    const rows = Cart.detailedItems();

    if (rows.length === 0) {
      root.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">&#128715;</div>
          <h2>Your cart is empty</h2>
          <p>Add a few pieces you love — they'll be waiting for you here.</p>
          <a href="shop.html" class="btn btn--primary">Start shopping</a>
        </div>`;
      return;
    }

    const itemsHtml = rows.map(row => `
      <div class="cart-item" data-id="${row.product.id}" data-size="${row.size}">
        <a href="product.html?id=${row.product.id}" class="cart-item__img">
          <img src="${row.product.images[0]}" alt="${row.product.name}">
        </a>
        <div>
          <a href="product.html?id=${row.product.id}"><h3 class="cart-item__name">${row.product.name}</h3></a>
          <div class="cart-item__meta">${row.product.category}${row.size && row.size !== "One Size" ? " &middot; " + row.size : ""}</div>
          <div class="cart-item__row">
            <div class="qty-stepper">
              <button type="button" data-qty-minus aria-label="Decrease quantity">&minus;</button>
              <input type="text" value="${row.qty}" readonly aria-label="Quantity">
              <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item__price">${formatNaira(row.subtotal)}</div>
          </div>
          <div class="cart-item__row">
            <span class="cart-item__meta">${formatNaira(row.product.price)} each</span>
            <button class="cart-item__remove" type="button" data-remove>Remove</button>
          </div>
        </div>
      </div>`).join("");

    const total = Cart.total();
    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">
          <div class="section-head__row" style="margin-bottom:6px;">
            <h1 class="section-title" style="font-size:var(--step-3);">Your cart</h1>
            <a href="shop.html" class="link-underline" style="font-size:0.88rem;">&larr; Continue shopping</a>
          </div>
          ${itemsHtml}
        </div>
        <aside class="cart-summary">
          <h2 style="font-size:1.1rem;margin-bottom:14px;">Order summary</h2>
          <div class="cart-summary__row"><span>Subtotal</span><span>${formatNaira(total)}</span></div>
          <div class="cart-summary__row"><span>Delivery</span><span>Arranged on WhatsApp</span></div>
          <div class="cart-summary__row cart-summary__row--total"><span>Total</span><span>${formatNaira(total)}</span></div>
          <button class="btn btn--primary btn--block" id="purchaseBtn" style="margin-top:18px;">Purchase</button>
          <a href="shop.html" class="btn btn--outline btn--block" style="margin-top:10px;">Continue shopping</a>
        </aside>
      </div>`;

    root.querySelectorAll("[data-qty-minus]").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".cart-item");
        const row = rows.find(r => String(r.product.id) === item.dataset.id && r.size === item.dataset.size);
        Cart.updateQty(row.product.id, row.size, row.qty - 1);
        render();
      });
    });
    root.querySelectorAll("[data-qty-plus]").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".cart-item");
        const row = rows.find(r => String(r.product.id) === item.dataset.id && r.size === item.dataset.size);
        Cart.updateQty(row.product.id, row.size, Math.min(10, row.qty + 1));
        render();
      });
    });
    root.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".cart-item");
        Cart.remove(Number(item.dataset.id), item.dataset.size);
        showToast("Item removed from your cart");
        render();
      });
    });
    document.getElementById("purchaseBtn")?.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  render();
});
