/**
 * Reactive Cart & Calculation Engine
 * Handles order item state, localStorage synchronization, fee & tax computations.
 */

import { CONFIG } from "./config.js";

const STORAGE_KEY = "sbfv_user_cart_v1";

class CartStore {
  constructor() {
    this.items = this.loadFromStorage();
    this.orderType = "delivery"; // 'dine-in', 'takeaway', 'delivery'
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getState());
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  addItem(dish, quantity = 1) {
    const existing = this.items.find((item) => item.id === dish.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: dish.id,
        name: dish.name,
        assameseName: dish.assameseName || "",
        price: dish.price,
        image: dish.image,
        quantity: quantity
      });
    }
    this.saveToStorage();
  }

  updateQuantity(id, delta) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter((i) => i.id !== id);
    }
    this.saveToStorage();
  }

  removeItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this.saveToStorage();
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  setOrderType(type) {
    this.orderType = type;
    this.notify();
  }

  getState() {
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let deliveryFee = 0;
    if (this.orderType === "delivery" && itemCount > 0) {
      deliveryFee = subtotal >= CONFIG.operations.delivery.freeDeliveryThreshold 
        ? 0 
        : CONFIG.operations.delivery.baseFee;
    }

    const gst = Math.round((subtotal * CONFIG.operations.taxes.gstPercentage) / 100);
    const grandTotal = subtotal + deliveryFee + gst;

    return {
      items: this.items,
      itemCount,
      subtotal,
      deliveryFee,
      gst,
      grandTotal,
      orderType: this.orderType
    };
  }
}

export const cart = new CartStore();