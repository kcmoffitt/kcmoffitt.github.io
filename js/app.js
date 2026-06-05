const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentPath = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  if (href.endsWith(currentPath) || location.pathname.includes(`/${href.split("/")[0]}/`)) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll(".global-search").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input[type='search']");
    const query = encodeURIComponent(input.value.trim());
    if (query) {
      location.href = `papers/index.html?q=${query}`;
    }
  });
});
