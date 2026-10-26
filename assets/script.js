(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length && !reduceMotion && "IntersectionObserver" in window) {
    root.classList.add("js-motion");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach(item => observer.observe(item));
  }
  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const savedTheme = localStorage.getItem("ankith-theme");
  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  if (themeButton) {
    const updateLabel = () => {
      const dark = root.dataset.theme === "dark";
      themeButton.textContent = dark ? "☼" : "☾";
      themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    updateLabel();
    themeButton.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("ankith-theme", root.dataset.theme);
      updateLabel();
    });
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
