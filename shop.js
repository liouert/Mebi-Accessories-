/**
 * MEBI ACCESSORIES — Shop page
 * Renders the filter chips, applies category filter + sort, and draws
 * the product grid. Reads optional ?category= and ?q= (search) from the URL
 * so links from Home/Collections/the search box land pre-filtered.
 */

onProductsReady(() => {
  const grid = document.getElementById("shopGrid");
  const chipBar = document.getElementById("categoryChips");
  const sortSelect = document.getElementById("sortSelect");
  const countLabel = document.getElementById("resultCount");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "All";
  let activeSort = params.get("sort") || "newest";
  const query = (params.get("q") || "").trim().toLowerCase();
  if (!CATEGORIES.includes(activeCategory)) activeCategory = "All";
  if (sortSelect) sortSelect.value = activeSort;

  function buildChips() {
    const cats = ["All", ...CATEGORIES];
    chipBar.innerHTML = cats.map(cat =>
      `<button class="chip ${cat === activeCategory ? "is-active" : ""}" type="button" data-cat="${cat}">${cat}</button>`
    ).join("");
    chipBar.querySelectorAll("[data-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        buildChips();
        render();
      });
    });
  }

  function getFiltered() {
    let list = activeCategory === "All"
      ? [...products]
      : products.filter(p => p.category === activeCategory);
    if (query) {
      list = list.filter(p => (p.name + " " + p.category + " " + p.description).toLowerCase().includes(query));
    }

    switch (activeSort) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.orders - a.orders); break;
      default: list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    return list;
  }

  function render() {
    const list = getFiltered();
    countLabel.textContent = (query ? `Results for \u201C${params.get("q")}\u201D \u00B7 ` : "") + `${list.length} item${list.length === 1 ? "" : "s"}`;
    grid.innerHTML = list.length
      ? list.map(renderProductCard).join("")
      : `<div style="grid-column:1/-1;">${emptyCategoryMarkup(query ? "" : (activeCategory === "All" ? "" : activeCategory))}</div>`;
    bindQuickAddButtons(grid);
    observeReveals();
  }

  sortSelect?.addEventListener("change", () => {
    activeSort = sortSelect.value;
    render();
  });

  buildChips();
  render();
});
