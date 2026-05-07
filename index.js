/* ── CONTADORES ANIMADOS ── */
(function initCounters() {
  const statElements = document.querySelectorAll('.stat-num');
  if (!statElements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element     = entry.target;
      const targetValue = parseInt(element.dataset.target, 10);
      let   current     = 0;
      const step        = Math.max(1, Math.ceil(targetValue / 60));

      const timer = setInterval(() => {
        current = Math.min(current + step, targetValue);
        element.textContent = current;
        if (current >= targetValue) clearInterval(timer);
      }, 25);

      observer.unobserve(element);
    });
  }, { threshold: 0.5 });

  statElements.forEach(element => observer.observe(element));
})();