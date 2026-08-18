/**
 * Checkout & Order Processing Controller
 */

import { cart } from "./cart.js";
import { CONFIG } from "./config.js";

export function initCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  // Sync order type toggle with checkout form visibility
  const deliveryFields = document.getElementById("deliveryAddressBlock");
  const tableFields = document.getElementById("dineInTableBlock");

  cart.subscribe((state) => {
    if (deliveryFields && tableFields) {
      if (state.orderType === "delivery") {
        deliveryFields.style.display = "block";
        tableFields.style.display = "none";
      } else if (state.orderType === "dine-in") {
        deliveryFields.style.display = "none";
        tableFields.style.display = "block";
      } else {
        deliveryFields.style.display = "none";
        tableFields.style.display = "none";
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const state = cart.getState();

    if (state.items.length === 0) {
      window.showToast("Your platter is empty. Add dishes to order.");
      return;
    }

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Cash";

    if (!name || !phone) {
      window.showToast("Please enter your name and phone number.");
      return;
    }

    const orderId = "SBFV-" + Math.floor(100000 + Math.random() * 900000);

    // Render Order Confirmation
    const modal = document.getElementById("orderConfirmModal");
    const container = document.getElementById("orderConfirmBody");

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 2.5rem;">🍲</div>
        <h3 style="color: var(--color-primary); margin-top: 8px;">Order Placed Successfully</h3>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">Order Reference: <strong>${orderId}</strong></p>
      </div>

      <div style="background: var(--color-surface-elevated); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
        <p><strong>Customer:</strong> ${name} (${phone})</p>
        <p><strong>Order Type:</strong> ${state.orderType.toUpperCase()}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total Amount:</strong> ₹${state.grandTotal}</p>
      </div>

      <p style="font-size: 0.85rem; color: var(--color-text-muted); text-align: center;">
        Thank you for ordering with ${CONFIG.brand.name}. Our kitchen team at Pabhoi Panchali is preparing your dishes.
      </p>
    `;

    modal.classList.add("is-active");
    cart.clear();
    form.reset();
  });

  document.getElementById("closeOrderConfirmBtn")?.addEventListener("click", () => {
    document.getElementById("orderConfirmModal")?.classList.remove("is-active");
  });
}