/**
 * S. BARUAH FOODYVERSE - Centralized Configuration
 * Single source of truth for restaurant business details, operating parameters,
 * and delivery configurations.
 */

export const CONFIG = {
  brand: {
    name: "S. BARUAH FOODYVERSE",
    shortName: "Foodyverse",
    tagline: "A Taste of Assam. A Journey Across India.",
    subTagline: "Rooted in Assam. Inspired by India.",
    founder: {
      name: "Sajal Baruah",
      designation: "Founder & Owner",
      quote: "Built around a passion for food, Assam, and the simple joy of bringing people together around a table."
    }
  },
  contact: {
    phone: "+91 60019 50614",
    phoneClean: "+916001950614",
    whatsapp: "+91 96780 92519",
    whatsappClean: "919678092519",
    email: "sajalbaruah65@gmail.com"
  },
  location: {
    locality: "Pabhoi Panchali",
    district: "Biswanath",
    state: "Assam",
    country: "India",
    pin: "784174",
    fullAddress: "Pabhoi Panchali, Biswanath, Assam - 784174, India",
    coordinates: {
      latitude: 26.815454,
      longitude: 93.146444
    },
    googleMapsEmbedUrl: "https://www.google.com/maps?q=26.815454,93.146444&hl=en&z=16&output=embed",
    googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=26.815454,93.146444"
  },
  social: {
    instagram: "https://instagram.com/sajalbaruah__________",
    facebook: "https://facebook.com/sajalbaruah",
    youtube: ""
  },
  operations: {
    currency: "₹",
    currencyCode: "INR",
    capacity: 28,
    openingHours: {
      display: "10:00 AM – 10:00 PM",
      openTime: "10:00",
      closeTime: "22:00",
      days: "Monday – Sunday"
    },
    delivery: {
      enabled: true,
      radiusKm: 10,
      baseFee: 30,
      freeDeliveryThreshold: 499,
      minOrderAmount: 150,
      estimatedMinutes: "35–45"
    },
    taxes: {
      gstPercentage: 5
    }
  },
  status: {
    isOrderingLive: false,
    notice: "Digital pre-launch preview. Live online ordering and table booking will open soon."
  }
};