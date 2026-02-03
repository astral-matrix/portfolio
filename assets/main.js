const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setupSwipeScroll = (container, options = {}) => {
  if (!container) return;

  const {
    threshold = 40,
    axis = "x",
    getScrollBy = () => Math.max(container.clientWidth * 0.85, 280),
  } = options;

  let startX = 0;
  let startY = 0;
  let isPointerDown = false;

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse") return;
    isPointerDown = true;
    startX = event.clientX;
    startY = event.clientY;
  };

  const onPointerUp = (event) => {
    if (!isPointerDown) return;
    isPointerDown = false;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (axis === "x" && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      container.scrollBy({
        left: deltaX < 0 ? getScrollBy() : -getScrollBy(),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
  };

  container.addEventListener("pointerdown", onPointerDown, { passive: true });
  container.addEventListener("pointerup", onPointerUp, { passive: true });
  container.addEventListener("pointercancel", onPointerUp, { passive: true });
};

const setupCarousel = () => {
  const track = document.querySelector("[data-carousel-track]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");

  if (!track || !prev || !next) return;

  const scrollBy = () => Math.max(track.clientWidth * 0.85, 280);

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollBy(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollBy(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  setupSwipeScroll(track, { getScrollBy: scrollBy });
};

const setupTabs = () => {
  const tabs = Array.from(document.querySelectorAll("[data-tab]"));
  const tabPanels = Array.from(document.querySelectorAll("[data-tab-content]"));

  if (!tabs.length || !tabPanels.length) return;

  const setActiveTab = (target) => {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === target);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.tabContent !== target);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });
};

const setupProjectGalleries = () => {
  const galleries = Array.from(document.querySelectorAll("[data-gallery]"));

  const togglePageDim = (isOpen) => {
    document.body.classList.toggle("is-gallery-open", isOpen);
  };

  const closeAllLightboxes = () => {
    galleries.forEach((gallery) => {
      const lightbox = gallery.querySelector("[data-gallery-lightbox]");
      if (lightbox) {
        lightbox.classList.remove("is-open");
      }
    });
    togglePageDim(false);
  };

  galleries.forEach((gallery) => {
    const track = gallery.querySelector("[data-gallery-track]");
    const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const dots = Array.from(gallery.querySelectorAll("[data-gallery-dot]"));
    const dotsContainer = gallery.querySelector("[data-gallery-dots]");
    const lightbox = gallery.querySelector("[data-gallery-lightbox]");
    const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
    const closeButton = gallery.querySelector("[data-gallery-close]");
    const viewport = gallery.querySelector(".gallery-viewport");

    if (!track || !slides.length) return;

    let index = 0;

    const syncGalleryLayout = () => {
      if (!viewport) return;
      const maxHeightValue = window.getComputedStyle(viewport).maxHeight;
      const maxHeight = Number.parseFloat(maxHeightValue) || 360;
      const heights = slides
        .map((slide) => slide.querySelector("img"))
        .filter(Boolean)
        .map((img) => img.getBoundingClientRect().height)
        .filter((height) => height > 0)
        .map((height) => Math.min(height, maxHeight));

      if (!heights.length) return;

      const maxVisibleHeight = Math.max(...heights);
      const dotsOffset = dotsContainer && !dotsContainer.classList.contains("is-hidden") ? 18 : 0;
      gallery.style.setProperty("--gallery-height", `${maxVisibleHeight + dotsOffset}px`);
      gallery.style.setProperty("--gallery-controls-y", `${maxVisibleHeight / 2}px`);
    };

    const updateViewportHeight = () => {
      if (!viewport) return;
      const img = slides[index].querySelector("img");
      if (!img) return;

      const computedMax = window.getComputedStyle(viewport).maxHeight;
      const maxHeight = Number.parseFloat(computedMax) || 360;
      const rect = img.getBoundingClientRect();
      if (!rect.height) return;
      const nextHeight = Math.min(rect.height, maxHeight);
      viewport.style.height = `${nextHeight}px`;
    };

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
      if (prev) {
        prev.classList.toggle("is-hidden", index === 0);
      }
      if (next) {
        next.classList.toggle("is-hidden", index === slides.length - 1);
      }
      updateViewportHeight();
    };

    const setIndex = (nextIndex) => {
      index = Math.max(0, Math.min(slides.length - 1, nextIndex));
      update();
    };

    if (prev) {
      prev.addEventListener("click", () => setIndex(index - 1));
    }
    if (next) {
      next.addEventListener("click", () => setIndex(index + 1));
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = Number(dot.dataset.index || 0);
        setIndex(target);
      });
    });

    if (dotsContainer && slides.length <= 1) {
      dotsContainer.classList.add("is-hidden");
    }

    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img || !lightbox || !lightboxImage) return;
      img.addEventListener("click", () => {
        lightboxImage.src = img.src;
        lightbox.classList.add("is-open");
        togglePageDim(true);
      });
      if (!img.complete) {
        img.addEventListener("load", () => {
          updateViewportHeight();
          syncGalleryLayout();
        });
      }
    });

    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
          lightbox.classList.remove("is-open");
          togglePageDim(false);
        }
      });
    }

    if (closeButton && lightbox) {
      closeButton.addEventListener("click", () => {
        lightbox.classList.remove("is-open");
        togglePageDim(false);
      });
    }

    update();
    syncGalleryLayout();
  });

  window.addEventListener("resize", () => {
    galleries.forEach((gallery) => {
      const viewport = gallery.querySelector(".gallery-viewport");
      const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
      const track = gallery.querySelector("[data-gallery-track]");
      if (!viewport || !slides.length || !track) return;
      const transform = track.style.transform || "";
      const indexMatch = transform.match(/-\s*(\d+(?:\.\d+)?)%/);
      const index = indexMatch ? Number(indexMatch[1]) / 100 : 0;
      const img = slides[Math.round(index)]?.querySelector("img");
      if (!img) return;
      const computedMax = window.getComputedStyle(viewport).maxHeight;
      const maxHeight = Number.parseFloat(computedMax) || 360;
      const rect = img.getBoundingClientRect();
      if (!rect.height) return;
      viewport.style.height = `${Math.min(rect.height, maxHeight)}px`;
      const dotsContainer = gallery.querySelector("[data-gallery-dots]");
      const heights = slides
        .map((slide) => slide.querySelector("img"))
        .filter(Boolean)
        .map((image) => image.getBoundingClientRect().height)
        .filter((height) => height > 0)
        .map((height) => Math.min(height, maxHeight));
      if (!heights.length) return;
      const maxVisibleHeight = Math.max(...heights);
      const dotsOffset = dotsContainer && !dotsContainer.classList.contains("is-hidden") ? 18 : 0;
      gallery.style.setProperty("--gallery-height", `${maxVisibleHeight + dotsOffset}px`);
      gallery.style.setProperty("--gallery-controls-y", `${maxVisibleHeight / 2}px`);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllLightboxes();
    }
  });
};

const setupTagFilters = () => {
  const filterBars = Array.from(document.querySelectorAll("[data-tag-filter]"));

  const findGridForFilter = (filterBar) => {
    let sibling = filterBar.nextElementSibling;
    while (sibling) {
      if (sibling.querySelector?.("[data-tag-filter-grid]")) {
        return sibling.querySelector("[data-tag-filter-grid]");
      }
      sibling = sibling.nextElementSibling;
    }
    return document.querySelector("[data-tag-filter-grid]");
  };

  filterBars.forEach((filterBar) => {
    const buttons = Array.from(filterBar.querySelectorAll("[data-tag-filter-button]"));
    const grid = findGridForFilter(filterBar);
    const items = grid ? Array.from(grid.querySelectorAll("[data-tag-filter-item]")) : [];

    if (!buttons.length || !items.length) return;

    const setActive = (targetTag) => {
      buttons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.tag === targetTag);
      });

      items.forEach((item) => {
        const tags = (item.dataset.tags || "").split("|").filter(Boolean);
        const shouldShow = targetTag === "all" || tags.includes(targetTag);
        item.style.display = shouldShow ? "" : "none";
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tag = button.dataset.tag || "all";
        setActive(tag);
      });
    });

    setActive("all");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupCarousel();
  setupTabs();
  setupProjectGalleries();
  setupTagFilters();

  const swipeGrids = Array.from(document.querySelectorAll("[data-swipe-scroll]"));
  swipeGrids.forEach((grid) => setupSwipeScroll(grid));

  const backLink = document.querySelector("[data-back-link]");
  if (backLink) {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const baseUrl = document.body.dataset.baseurl || "";
    const projectsUrl = `${baseUrl}/projects`.replace(/\/{2,}/g, "/");

    if (from === "projects") {
      backLink.setAttribute("href", projectsUrl);
    } else if (from === "home") {
      backLink.setAttribute("href", `${baseUrl}/`);
    } else if (document.referrer && document.referrer.startsWith(window.location.origin)) {
      backLink.setAttribute("href", document.referrer);
    }
  }
});
