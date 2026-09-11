const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const year = document.querySelector("#year");
const signalCard = document.querySelector(".signal-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

year.textContent = new Date().getFullYear();

if (!reducedMotion) {
  root.classList.add("motion-ready");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add("motion-started"));
  });
}

const updateProgress = () => {
  const scrollable = root.scrollHeight - root.clientHeight;
  const ratio = scrollable > 0 ? root.scrollTop / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};

updateProgress();
document.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const revealTargets = document.querySelectorAll(
  ".section .eyebrow, .section-heading-row > *, .value-item, .project-card, .workflow-step, " +
  ".experience-intro > *, .timeline-item, .tool-belt, .education-card, .certifications, .contact-shell > *"
);

if ("IntersectionObserver" in window && !reducedMotion) {
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
}

if ("IntersectionObserver" in window) {
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

const countMetrics = () => {
  document.querySelectorAll("[data-count-to]").forEach((metric) => {
    const target = Number(metric.dataset.countTo);
    const suffix = metric.dataset.countSuffix ?? "";
    const decimals = Number.isInteger(target) ? 0 : 1;
    const duration = 1050;
    let startedAt;

    const tick = (timestamp) => {
      startedAt ??= timestamp;
      const elapsed = Math.min(1, (timestamp - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      metric.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;

      if (elapsed < 1) requestAnimationFrame(tick);
    };

    metric.textContent = `${(0).toFixed(decimals)}${suffix}`;
    requestAnimationFrame(tick);
  });
};

if (!reducedMotion && signalCard) {
  if ("IntersectionObserver" in window) {
    const metricObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        countMetrics();
        observer.disconnect();
      },
      { threshold: 0.55 }
    );

    metricObserver.observe(signalCard);
  } else {
    countMetrics();
  }
}

if (!reducedMotion && signalCard && window.matchMedia("(pointer: fine)").matches) {
  signalCard.addEventListener("pointermove", (event) => {
    const bounds = signalCard.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    signalCard.style.setProperty("--tilt-x", `${vertical * -4}deg`);
    signalCard.style.setProperty("--tilt-y", `${horizontal * 5}deg`);
  });

  signalCard.addEventListener("pointerleave", () => {
    signalCard.style.setProperty("--tilt-x", "0deg");
    signalCard.style.setProperty("--tilt-y", "0deg");
  });
}
