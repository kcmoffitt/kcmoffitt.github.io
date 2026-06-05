const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const section = location.pathname.split("/").filter(Boolean)[0] || "";
const activeSection = ["papers", "frameworks", "whitepapers"].includes(section) ? "library" : section;
document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const linkUrl = new URL(href, location.href);
  const linkSection = linkUrl.pathname.split("/").filter(Boolean)[0] || "";
  if (activeSection === linkSection) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll(".global-search").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input[type='search']");
    const query = encodeURIComponent(input.value.trim());
    if (query) {
      location.href = `library/index.html?q=${query}`;
    }
  });
});
