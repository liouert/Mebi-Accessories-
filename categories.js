/**
 * MEBI ACCESSORIES — Collections page
 * Top: a tile for each category (jumps down the page via #anchors).
 * Below: one section per category listing its products. Categories with
 * no products yet show a "ask us on WhatsApp" card instead of an empty grid.
 */

onProductsReady(() => {
  const tileGrid = document.getElementById("categoryGrid");
  const sections = document.getElementById("categorySections");
  if (!tileGrid || !sections) return;

  tileGrid.innerHTML = CATEGORIES.map(cat => {
    const count = products.filter(p => p.category === cat).length;
    return `
      <a class="collection-tile reveal" href="#${categorySlug(cat)}">
        <span class="collection-tile__icon">${categoryIcon(cat, 34)}</span>
        <span class="collection-tile__name">${cat}</span>
        <span class="collection-tile__count">${count ? count + " item" + (count === 1 ? "" : "s") : "Ask on WhatsApp"}</span>
      </a>`;
  }).join("");

  sections.innerHTML = CATEGORIES.map((cat, i) => {
    const items = products.filter(p => p.category === cat);
    const tint = i % 2 === 0 ? " section--tinted" : "";
    return `
      <section class="section${tint}" id="${categorySlug(cat)}" style="scroll-margin-top:80px;">
        <div class="container">
          <div class="section-head section-head__row">
            <div>
              <h2 class="section-title">${cat}</h2>
              <p class="section-sub">${CATEGORY_BLURBS[cat] || ""}</p>
            </div>
            <a href="#main" class="link-underline">Back to top</a>
          </div>
          ${items.length
            ? `<div class="product-grid">${items.map(renderProductCard).join("")}</div>`
            : emptyCategoryMarkup(cat)}
        </div>
      </section>`;
  }).join("");

  bindQuickAddButtons(sections);
  observeReveals();
});
