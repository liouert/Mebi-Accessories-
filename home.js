/**
 * MEBI ACCESSORIES — Home page
 * Fills the category strip, featured pieces, hero slider and gallery from the
 * shared catalogue, so photos added in /admin.html appear here automatically.
 */

onProductsReady(() => {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return; // not on the home page

  const strip = document.getElementById("categoryStrip");
  if (strip) {
    strip.innerHTML = CATEGORIES.map(cat => `
      <a class="cat-chip" href="shop.html?category=${encodeURIComponent(cat)}">
        <span class="cat-chip__icon">${categoryIcon(cat, 28)}</span>
        <span class="cat-chip__label">${cat}</span>
      </a>`).join("");
  }

  const sorted = [...products].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  featuredGrid.innerHTML = sorted.length ? sorted.slice(0, 4).map(renderProductCard).join("") : emptyCategoryMarkup("");

  fillHeroAndGallery(sorted);
  bindQuickAddButtons(document);
  observeReveals();
  startHeroSlider();
});

function fillHeroAndGallery(list) {
  if (!list.length) return;
  document.querySelectorAll("#heroSlider [data-slide]").forEach((fig, i) => {
    const p = list[i % list.length];
    const img = fig.querySelector("img"), cap = fig.querySelector("figcaption");
    img.src = p.images[0]; img.alt = p.name;
    cap.innerHTML = `<span>${p.category}</span>${p.name}`;
  });
  document.querySelectorAll(".gallery-grid a").forEach((a, i) => {
    const p = list[i % list.length];
    a.href = `product.html?id=${p.id}`; a.removeAttribute("target"); a.setAttribute("aria-label", p.name);
    a.querySelector("img").src = p.images[0];
  });
}

/* Hero slider: auto-rotates every 5s, pauses on hover/focus or when the tab is hidden */
function startHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dots = [...slider.querySelectorAll("[data-dot]")];
  if (slides.length < 2) return;
  const INTERVAL = 5000;
  let index = 0, timer = null;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === index);
      d.setAttribute("aria-current", n === index ? "true" : "false");
    });
  }
  function start() { stop(); timer = setInterval(() => show(index + 1), INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach((d, n) => d.addEventListener("click", () => { show(n); start(); }));
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  show(0); start();
}
