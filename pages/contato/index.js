

/* ── Máscara de telefone ── */
function setupPhoneMask() {
  const phoneInput = document.getElementById('field-tel');
  if (!phoneInput) return;
  phoneInput.addEventListener('input', function() {
    let digits = this.value.replace(/\D/g, '').slice(0, 11);
    const isLandline = digits.length <= 10
    if (isLandline) digits = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else                digits = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    this.value = digits;
  });
}

/* ── Validação simples ── */
function validateForm() {
  const nameInput      = document.getElementById('field-nome');
  const emailInput     = document.getElementById('field-email');
  const mensageInput  = document.getElementById('field-mensagem');
  const privacyCheckbox  = document.getElementById('field-concordo');
  let isValid = true;

  [nameInput, emailInput, mensageInput].forEach(el => el.classList.remove('error'));

  if (!nameInput.value.trim()) { nameInput.classList.add('error'); isValid = false; }
  if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) { emailInput.classList.add('error'); isValid = false; }
  if (!mensageInput.value.trim()) { mensageInput.classList.add('error'); isValid = false; }
  if (!privacyCheckbox.checked) { isValid = false; showToast('⚠️ Aceite a política de privacidade.'); }

  return isValid;
}

/* ── Enviar formulário ── */
function submitForm() {
  const isFormComplete = validateForm()
  if (isFormComplete === true )
    alert("Email enviado!")
  else {
    alert("Erro: Verifique se não há campos vazios ou inválidos!")
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  setupPhoneMask();

  /* Botão finalizar → checkout */
  const checkoutButton = document.getElementById('btn-finalizar');
  if (checkoutButton) checkoutButton.addEventListener('click', () => {
    if (cartGetAll().length === 0) return;
    closeCart();
    window.location.href = '../checkout/index.html';
  });

  /* Enter não submete form acidentalmente */
  document.querySelectorAll('.contact-form input').forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') e.preventDefault();
    });
  });
});
