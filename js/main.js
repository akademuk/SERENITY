/**
 * SERENITY BAY - Main JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. Preloader
  const loader = document.querySelector(".loader");
  const loaderLogo = document.querySelector(".loader__logo");
  const loaderBar = document.querySelector(".loader__bar");

  if (loader) {
    const tl = gsap.timeline();

    tl.to(loaderLogo, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    })
      .to(loaderBar, {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to(loader, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2,
      });
  }

  // 0.2 Magnetic Buttons
  const magneticBtns = document.querySelectorAll(
    ".btn, .play-btn-large, .cartography__hotspot"
  );
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3 /* Increased strength */,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });

  // 0.4 Tab Title (Page Visibility)
  const originalTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document.title = "Silence awaits...";
    } else {
      document.title = originalTitle;
    }
  });

  // 0.5 Ghost Concierge (Scroll Direction)
  const ghostConcierge = document.getElementById("ghostConcierge");
  let lastScrollY = window.scrollY;

  if (ghostConcierge) {
    window.addEventListener(
      "scroll",
      () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling Down
          ghostConcierge.classList.add("hidden");
        } else {
          // Scrolling Up
          ghostConcierge.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
      },
      { passive: true }
    );
  }

  // 1. Initialize Lenis (Smooth Scroll)
  const lenis = new Lenis({
    duration: 1.5, // Slower, more luxurious scroll
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 1.1 Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.startsWith("#modal")) return; // Skip empty links or modals

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement);
      }
    });
  });

  // 2. Initialize Swiper (Dining)
  const diningSwiper = new Swiper(".dining-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 1000,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // 2.1 Initialize Swiper (Accommodations)
  const accommodationsSwiper = new Swiper(".accommodations-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // 2.2 Initialize Nested Swiper (Accommodation Gallery)
  const accommodationInnerSwiper = new Swiper(".accommodation-inner-slider", {
    nested: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });

  // 3. Initialize Fancybox
  Fancybox.bind("[data-fancybox]", {
    // Custom options
  });

  // 4. GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  // A. Split Text Reveal (Headings)
  const splitTypes = document.querySelectorAll("[data-split-text]");
  splitTypes.forEach((char, i) => {
    const text = new SplitType(char, { types: "words, chars" });

    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: char,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 100,
      opacity: 0,
      rotation: 5,
      duration: 1,
      stagger: 0.03,
      ease: "power4.out",
    });
  });

  // B. Fade Up Elements
  const revealElements = document.querySelectorAll("[data-reveal]");
  revealElements.forEach((element) => {
    gsap.fromTo(
      element,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
      }
    );
  });

  // C. Parallax Images
  const parallaxImages = document.querySelectorAll("[data-parallax-image] img");
  parallaxImages.forEach((img) => {
    gsap.to(img, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Hero Gradient Animation
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      onEnter: () => heroSection.classList.add("hero--gradient-active"),
      onEnterBack: () => heroSection.classList.add("hero--gradient-active"),
      onLeave: () => heroSection.classList.remove("hero--gradient-active"),
      onLeaveBack: () => heroSection.classList.remove("hero--gradient-active"),
    });

    gsap.to(heroSection, {
      duration: 1,
      ease: "none",
      "--hero-gradient-angle": "405deg",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // 4. Header Scroll Effect
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 4.5 Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburger.classList.toggle("active"); // Optional: for hamburger animation
      document.body.classList.toggle("no-scroll"); // Prevent scrolling when menu is open

      if (nav.classList.contains("active")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.classList.remove("active");
        document.body.classList.remove("no-scroll");
        lenis.start();
      });
    });
  }

  // 5. Floating Theme Switcher
  const themeSwitcher = document.getElementById("themeSwitcher");
  const themeToggle = document.getElementById("themeSwitcherToggle");
  const themeBtns = document.querySelectorAll("[data-theme]");
  const fontBtns = document.querySelectorAll("[data-font]");

  if (themeSwitcher && themeToggle) {
    // Toggle Panel
    themeToggle.addEventListener("click", () => {
      themeSwitcher.classList.toggle("active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!themeSwitcher.contains(e.target)) {
        themeSwitcher.classList.remove("active");
      }
    });

    // Theme Logic
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;

        // Update Active State
        themeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Apply Theme
        document.body.classList.remove("theme-sunrise", "theme-ocean");
        if (theme !== "default") {
          document.body.classList.add(`theme-${theme}`);
        }
      });
    });

    // Font Logic
    fontBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const font = btn.dataset.font;

        // Update Active State
        fontBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Apply Font
        document.body.classList.remove("font-serif", "font-mono");
        if (font !== "serif") {
          // Default is serif-like (Playfair), so 'serif' is default
          // If user selects 'mono', add class
          document.body.classList.add(`font-${font}`);
        }
      });
    });
  }

  // 6. Booking Form Submission
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    // 6.1 Custom Select Logic
    const customSelects = document.querySelectorAll(".custom-select");

    customSelects.forEach((select) => {
      const trigger = select.querySelector(".custom-select__trigger");
      const options = select.querySelectorAll(".custom-option");
      const input = select.querySelector("input[type='hidden']");
      const triggerSpan = trigger.querySelector("span");

      // Toggle Open
      trigger.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent closing immediately
        // Close other selects
        customSelects.forEach((other) => {
          if (other !== select) other.classList.remove("open");
        });
        select.classList.toggle("open");
      });

      // Option Click
      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          // Update UI
          triggerSpan.textContent = option.textContent;
          options.forEach((opt) => opt.classList.remove("selected"));
          option.classList.add("selected");

          // Update Hidden Input
          if (input) {
            input.value = option.getAttribute("data-value");
          }

          // Close Select
          select.classList.remove("open");
        });
      });
    });

    // Close selects when clicking outside
    document.addEventListener("click", () => {
      customSelects.forEach((select) => select.classList.remove("open"));
    });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simulate API call
      const btn = bookingForm.querySelector("button[type='submit']");
      const originalText = btn.textContent;
      btn.textContent = "Transmitting...";
      btn.disabled = true;

      setTimeout(() => {
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
        bookingForm.reset();

        // Open Thank You Modal
        Fancybox.show([{ src: "#modal-thank-you", type: "inline" }]);
      }, 1500);
    });
  }

  // 7. Service Worker Registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then(
        (registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        (err) => {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }
});
