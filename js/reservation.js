/**
 * Table Reservation Form Validator & Booking Request Handler
 */

import { CONFIG } from "./config.js";

export function initReservation() {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById("resDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("resName").value.trim();
    const phone = document.getElementById("resPhone").value.trim();
    const guests = parseInt(document.getElementById("resGuests").value, 10);
    const date = document.getElementById("resDate").value;
    const time = document.getElementById("resTime").value;
    const seating = document.getElementById("resSeating").value;

    if (!name || !phone || !date || !time) {
      window.showToast("Please fill in all required reservation fields.");
      return;
    }

    if (guests > CONFIG.operations.capacity) {
      window.showToast(`Our maximum group capacity is ${CONFIG.operations.capacity} guests.`);
      return;
    }

    // Reservation confirmation dialog
    const resId = "SBFV-RSV-" + Math.floor(100000 + Math.random() * 900000);
    
    const modal = document.getElementById("reservationConfirmModal");
    const summary = document.getElementById("resConfirmSummary");
    
    summary.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 2.5rem;">🌿</div>
        <h3 style="margin-top: 10px; color: var(--color-primary);">Table Request Received</h3>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">Reference ID: <strong>${resId}</strong></p>
      </div>
      <div style="background: var(--color-surface-elevated); padding: 16px; border-radius: var(--radius-sm); font-size: 0.95rem; line-height: 1.6;">
        <p><strong>Guest:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${phone}</p>
        <p><strong>Date & Time:</strong> ${date} at ${time}</p>
        <p><strong>Party Size:</strong> ${guests} Guests (${seating})</p>
      </div>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 16px; text-align: center;">
        Our team will contact you on WhatsApp/Phone to confirm table availability.
      </p>
    `;

    modal.classList.add("is-active");
    form.reset();
  });

  document.getElementById("closeResConfirmBtn")?.addEventListener("click", () => {
    document.getElementById("reservationConfirmModal")?.classList.remove("is-active");
  });
}