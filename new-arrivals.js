/**
 * MEBI ACCESSORIES — New Arrivals page
 * Shows the most recently added products, newest first.
 */

const NEW_ARRIVALS_LIMIT = 12; // how many of the newest products to show

onProductsReady(() => {
  const grid = document.getElementById("newArrivalsGrid");
  const countLabel = document.getElementById("resultCount");
  if (!grid) return;

  const newest = [...products]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, NEW_ARRIVALS_LIMIT);

  if (countLabel) countLabel.textContent = `${newest.length} newest item${newest.length === 1 ? "" : "s"}`;
  grid.innerHTML = newest.length ? newest.map(renderProductCard).join("") : emptyCategoryMarkup("");

  bindQuickAddButtons(grid);
  observeReveals();
});
