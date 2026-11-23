/**
 * MEBI ACCESSORIES — Checkout
 * Shows the order summary, builds an order message with every item's
 * name, option, quantity, price and image reference, then opens wa.me
 * then copies it and opens X. X cannot auto-attach local
 * images, so the checkout screen displays them and the message links
 * to them, with a clear note asking the customer to attach photos.
 */

onProductsReady(() => {
  const root = document.getElementById("checkoutRoot");
  if (!root) return;

  const rows = Cart.detailedItems();

  if (rows.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">&#128715;</div>
        <h2>Nothing to check out yet</h2>
        <p>Add a few pieces to your cart first, then come back here to complete your order.</p>
        <a href="shop.html" class="btn btn--primary">Browse the shop</a>
      </div>`;
    return;
  }

  const total = Cart.total();
  const origin = window.location.origin + window.location.pathname.replace(/checkout\.html$/, "");

  const itemsHtml = rows.map(row => `
    <div class="checkout-item">
      <div class="checkout-item__img"><img src="${row.product.images[0]}" alt="${row.product.name}"></div>
      <div>
        <div class="checkout-item__name">${row.product.name}</div>
        <div class="checkout-item__meta">${row.size && row.size !== "One Size" ? row.size + " &middot; " : ""}Qty ${row.qty} &middot; ${formatNaira(row.product.price)} each</div>
      </div>
      <div class="cart-item__price">${formatNaira(row.subtotal)}</div>
    </div>`).join("");

  root.innerHTML = `
    <div class="checkout-layout" style="display:grid;gap:24px;">
      <div>
        <h1 class="section-title" style="font-size:var(--step-3);margin-bottom:4px;">Your order</h1>
        <p style="opacity:0.7;font-size:0.9rem;margin-bottom:18px;">Review everything below, then send it to us on WhatsApp to finish your purchase.</p>
        ${itemsHtml}
      </div>
      <aside class="cart-summary">
        <h2 style="font-size:1.1rem;margin-bottom:14px;">Total</h2>
        <div class="cart-summary__row cart-summary__row--total"><span>TOTAL</span><span>${formatNaira(total)}</span></div>

        <div class="order-note">
          <span>&#128172;</span>
          <span>Tap the button below to open WhatsApp with your order ready to send. Please confirm availability and delivery.</span>
        </div>

        <p style="margin-top:16px;font-weight:600;">Your order is ready!</p>
        <p style="font-size:0.88rem;opacity:0.75;">Continue to X to send your order to ${STORE.name}.</p>

        <button id="sendWhatsAppBtn" type="button" class="btn btn--x btn--block" style="margin-top:16px;">
          Copy order &amp; open X
        </button>
        <a href="cart.html" class="btn btn--outline btn--block" style="margin-top:10px;">Back to cart</a>
      </aside>
    </div>`;

  const lines = [];
  lines.push(`Hello ${STORE.name} \u{1F44B}`);
  lines.push("");
  lines.push("I would like to purchase the following items:");
  lines.push("");
  rows.forEach((row, i) => {
    lines.push(`${i + 1}. ${row.product.name}`);
    if (row.size && row.size !== "One Size") lines.push(`   Colour/Size: ${row.size}`);
    lines.push(`   Quantity: ${row.qty}`);
    lines.push(`   Price: ${formatNaira(row.product.price)} each`);
    lines.push(`   Subtotal: ${formatNaira(row.subtotal)}`);
    lines.push(`   Product Image: ${origin}${row.product.images[0]}`);
    lines.push("");
  });
  lines.push("---");
  lines.push("");
  lines.push(`TOTAL: ${formatNaira(total)}`);
  lines.push("");
  lines.push("Please confirm availability, delivery and payment details.");
  lines.push("Thank you!");

  const message = lines.join("\n");
  const sendBtn = document.getElementById("sendWhatsAppBtn");
  sendBtn.addEventListener("click", async () => {
    await sendViaWhatsApp(message, "Opening WhatsApp with your order");
    setTimeout(() => { Cart.clear(); }, 400);
  });
});
