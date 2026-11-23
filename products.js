/**
 * MEBI ACCESSORIES — Product catalogue
 * ------------------------------------------
 * Starter catalogue from the WhatsApp price list. Photos are added in
 * /admin.html once the site is deployed on Netlify; until then the
 * placeholder card shows. Edit names, prices and categories here.
 *
 * Fields: id, name, price (Naira), category (one of CATEGORIES), images,
 * sizes, rating, orders, condition, badge, dateAdded (ISO), description.
 */

const products = [
  { id: 1, name: "Casio Analog Wristwatch", price: 20000, category: "Watches", images: ["images/casio-analog-watch.jpg", "images/casio-analog-watch-2.jpg", "images/casio-analog-watch-3.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Casio analog wristwatch. The catalogue photos show available dial and finish variations; confirm the preferred option with Mebi." },
  { id: 2, name: "100% VVS Moissanite Diamond Necklace", price: 110000, category: "Jewellery", images: ["images/vvs-moissanite-necklace.jpg", "images/vvs-moissanite-necklace-2.jpg", "images/vvs-moissanite-necklace-3.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "100% VVS Moissanite Diamond Necklace. The catalogue listing states that it comes with a GRA certificate." },
  { id: 3, name: "3/4 Friends Customized Necklace", price: 15000, category: "Jewellery", images: ["images/friends-custom-necklace.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Customized 3/4 friends necklace, shown in gold-tone and silver-tone finishes." },
  { id: 4, name: "Curren Chain Chronograph", price: 36000, category: "Watches", images: ["images/curren-chronograph.jpg", "images/curren-chronograph-2.jpg", "images/curren-chronograph-3.jpg", "images/curren-chronograph-4.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Curren chain chronograph wristwatch. See the catalogue photos for the pictured dial styles and finishes." },
  { id: 5, name: "Quicksand Table Lamp with Wireless Charger", price: 30000, category: "Home & Living", images: ["images/quicksand-lamp.jpg", "images/quicksand-lamp-2.jpg", "images/quicksand-lamp-3.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Quicksand table lamp with wireless charger, as named in the WhatsApp catalogue." },
  { id: 6, name: "Water Fountain (Home Decor)", price: 45000, category: "Home & Living", images: ["images/water-fountain.jpg", "images/water-fountain-2.jpg", "images/water-fountain-3.jpg", "images/water-fountain-4.jpg", "images/water-fountain-5.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Decorative water fountain for the home, as listed in the Mebi catalogue." },
  { id: 7, name: "Bold Bangle (Silver and Gold)", price: 6000, category: "Jewellery", images: ["images/bold-bangle.jpg", "images/bold-bangle-2.jpg", "images/bold-bangle-3.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Bold bangle shown in silver and gold finishes." },
  { id: 8, name: "Necklace and Bracelet Set", price: 12000, category: "Jewellery", images: ["images/necklace-bracelet-set.jpg", "images/necklace-bracelet-set-2.jpg", "images/necklace-bracelet-set-3.jpg", "images/necklace-bracelet-set-4.jpg", "images/necklace-bracelet-set-5.jpg", "images/necklace-bracelet-set-6.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Necklace and bracelet set. The catalogue includes several pictured designs; confirm the preferred design with Mebi." },
  { id: 9, name: "Gold or Black Customizable Ring", price: 12000, category: "Jewellery", images: ["images/custom-ring.jpg", "images/custom-ring-2.jpg", "images/custom-ring-3.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Gold or black ring, available plain or customized. The catalogue says the plain option has a reduced price; confirm the customized price with Mebi." },
  { id: 10, name: "Diamond Rings", price: 15000, category: "Jewellery", images: ["images/diamond-rings.jpg", "images/diamond-rings-2.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Diamond rings, as listed in the Mebi WhatsApp catalogue." },
  { id: 11, name: "JBL Extreme 3 Speaker & Ultra 8 Smartwatch Combo", price: 70000, category: "Smart Gadgets", images: ["images/jbl-ultra-8-combo.jpg", "images/jbl-ultra-8-combo-2.jpg", "images/jbl-ultra-8-combo-3.jpg", "images/jbl-ultra-8-combo-4.jpg", "images/jbl-ultra-8-combo-5.jpg", "images/jbl-ultra-8-combo-6.jpg", "images/jbl-ultra-8-combo-7.jpg"], sizes: ["One Size"], rating: 0, orders: 0, condition: "Brand new", badge: null, dateAdded: "2026-11-23", description: "Combo deal featuring a big-size JBL Extreme 3 Bluetooth speaker and an Ultra 8 smartwatch combo. Confirm the full list of included accessories with Mebi before ordering." }
];

/** Category names, blurbs and icons */
const CATEGORIES = ["Jewellery", "Watches", "Smart Gadgets", "Home & Living"];
const CATEGORY_BLURBS = {
  "Jewellery": "Necklaces, sets and pieces for everyday shine.",
  "Watches": "Analog and chronograph watches.",
  "Smart Gadgets": "Smartwatch combos and everyday tech.",
  "Home & Living": "Lamps and décor for your home."
};

/** Line icons for the category strip (24x24, stroke = currentColor) */
const CATEGORY_ICONS = {
  "Jewellery": '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/>',
  "Watches": '<circle cx="12" cy="12" r="6.5"/><path d="M12 9v3.5l2 1.5M9.5 2.5h5M9.5 21.5h5"/>',
  "Smart Gadgets": '<rect x="6.5" y="3.5" width="11" height="17" rx="2.5"/><path d="M10 7h4M9.5 17h.01"/>',
  "Home & Living": '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 10v10h13V10"/>'
};
function categoryIcon(cat, size) {
  return `<svg width="${size || 28}" height="${size || 28}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CATEGORY_ICONS[cat] || CATEGORY_ICONS["Home D\u00E9cor"]}</svg>`;
}
function categorySlug(cat) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Message shown where a category has no products listed yet */
function emptyCategoryMarkup(cat) {
  const msg = cat
    ? `Hi ${STORE.name}, I'd like to see what you have in ${cat}.`
    : `Hi ${STORE.name}, I'd like to see what's available.`;
  return `
    <div class="empty-state empty-state--wide">
      <div class="empty-state__icon">${cat ? categoryIcon(cat, 40) : ""}</div>
      <h2>${cat ? cat + " &mdash; ask us directly" : "Ask us what&rsquo;s available"}</h2>
      <p>${cat && CATEGORY_BLURBS[cat] ? CATEGORY_BLURBS[cat] + " " : ""}We&rsquo;re still adding photos online. Message us on WhatsApp and we&rsquo;ll show you what&rsquo;s available right now.</p>
      <a class="btn btn--x" href="${buildWhatsAppLink()}" target="_blank" rel="noopener">Ask on WhatsApp</a>
    </div>`;
}

/** Helper lookups used across pages */
function getProductById(id) {
  return products.find(p => p.id === Number(id));
}

/* ---------- Live catalogue (admin dashboard) ----------
 * The admin dashboard saves the catalogue to /api/products. When it exists
 * it replaces the starter list above. If the API isn't reachable (e.g. the
 * files are opened straight from a folder) the starter list is used. */
const productsReady = (async () => {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        products.length = 0;
        products.push(...data.products);
      }
    }
  } catch (e) { /* keep the starter products */ }
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r));
  }
})();

/** Run a function once the catalogue and the page are both ready */
function onProductsReady(fn) { productsReady.then(fn); }

function isSoldOut(product) {
  return product.badge === "SOLD OUT";
}

function badgeClass(badge) {
  if (!badge) return "";
  return "product-card__badge--" + badge.replace(/\s+/g, "");
}

/** Does this product need the customer to pick a colour/size first? */
function hasOptions(product) {
  return Array.isArray(product.sizes) && product.sizes.length > 1;
}

const CART_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.5l2 11h11l2-8H6.5"/><circle cx="9.5" cy="19.5" r="1.2"/><circle cx="17" cy="19.5" r="1.2"/></svg>';

/** Shared product card markup — used on Home, Shop, and related-product strips */
function renderProductCard(product) {
  const soldOut = isSoldOut(product);
  const pick = hasOptions(product);
  const action = soldOut
    ? `<button class="btn btn--dark btn--sm btn--block" type="button" disabled>Sold out</button>`
    : pick
      ? `<a class="btn btn--dark btn--sm btn--block" href="product.html?id=${product.id}">Choose options</a>`
      : `<button class="btn btn--dark btn--sm btn--block" type="button" data-add-to-cart="${product.id}">${CART_ICON} Add to cart</button>`;
  return `
    <article class="product-card reveal" data-id="${product.id}">
      <div class="product-card__media">
        <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
          ${product.badge ? `<span class="product-card__badge ${badgeClass(product.badge)}">${product.badge}</span>` : ""}
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy" width="700" height="900">
        </a>
        <button class="product-card__quick" type="button" data-quick-view="${product.id}">Quick view</button>
      </div>
      <div class="product-card__body">
        <span class="product-card__cat">${product.category}</span>
        <h3 class="product-card__name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        ${product.orders > 0 ? `<div class="product-card__meta">
          ${starsMarkup(product.rating)}
          <span>${product.rating.toFixed(1)}</span>
          <span aria-hidden="true">&middot;</span>
          <span>${product.orders} sold</span>
        </div>` : ""}
        <div class="product-card__price">${formatNaira(product.price)}</div>
        <div class="product-card__foot">${action}</div>
      </div>
    </article>`;
}

/** Wires up every [data-add-to-cart] button inside a container (single-option products only) */
function bindQuickAddButtons(root) {
  (root || document).querySelectorAll("[data-add-to-cart]").forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const product = getProductById(btn.dataset.addToCart);
      if (!product || isSoldOut(product)) return;
      const size = product.sizes[0];
      Cart.add(product.id, size, 1);
      btn.classList.add("is-added");
      setTimeout(() => btn.classList.remove("is-added"), 650);
      showToast(`Added "${product.name}" to your cart`);
    });
  });
}
