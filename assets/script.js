(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length && !reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    revealItems.forEach(item => observer.observe(item));
  }

  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const sectionLinks = navLinks.map(link => ({ link, section: document.getElementById(link.getAttribute("href").slice(1)) })).filter(item => item.section);

  try {
    const savedTheme = localStorage.getItem("ankith-theme");
    if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  } catch (error) {}

  if (themeButton) {
    const updateThemeButton = () => {
      const dark = root.dataset.theme === "dark";
      themeButton.textContent = dark ? "☼" : "☾";
      themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      themeButton.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    updateThemeButton();
    themeButton.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("ankith-theme", root.dataset.theme); } catch (error) {}
      updateThemeButton();
    });
  }

  const closeMenu = () => {
    if (!nav || !menuButton) return;
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  };
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  }

  // Set the active nav item from the same IDs used by the navigation links.
  const setActive = id => {
    sectionLinks.forEach(({link, section}) => {
      if (section.id === id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  if (sectionLinks.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5] });
    sectionLinks.forEach(({section}) => sectionObserver.observe(section));
  }
  sectionLinks.forEach(({link, section}) => link.addEventListener("click", () => setActive(section.id)));
  const initialId = location.hash ? location.hash.slice(1) : "home";
  if (sectionLinks.some(({section}) => section.id === initialId)) setActive(initialId);
  else setActive("home");

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
