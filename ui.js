/**
 * MEBI ACCESSORIES — Shared UI behaviours
 * Included on every page: mobile nav, toasts, sticky header state,
 * back-to-top, search box, contact form (sends via WhatsApp) and the star-rating renderer.
 */

/* ---------- Toasts ---------- */
function showToast(message, opts) {
  opts = opts || {};
  let container = document.querySelector(".toast-stack");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-stack";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (opts.type ? ` toast--${opts.type}` : "");
  toast.innerHTML = `<span class="toast__text">${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-shown"));
  setTimeout(() => {
    toast.classList.remove("is-shown");
    setTimeout(() => toast.remove(), 250);
  }, opts.duration || 2600);
}

/* ---------- Star rating markup ---------- */
function starsMarkup(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  let out = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) out += '<span class="star star--full">&#9733;</span>';
    else if (i === full && hasHalf) out += '<span class="star star--half">&#9733;</span>';
    else out += '<span class="star star--empty">&#9733;</span>';
  }
  return `<span class="stars" aria-label="${rating} out of 5 stars">${out}</span>`;
}

/* ---------- Mobile nav + header state ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".mobile-nav-overlay");

  function closeNav() {
    mobileNav?.classList.remove("is-open");
    overlay?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-locked");
  }
  function openNav() {
    mobileNav?.classList.add("is-open");
    overlay?.classList.add("is-open");
    navToggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-locked");
  }
  navToggle?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });
  overlay?.addEventListener("click", closeNav);
  mobileNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
  document.querySelector(".mobile-nav__close")?.addEventListener("click", closeNav);

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });

  // Back to top
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Header search -> shop page with ?q=
  document.querySelectorAll(".search-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const q = form.querySelector("input")?.value.trim();
      window.location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  });

  // Contact form: copies the message and opens X (no backend needed)
  document.querySelectorAll(".contact-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = new FormData(form);
      const msg = [
        `Hello ${STORE.name} \u{1F44B}`,
        "",
        `Name: ${f.get("name")}`,
        `Email: ${f.get("email")}`,
        `Subject: ${f.get("subject")}`,
        "",
        f.get("message")
      ].join("\n");
      sendViaWhatsApp(msg, "Opening WhatsApp");
      form.reset();
    });
  });

  // Set current year in footer
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  Cart.updateBadge();
  observeReveals();
});

/* ---------- Scroll reveal (re-runs whenever new cards are injected) ---------- */
function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.is-inview)");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-inview");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
}

/* ---------- Quick View modal (shared across Home/Shop) ---------- */
document.addEventListener("click", e => {
  const trigger = e.target.closest("[data-quick-view]");
  if (!trigger) return;
  const product = getProductById(trigger.dataset.quickView);
  if (product) openQuickView(product);
});

function openQuickView(product) {
  let overlay = document.querySelector(".modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = '<div class="modal-sheet" role="dialog" aria-modal="true" style="position:relative;"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeQuickView(); });
  }
  const sheet = overlay.querySelector(".modal-sheet");
  const soldOut = isSoldOut(product);
  sheet.innerHTML = `
    <button class="modal-close" type="button" aria-label="Close quick view">&times;</button>
    <div class="pdp-quick">
      <div style="border-radius:14px;overflow:hidden;aspect-ratio:3/4;background:var(--cream-deep);margin-bottom:16px;">
        <img src="${product.images[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <span class="pdp__info__cat">${product.category}</span>
      <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-top:4px;">${product.name}</h3>
      ${product.orders > 0 ? `<div class="pdp__rating-row">${starsMarkup(product.rating)} <span>${product.rating.toFixed(1)} &middot; ${product.orders} sold</span></div>` : ""}
      <div class="pdp__price">${formatNaira(product.price)}</div>
      <p class="pdp__desc" style="margin-top:8px;">${product.description}</p>
      <div style="display:flex;gap:10px;margin-top:18px;">
        <a href="product.html?id=${product.id}" class="btn btn--outline btn--block">View details</a>
        ${hasOptions(product)
          ? `<a href="product.html?id=${product.id}" class="btn btn--primary btn--block">Choose options</a>`
          : `<button class="btn btn--primary btn--block" type="button" data-add-to-cart="${product.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "Sold out" : "Add to cart"}</button>`}
      </div>
    </div>`;
  sheet.querySelector(".modal-close").addEventListener("click", closeQuickView);
  bindQuickAddButtons(sheet);
  overlay.classList.add("is-open");
  document.body.classList.add("nav-locked");
}
function closeQuickView() {
  document.querySelector(".modal-overlay")?.classList.remove("is-open");
  document.body.classList.remove("nav-locked");
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeQuickView(); });
