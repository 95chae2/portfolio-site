const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-kind]");
const hero = document.querySelector(".hero");
const youtubeWorkItems = document.querySelectorAll(".gallery-item[data-youtube]");
const thumbnailImages = document.querySelectorAll(".work-art img");
const profileImage = document.querySelector(".profile-image img");
const homeBrandLink = document.querySelector('.brand[href="#top"]');

function applyWorkFilter(activeFilter) {
  filterButtons.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.filter === activeFilter);
  });

  galleryItems.forEach((item) => {
    const shouldShow = activeFilter === "all" || item.dataset.kind === activeFilter;
    item.classList.toggle("is-hidden", !shouldShow);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = button.dataset.filter;

    applyWorkFilter(activeFilter);
    history.replaceState(null, "", activeFilter === "all" ? "#all" : `#${activeFilter}`);
  });
});

if (filterButtons.length) {
  const requestedFilter = window.location.hash.slice(1);
  const availableFilters = [...filterButtons].map((button) => button.dataset.filter);

  if (availableFilters.includes(requestedFilter)) {
    applyWorkFilter(requestedFilter);
  }
}

if (hero && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("mousemove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    hero.style.setProperty("--glow-x", `${Math.max(0, Math.min(100, x))}%`);
    hero.style.setProperty("--glow-y", `${Math.max(0, Math.min(100, y))}%`);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--glow-x", "34%");
    hero.style.setProperty("--glow-y", "32%");
  });
}

thumbnailImages.forEach((image) => {
  const setGifRatio = () => {
    const gifArt = image.closest('.gallery-item[data-kind="gif"] .work-art');

    if (!gifArt || !image.naturalWidth || !image.naturalHeight) {
      return;
    }

    gifArt.style.setProperty("--gif-ratio", `${image.naturalWidth} / ${image.naturalHeight}`);
  };

  if (image.complete) {
    setGifRatio();
  } else {
    image.addEventListener("load", setGifRatio);
  }

  image.addEventListener("error", () => {
    image.remove();
  });
});

if (profileImage) {
  profileImage.addEventListener("error", () => {
    profileImage.remove();
  });
}

if (homeBrandLink) {
  homeBrandLink.addEventListener("click", (event) => {
    event.preventDefault();
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}

function openYoutubeVideo(item) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${item.dataset.youtube}`;
  window.open(youtubeUrl, "_blank", "noopener,noreferrer");
}

youtubeWorkItems.forEach((item) => {
  const title = item.querySelector("h2")?.textContent || "Work video";

  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.setAttribute("aria-label", `${title} YouTube video open`);
  item.addEventListener("click", () => openYoutubeVideo(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openYoutubeVideo(item);
    }
  });
});
