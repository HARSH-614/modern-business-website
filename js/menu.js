/**
 * Dynamic Menu Explorer & Modal Controller
 */

import { MENU_ITEMS, MENU_CATEGORIES } from "../data/menu.js";
import { cart } from "./cart.js";

let currentCategory = "All";
let searchQuery = "";
let currentFilterType = "all"; // 'all', 'veg', 'non-veg'
let currentSort = "recommended";

export function initMenu() {
  renderCategoryPills();
  renderMenuItems();
  setupFilterListeners();
  setupModalEvents();
}

function renderCategoryPills() {
  const container = document.getElementById("menuCategoriesPills");
  if (!container) return;

  container.innerHTML = MENU_CATEGORIES.map((cat) => `
    <button class="filter-pill ${cat === currentCategory ? "active" : ""}" data-category="${cat}">
      ${cat}
    </button>
  `).join("");

  container.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".filter-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderMenuItems();
    });
  });
}

export function renderMenuItems() {
  const grid = document.getElementById("menuItemsGrid");
  if (!grid) return;

  let filtered = MENU_ITEMS.filter((item) => {
    // Category match
    const catMatch = currentCategory === "All" || item.category === currentCategory;

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const searchMatch = !q || 
      item.name.toLowerCase().includes(q) ||
      (item.assameseName && item.assameseName.includes(q)) ||
      item.ingredients.some(i => i.toLowerCase().includes(q)) ||
      item.state.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q));

    // Diet filter
    const dietMatch = currentFilterType === "all" || 
      (currentFilterType === "veg" && item.dietaryType === "Veg") ||
      (currentFilterType === "non-veg" && item.dietaryType === "Non-Veg");

    return catMatch && searchMatch && dietMatch;
  });

  // Sorting
  if (currentSort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="font-size: 1.1rem; color: var(--color-text-muted);">No culinary dishes match your selected criteria.</p>
        <button id="resetMenuFiltersBtn" class="btn btn-outline-primary" style="margin-top: 16px;">Clear Filters</button>
      </div>
    `;
    document.getElementById("resetMenuFiltersBtn")?.addEventListener("click", () => {
      currentCategory = "All";
      searchQuery = "";
      currentFilterType = "all";
      document.getElementById("menuSearchInput").value = "";
      renderCategoryPills();
      renderMenuItems();
    });
    return;
  }

  grid.innerHTML = filtered.map((dish) => `
    <article class="food-card card-interactive reveal-on-scroll">
      <div class="food-card-media">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
        <span class="food-badge-diet ${dish.dietaryType.toLowerCase()}">${dish.dietaryType}</span>
        ${dish.isChefSpecial ? `<span class="food-badge-special">Chef's Special</span>` : ""}
      </div>
      <div class="food-card-body">
        <div class="food-meta">
          <span>${dish.state}</span>
          <span>🌶️ ${dish.spiceLevel}</span>
        </div>
        <h3 class="food-title">${dish.name}</h3>
        ${dish.assameseName ? `<div class="food-assamese-title">${dish.assameseName}</div>` : ""}
        <p class="food-desc">${dish.description}</p>
        <div class="food-card-footer">
          <div class="food-price">₹${dish.price}</div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-card-add view-details-btn" data-id="${dish.id}">Details</button>
            <button class="btn btn-primary quick-add-btn" data-id="${dish.id}" style="padding: 6px 14px; font-size: 0.85rem;">+ Add</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  // Attach event handlers
  grid.querySelectorAll(".view-details-btn").forEach((b) => {
    b.addEventListener("click", () => openFoodModal(b.getAttribute("data-id")));
  });

  grid.querySelectorAll(".quick-add-btn").forEach((b) => {
    b.addEventListener("click", () => {
      const dish = MENU_ITEMS.find((d) => d.id === b.getAttribute("data-id"));
      if (dish) {
        cart.addItem(dish, 1);
        window.showToast(`Added "${dish.name}" to platter`);
      }
    });
  });
}

function setupFilterListeners() {
  const searchInput = document.getElementById("menuSearchInput");
  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderMenuItems();
  });

  const dietRadios = document.querySelectorAll('input[name="dietFilter"]');
  dietRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentFilterType = e.target.value;
      renderMenuItems();
    });
  });

  const sortSelect = document.getElementById("menuSortSelect");
  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderMenuItems();
  });
}

function openFoodModal(id) {
  const dish = MENU_ITEMS.find((d) => d.id === id);
  if (!dish) return;

  const modal = document.getElementById("foodDetailModal");
  const container = document.getElementById("foodModalBody");

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-sm);" />
      <div>
        <span class="food-badge-diet ${dish.dietaryType.toLowerCase()}">${dish.dietaryType}</span>
        <h2 style="font-size: 1.6rem; margin-top: 8px;">${dish.name}</h2>
        ${dish.assameseName ? `<div style="font-family: var(--font-assamese); font-size: 1.1rem; color: var(--color-accent);">${dish.assameseName}</div>` : ""}
      </div>
      <p style="color: var(--color-text-muted);">${dish.description}</p>
      
      <div style="background: var(--color-surface-elevated); padding: 16px; border-radius: var(--radius-sm); font-size: 0.9rem;">
        <p><strong>Region / Origin:</strong> ${dish.state} (${dish.region})</p>
        <p><strong>Ingredients:</strong> ${dish.ingredients.join(", ")}</p>
        <p><strong>Portion & Prep:</strong> ${dish.servingSize} • ${dish.preparationTime}</p>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
        <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary);">₹${dish.price}</div>
        <button id="modalAddToCartBtn" class="btn btn-primary">Add to Order Platter</button>
      </div>
    </div>
  `;

  document.getElementById("modalAddToCartBtn")?.addEventListener("click", () => {
    cart.addItem(dish, 1);
    window.showToast(`Added "${dish.name}" to platter`);
    closeModal();
  });

  modal.classList.add("is-active");
}

function setupModalEvents() {
  const modal = document.getElementById("foodDetailModal");
  const closeBtn = document.getElementById("closeFoodModalBtn");

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function closeModal() {
  document.getElementById("foodDetailModal")?.classList.remove("is-active");
}