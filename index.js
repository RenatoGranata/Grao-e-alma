/* ================================================
   GRÃO & ALMA — index.js
   JavaScript exclusivo da página inicial:
   Contadores animados
   (canvas, carrinho e navbar estão no cart.js)
   ================================================ */

/* ── CONTADORES ANIMADOS ── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let cur      = 0;
      const step   = Math.max(1, Math.ceil(target / 60));
      const timer  = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(timer);
      }, 25);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();
