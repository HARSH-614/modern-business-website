/**
 * Application Bootstrap & Global Orchestrator
 */

import { CONFIG } from "./config.js";
import { TRANSLATIONS } from "./translations.js";
import { cart } from "./cart.js";
import { initMenu } from "./menu.js";
import { initReservation } from "./reservation.js";
import { initCheckout } from "./checkout.js";
import { initGallery } from "./gallery.js";
import { OFFERS_DATA } from "../data/offers.js";
import { EVENTS_DATA } from "../data/events.js";

let currentLang = "en";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initNav();
  initMenu();
  initReservation();
  initCheckout();
  initGallery();
  renderOffers();
  renderEvents();
  setupCartUI();
  setupScrollReveal();
  registerPWA();
});

// Toast notification helper
window.showToast = function(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Theme Switcher
function initTheme() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("sbfv_theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", savedTheme);

  toggleBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("sbfv_theme", next);
    window.showToast(`Switched to ${next} mode`);
  });
}

// Language Switcher
function initLanguage() {
  const switchBtn = document.getElementById("langSwitchBtn");
  
  switchBtn?.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "as" : "en";
    switchBtn.innerText = currentLang === "en" ? "অসমীয়া" : "English";
    applyTranslations(currentLang);
    window.showToast(currentLang === "en" ? "Language: English" : "ভাষা: অসমীয়া");
  });
}

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const keyPath = el.getAttribute("data-i18n").split(".");
    let val = t;
    for (const key of keyPath) {
      val = val ? val[key] : null;
    }
    if (val) el.innerText = val;
  });
}

// Navigation and Sticky Effects
function initNav() {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  mobileToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("is-open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("is-open");
    });
  });
}

// Cart UI Drawer bindings
function setupCartUI() {
  const trigger = document.getElementById("cartTriggerBtn");
  const drawer = document.getElementById("cartDrawerModal");
  const closeBtn = document.getElementById("closeCartDrawerBtn");
  const countBadges = document.querySelectorAll(".cart-count-display");
  const itemsContainer = document.getElementById("cartDrawerItems");

  trigger?.addEventListener("click", () => drawer?.classList.add("is-active"));
  closeBtn?.addEventListener("click", () => drawer?.classList.remove("is-active"));

  cart.subscribe((state) => {
    countBadges.forEach((b) => (b.innerText = state.itemCount));

    if (itemsContainer) {
      if (state.items.length === 0) {
        itemsContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 0; color: var(--color-text-muted);">
            <div style="font-size: 2rem;">🍲</div>
            <p style="margin-top: 10px;">Your food platter is empty.</p>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = state.items.map((item) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
            <div>
              <div style="font-weight: 600;">${item.name}</div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted);">₹${item.price} each</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1" style="padding: 2px 8px;">-</button>
              <span style="font-weight: 600;">${item.quantity}</span>
              <button class="cart-qty-btn" data-id="${item.id}" data-delta="1" style="padding: 2px 8px;">+</button>
            </div>
          </div>
        `).join("");

        itemsContainer.querySelectorAll(".cart-qty-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const delta = parseInt(btn.getAttribute("data-delta"), 10);
            cart.updateQuantity(id, delta);
          });
        });
      }
    }

    // Totals display
    document.getElementById("cartSubtotalDisplay").innerText = `₹${state.subtotal}`;
    document.getElementById("cartDeliveryFeeDisplay").innerText = `₹${state.deliveryFee}`;
    document.getElementById("cartGstDisplay").innerText = `₹${state.gst}`;
    document.getElementById("cartGrandTotalDisplay").innerText = `₹${state.grandTotal}`;
  });

  // Order Type selector buttons
  document.querySelectorAll(".order-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".order-type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cart.setOrderType(btn.getAttribute("data-type"));
    });
  });

  document.getElementById("proceedToCheckoutBtn")?.addEventListener("click", () => {
    if (cart.getState().items.length === 0) {
      window.showToast("Add items to your platter first.");
      return;
    }
    drawer?.classList.remove("is-active");
    const checkoutSec = document.getElementById("checkout");
    checkoutSec?.scrollIntoView({ behavior: "smooth" });
  });
}

function renderOffers() {
  const container = document.getElementById("offersGrid");
  if (!container) return;

  container.innerHTML = OFFERS_DATA.map((off) => `
    <div class="feature-card card-interactive">
      <span style="background: var(--color-accent); color: #101713; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;">${off.badge}</span>
      <h3 style="font-size: 1.3rem; margin-top: 12px;">${off.discount}</h3>
      <h4 style="font-size: 1.05rem; color: var(--color-primary);">${off.title}</h4>
      <p style="font-size: 0.88rem; color: var(--color-text-muted); margin: 8px 0;">${off.description}</p>
      <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-accent);">Code: ${off.code}</div>
    </div>
  `).join("");
}

function renderEvents() {
  const container = document.getElementById("eventsGrid");
  if (!container) return;

  container.innerHTML = EVENTS_DATA.map((evt) => `
    <div class="feature-card card-interactive">
      <div style="font-size: 2.2rem; margin-bottom: 8px;">${evt.icon}</div>
      <h3 style="font-size: 1.25rem;">${evt.title}</h3>
      <div style="font-size: 0.85rem; color: var(--color-accent); font-weight: 600; margin-bottom: 8px;">${evt.capacity}</div>
      <p style="font-size: 0.9rem; color: var(--color-text-muted);">${evt.description}</p>
    </div>
  `).join("");
}

function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
}

function registerPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch((err) => {
        console.log("ServiceWorker registration skipped or failed: ", err);
      });
    });
  }
}