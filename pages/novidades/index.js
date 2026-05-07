/* ================================================
   GRÃO & ALMA — pages/novidades/index.js
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Botão finalizar → checkout */
  const checkoutButton = document.getElementById('btn-finalizar');
  if (checkoutButton) checkoutButton.addEventListener('click', () => {
    if (cartGetAll().length === 0) return;
    closeCart();
    window.location.href = '../checkout/index.html';
  });

});