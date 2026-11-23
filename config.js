/**
 * MEBI ACCESSORIES — Global configuration
 * Change store-wide settings here. Everything else reads from this file.
 */

const STORE = {
  name: "MEBI ACCESSORIES",
  tagline: "Accessories and lifestyle, ordered on WhatsApp.",
  currencySymbol: "₦",
  whatsapp: "2347019987489",
  phoneDisplay: "+234 701 998 7489",
  phoneLink: "+2347019987489",
  address: "Nigeria",
  cartStorageKey: "mebi_cart_v1"
};

/** Format a whole-naira number into "₦18,000" */
function formatNaira(amount) {
  return STORE.currencySymbol + Number(amount).toLocaleString("en-NG");
}

/** WhatsApp link with the message pre-filled when one is given */
function buildWhatsAppLink(message) {
  const base = "https://wa.me/" + STORE.whatsapp;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
}

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove(); return ok;
    } catch (e2) { return false; }
  }
}

/** Open WhatsApp with the message ready. The customer taps Send to confirm. */
function sendViaWhatsApp(message, toastText) {
  if (typeof showToast === "function") showToast(toastText || "Opening WhatsApp…");
  window.open(buildWhatsAppLink(message), "_blank", "noopener");
}
