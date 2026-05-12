(function () {
  const galleryRoot = document.querySelector("[data-gallery-page]");
  const galleryData = window.PORTFOLIO_GALLERY;
  const items = [];
  let currentIndex = 0;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let dragStart = null;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderGallery() {
    if (!galleryRoot || !galleryData) return;
    galleryRoot.innerHTML = galleryData.images
      .map((image, index) => {
        const desc = image.description ? `<p class="caption">${escapeHtml(image.description)}</p>` : "";
        return `
          <article class="photo-item" data-photo-item>
            <div class="image-frame">
              <div class="panorama-scroll">
                <button type="button" data-lightbox-index="${index}" aria-label="Open ${escapeHtml(image.title)}">
                  <img
                    class="gallery-image"
                    src="${image.preview || image.src}"
                    data-full="${image.full || image.src}"
                    data-title="${escapeHtml(image.title)}"
                    data-description="${escapeHtml(image.description || "")}"
                    data-buy="${image.buy || "#"}"
                    alt="${escapeHtml(image.alt || image.title)}"
                    loading="lazy"
                    decoding="async"
                    draggable="false">
                </button>
              </div>
            </div>
            <div class="photo-meta">
              <div>
                <h2>${escapeHtml(image.title)}</h2>
                ${desc}
              </div>
              <div class="photo-links">
                <a href="${image.buy || "#"}">Inquire About Prints</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function collectItems() {
    items.length = 0;
    document.querySelectorAll("[data-lightbox-index], [data-lightbox]").forEach((trigger, index) => {
      const img = trigger.querySelector("img") || trigger;
      const item = {
        trigger,
        img,
        src: img.dataset.full || img.currentSrc || img.src,
        title: img.dataset.title || img.alt || "Untitled",
        description: img.dataset.description || "",
        buy: img.dataset.buy || "#"
      };
      trigger.dataset.lightboxIndex = String(index);
      items.push(item);
    });
  }

  function detectPanoramas() {
    document.querySelectorAll("[data-photo-item] img").forEach((img) => {
      const mark = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio >= 2.35) img.closest("[data-photo-item]").classList.add("is-panorama");
      };
      if (img.complete) mark();
      else img.addEventListener("load", mark, { once: true });
    });
  }

  function ensureLightbox() {
    if (document.querySelector(".lightbox")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <div class="lightbox-stage" data-stage>
          <img class="lightbox-image" alt="" draggable="false">
          <div class="lightbox-ui">
            <button class="icon-button" type="button" data-close aria-label="Close">&times;</button>
            <div>
              <button class="icon-button" type="button" data-zoom-out aria-label="Zoom out">-</button>
              <button class="icon-button" type="button" data-zoom-in aria-label="Zoom in">+</button>
            </div>
          </div>
          <button class="icon-button nav-button prev" type="button" data-prev aria-label="Previous image">&lt;</button>
          <button class="icon-button nav-button next" type="button" data-next aria-label="Next image">&gt;</button>
        </div>
        <div class="lightbox-info">
          <h2 data-lightbox-title></h2>
          <p data-lightbox-description></p>
          <div class="lightbox-actions">
            <a data-buy-link>Inquire About Prints</a>
          </div>
        </div>
      </div>`
    );
  }

  function updateTransform() {
    const img = document.querySelector(".lightbox-image");
    img.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function openLightbox(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const lightbox = document.querySelector(".lightbox");
    const image = lightbox.querySelector(".lightbox-image");
    image.src = item.src;
    image.alt = item.img.alt || item.title;
    lightbox.querySelector("[data-lightbox-title]").textContent = item.title;
    lightbox.querySelector("[data-lightbox-description]").textContent = item.description;
    lightbox.querySelector("[data-buy-link]").href = item.buy;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    resetTransform();
  }

  function closeLightbox() {
    document.querySelector(".lightbox").classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  }

  function bindLightbox() {
    ensureLightbox();
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox-index], [data-lightbox]");
      if (trigger) openLightbox(Number(trigger.dataset.lightboxIndex || 0));
      if (event.target.closest("[data-close]")) closeLightbox();
      if (event.target.closest("[data-prev]")) openLightbox(currentIndex - 1);
      if (event.target.closest("[data-next]")) openLightbox(currentIndex + 1);
      if (event.target.closest("[data-zoom-in]")) {
        scale = Math.min(scale + 0.25, 5);
        updateTransform();
      }
      if (event.target.closest("[data-zoom-out]")) {
        scale = Math.max(scale - 0.25, 0.5);
        updateTransform();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!document.querySelector(".lightbox").classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") openLightbox(currentIndex - 1);
      if (event.key === "ArrowRight") openLightbox(currentIndex + 1);
      if (event.key === "+" || event.key === "=") {
        scale = Math.min(scale + 0.25, 5);
        updateTransform();
      }
      if (event.key === "-") {
        scale = Math.max(scale - 0.25, 0.5);
        updateTransform();
      }
    });

    const stage = document.querySelector("[data-stage]");
    stage.addEventListener("wheel", (event) => {
      if (!document.querySelector(".lightbox").classList.contains("is-open")) return;
      event.preventDefault();
      scale = Math.min(Math.max(scale + (event.deltaY > 0 ? -0.12 : 0.12), 0.5), 5);
      updateTransform();
    }, { passive: false });

    stage.addEventListener("pointerdown", (event) => {
      dragStart = { x: event.clientX, y: event.clientY, tx: translateX, ty: translateY };
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!dragStart) return;
      translateX = dragStart.tx + event.clientX - dragStart.x;
      translateY = dragStart.ty + event.clientY - dragStart.y;
      updateTransform();
    });
    stage.addEventListener("pointerup", () => {
      dragStart = null;
      stage.classList.remove("is-dragging");
    });

    document.addEventListener("contextmenu", (event) => {
      if (event.target.closest("img")) event.preventDefault();
    });

    document.addEventListener("dragstart", (event) => {
      if (event.target.closest("img")) event.preventDefault();
    });
  }

  renderGallery();
  collectItems();
  detectPanoramas();
  bindLightbox();
})();



