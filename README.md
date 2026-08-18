# S. BARUAH FOODYVERSE — Official Web Platform

> **Tagline:** A Taste of Assam. A Journey Across India.  
> **Founder & Owner:** Sajal Baruah  
> **Location:** Pabhoi Panchali, PIN 784174, District — Biswanath, Assam, India  
> **Coordinates:** 26.815454, 93.146444  

---

## 1. Project Overview
The website is developed as the production-oriented digital foundation for **S. BARUAH FOODYVERSE**. It unifies authentic Assamese heritage food, pan-Indian culinary diversity, and a peaceful garden dining atmosphere.

## 2. Implemented Features
- **Centralized Configuration (`js/config.js`):** Business phone, WhatsApp, email, coordinates, hours, and capacity are managed in a single file.
- **Interactive Menu Explorer (`js/menu.js` & `data/menu.js`):** Live keyword search, dietary filters (Veg/Non-Veg), category pills, sorting, and food details modal.
- **Reactive Platter & Cart (`js/cart.js`):** Supports Dine-in, Takeaway, and Home Delivery with GST and delivery threshold calculations.
- **Table Booking (`js/reservation.js`):** Validated reservation request workflow respecting venue capacity (~28 guests).
- **Dual Language Support (`js/translations.js`):** Real-time switching between English and Assamese (`অসমীয়া`).
- **Dark/Light Mode:** Seamless theme switcher persisted in localStorage.
- **SEO & PWA Ready:** Semantic HTML5, Schema.org `Restaurant` structured data, `manifest.json`, and offline `service-worker.js`.

## 3. How to Run Locally
1. Clone or download this project repository.
2. Serve the root folder with any static web server (e.g. `npx serve .`, Live Server extension in VS Code, or Python `python3 -m http.server 8080`).
3. Open `http://localhost:8080` in your web browser.