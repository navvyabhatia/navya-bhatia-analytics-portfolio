const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const year = document.querySelector("#year");
const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

year.textContent = new Date().getFullYear();

const updateProgress = () => {
  const scrollable = root.scrollHeight - root.clientHeight;
  const ratio = scrollable > 0 ? root.scrollTop / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};

updateProgress();
document.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const revealTargets = document.querySelectorAll(
  ".value-item, .project-card, .workflow-step, .timeline-item, .education-card, .certifications"
);

if ("IntersectionObserver" in window) {
  root.classList.add("has-reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-order", index % 4);
    revealObserver.observe(target);
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        link.toggleAttribute("aria-current", isCurrent);
      });
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55%" }
  );

  trackedSections.forEach((section) => navObserver.observe(section));
}
