/**
 * MEBI ACCESSORIES — Admin dashboard
 * Log in, upload photos from your device, add products, remove products.
 * Talks to the store API (netlify/functions/api.js).
 */
(() => {
  const $ = s => document.querySelector(s);
  const SEEDS = products.map(p => ({ ...p })); // the starter catalogue, copied before the live one loads
  const MAX_PHOTOS = 4;
  let token = "", list = [], photos = [], armed = null;
  try { token = sessionStorage.getItem("mebi_admin") || ""; } catch (e) {}

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const say = (el, text, ok) => { el.textContent = text || ""; el.classList.toggle("ok", !!ok); };

  async function api(path, opts = {}) {
    const res = await fetch("/api" + path, {
      ...opts,
      headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && token) { logout("Your session ended — please log in again."); throw new Error("Session ended"); }
    if (res.status === 404 && !data.error) throw new Error("The admin service isn’t running on this site yet. Deploy it on Netlify (see README).");
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  /* ---------- login / logout ---------- */
  function showDash(on) {
    $("#login").hidden = on; $("#dash").hidden = !on; $("#topActions").hidden = !on;
  }
  function logout(message) {
    token = ""; try { sessionStorage.removeItem("mebi_admin"); } catch (e) {}
    showDash(false); say($("#loginMsg"), message);
  }
  async function open() {
    const d = await api("/products");
    list = Array.isArray(d.products) ? d.products : SEEDS;
    $("#seedNote").hidden = Array.isArray(d.products);
    showDash(true); render();
  }
  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = $("#loginBtn"); btn.disabled = true; say($("#loginMsg"), "");
    try {
      const d = await api("/login", { method: "POST", body: JSON.stringify({ password: $("#pw").value }) });
      token = d.token; try { sessionStorage.setItem("mebi_admin", token); } catch (e) {}
      $("#pw").value = ""; await open();
    } catch (err) { say($("#loginMsg"), err.message); }
    btn.disabled = false;
  });
  $("#logout").addEventListener("click", () => logout());

  /* ---------- product list ---------- */
  function render() {
    $("#count").textContent = `(${list.length})`;
    $("#list").innerHTML = list.length ? list.map(p => `
      <div class="item" data-id="${p.id}">
        <img src="${esc(p.images[0])}" alt="">
        <div>
          <h3>${esc(p.name)}${p.badge ? `<span class="pill">${esc(p.badge)}</span>` : ""}</h3>
          <p>${formatNaira(p.price)} &middot; ${esc(p.category)} &middot; ${esc(p.sizes.join(", "))}</p>
          <div class="acts">
            <button type="button" class="btn btn--outline btn--sm" data-act="sold">${p.badge === "SOLD OUT" ? "Back in stock" : "Mark sold out"}</button>
            <button type="button" class="btn btn--outline btn--sm danger" data-act="remove">Remove</button>
          </div>
        </div>
      </div>`).join("") : '<p class="empty">No products yet &mdash; add your first one above.</p>';
  }
  async function save(next) {
    const d = await api("/products", { method: "PUT", body: JSON.stringify({ products: next }) });
    list = d.products; $("#seedNote").hidden = true; render();
  }
  $("#list").addEventListener("click", async e => {
    const btn = e.target.closest("[data-act]"); if (!btn) return;
    const id = Number(btn.closest(".item").dataset.id), p = list.find(x => x.id === id);
    if (!p) return;
    try {
      if (btn.dataset.act === "sold") {
        await save(list.map(x => x.id === id ? { ...x, badge: x.badge === "SOLD OUT" ? null : "SOLD OUT" } : x));
      } else if (armed === id) { // second tap confirms
        armed = null; btn.disabled = true; await save(list.filter(x => x.id !== id));
      } else { // first tap arms the button (no pop-up, so it works everywhere)
        armed = id; btn.textContent = "Tap again to remove"; btn.classList.add("armed");
        setTimeout(() => { if (armed === id) { armed = null; btn.textContent = "Remove"; btn.classList.remove("armed"); } }, 4000);
      }
    } catch (err) { say($("#listMsg"), err.message); render(); }
  });

  /* ---------- photos: pick, shrink, preview ---------- */
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, 1200 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Couldn’t read that photo — try a JPG or PNG."));
      img.src = url;
    });
  }
  function drawThumbs() {
    $("#thumbs").innerHTML = photos.map((src, i) =>
      `<div class="thumb"><img src="${src}" alt="">${i === 0 ? "<b>Cover</b>" : ""}<button type="button" data-rm="${i}" aria-label="Remove photo">&times;</button></div>`).join("");
  }
  $("#photoInput").addEventListener("change", async e => {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length); e.target.value = "";
    say($("#addMsg"), files.length ? "Preparing photos…" : `You can add up to ${MAX_PHOTOS} photos.`);
    try { for (const f of files) photos.push(await shrink(f)); say($("#addMsg"), ""); }
    catch (err) { say($("#addMsg"), err.message); }
    drawThumbs();
  });
  $("#thumbs").addEventListener("click", e => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    photos.splice(Number(b.dataset.rm), 1); drawThumbs();
  });

  /* ---------- add a product ---------- */
  $("#category").innerHTML = CATEGORIES.map(c => `<option>${c}</option>`).join("");
  $("#addForm").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, msg = $("#addMsg"), btn = $("#addBtn");
    if (!photos.length) return say(msg, "Please add at least one photo.");
    btn.disabled = true;
    try {
      const urls = [];
      for (let i = 0; i < photos.length; i++) {
        say(msg, `Uploading photo ${i + 1} of ${photos.length}…`);
        urls.push((await api("/upload", { method: "POST", body: JSON.stringify({ dataUrl: photos[i] }) })).url);
      }
      say(msg, "Saving…");
      const sizes = f.sizes.value.split(",").map(s => s.trim()).filter(Boolean);
      await save([{
        id: Math.max(0, ...list.map(p => p.id)) + 1,
        name: f.name.value.trim(), price: Number(f.price.value), category: f.category.value,
        images: urls, sizes: sizes.length ? sizes : ["One Size"], rating: 0, orders: 0,
        condition: "Brand new", badge: f.badge.value || null,
        dateAdded: new Date().toISOString().slice(0, 10), description: f.description.value.trim()
      }, ...list]);
      f.reset(); photos = []; drawThumbs();
      say(msg, "Added! It’s now live on the store.", true);
    } catch (err) { say(msg, err.message); }
    btn.disabled = false;
  });

  if (window.__PREVIEW) $("#demoHint").hidden = false;
  if (token) open().catch(() => showDash(false));
})();
