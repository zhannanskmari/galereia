(() => {
  "use strict";

  const workIds = Array.from(document.querySelectorAll(".js-view")).map((el) => el.dataset.id);

  /* ---------- Tabs ---------- */
  const tabDynamic = document.getElementById("tab-dynamic");
  const tabGrid = document.getElementById("tab-grid");
  const viewDynamic = document.getElementById("view-dynamic");
  const viewGrid = document.getElementById("view-grid");

  function activate(tab) {
    const isDynamic = tab === "dynamic";
    tabDynamic.classList.toggle("is-active", isDynamic);
    tabGrid.classList.toggle("is-active", !isDynamic);
    tabDynamic.setAttribute("aria-selected", String(isDynamic));
    tabGrid.setAttribute("aria-selected", String(!isDynamic));
    viewDynamic.classList.toggle("is-active", isDynamic);
    viewDynamic.hidden = !isDynamic;
    viewGrid.classList.toggle("is-active", !isDynamic);
    viewGrid.hidden = isDynamic;
    if (isDynamic) {
      swiper.update();
      swiper.slideTo(0, 0);
    }
  }
  tabDynamic.addEventListener("click", () => activate("dynamic"));
  tabGrid.addEventListener("click", () => activate("grid"));

  /* ---------- Swiper ---------- */
  const swiperEl = document.querySelector(".swiper");
  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 24,
    centeredSlides: true,
    loop: true,
    grabCursor: true,
    speed: 550,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { prevEl: ".nav-arrow--prev", nextEl: ".nav-arrow--next" },
  });

  /* ---------- Пауза / Старт ---------- */
  const playToggle = document.getElementById("play-toggle");
  let autoplayOn = true;

  playToggle.addEventListener("click", () => {
    if (autoplayOn) {
      swiper.autoplay.stop();       // мгновенно замирает на текущем кадре
      autoplayOn = false;
      playToggle.textContent = "Старт";
    } else {
      swiper.autoplay.start();      // плавно возобновляется с этой же картины
      autoplayOn = true;
      playToggle.textContent = "Пауза";
    }
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  let currentIndex = 0;

  function openView(id) {
    currentIndex = workIds.indexOf(id);
    if (currentIndex < 0) currentIndex = 0;
    render();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function render() {
    lbImg.src = `img/works/${workIds[currentIndex]}.jpg`;
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + workIds.length) % workIds.length;
    render();
  }

  document.querySelectorAll(".js-view").forEach((el) =>
    el.addEventListener("click", () => openView(el.dataset.id))
  );
  document.querySelector(".js-bg-close").addEventListener("click", close);
  document.querySelector(".js-prev").addEventListener("click", () => step(-1));
  document.querySelector(".js-next").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
