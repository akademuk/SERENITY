document.addEventListener("DOMContentLoaded", () => {
  const themeSwitcher = document.getElementById("themeSwitcher");
  const toggleBtn = document.getElementById("themeSwitcherToggle");

  if (!themeSwitcher || !toggleBtn) return;

  // Toggle Panel
  toggleBtn.addEventListener("click", () => {
    themeSwitcher.classList.toggle("active");
  });

  // Theme Buttons
  const themeBtns = document.querySelectorAll(".theme-btn[data-theme]");
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all theme buttons
      themeBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Set theme
      const theme = btn.getAttribute("data-theme");
      if (theme === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    });
  });

  // Font Buttons
  const fontBtns = document.querySelectorAll(".theme-btn[data-font]");
  fontBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all font buttons
      fontBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Set font
      const font = btn.getAttribute("data-font");
      if (font === "serif") {
        document.documentElement.removeAttribute("data-font");
      } else {
        document.documentElement.setAttribute("data-font", font);
      }
    });
  });
});
