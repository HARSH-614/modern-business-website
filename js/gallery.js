/**
 * Gallery & Lightbox Controller
 */

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80", category: "Food", caption: "Authentic Assamese River Fish Curry" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", category: "Garden", caption: "Peaceful Garden Dining Ambience" },
  { src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80", category: "Food", caption: "Aromatic Charcoal Dum Biryani" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80", category: "Restaurant", caption: "Warm Natural Wood Interior Decor" }
];

export function initGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  container.innerHTML = GALLERY_IMAGES.map((img, idx) => `
    <div class="gallery-item card-interactive" data-index="${idx}" style="cursor: pointer; position: relative; height: 220px; overflow: hidden; border-radius: var(--radius-sm);">
      <img src="${img.src}" alt="${img.caption}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
      <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 12px; color: #fff; font-size: 0.85rem;">
        ${img.caption}
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.getAttribute("data-index"), 10);
      openLightbox(idx);
    });
  });
}

function openLightbox(index) {
  const img = GALLERY_IMAGES[index];
  const modal = document.getElementById("galleryLightboxModal");
  const imgEl = document.getElementById("lightboxImage");
  const captionEl = document.getElementById("lightboxCaption");

  if (imgEl && captionEl && modal) {
    imgEl.src = img.src;
    captionEl.innerText = img.caption;
    modal.classList.add("is-active");
  }

  document.getElementById("closeLightboxBtn")?.addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
}