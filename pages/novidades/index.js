/* ================================================
   GRÃO & ALMA — pages/novidades/index.js
   ================================================ */


document.addEventListener('DOMContentLoaded', function() {


  /* Botão finalizar → checkout */
  const btnF = document.getElementById('btn-finalizar');
  if (btnF) btnF.addEventListener('click', () => {
    if (cartGetAll().length === 0) return;
    closeCart();
    window.location.href = '../checkout/index.html';
  });
});
