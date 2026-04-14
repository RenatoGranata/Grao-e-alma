

/* ── Máscara de telefone ── */
function setupTelMask() {
  const tel = document.getElementById('field-tel');
  if (!tel) return;
  tel.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else                v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    this.value = v;
  });
}

/* ── Validação simples ── */
function validarFormulario() {
  const nome      = document.getElementById('field-nome');
  const email     = document.getElementById('field-email');
  const mensagem  = document.getElementById('field-mensagem');
  const concordo  = document.getElementById('field-concordo');
  let ok = true;

  [nome, email, mensagem].forEach(el => el.classList.remove('error'));

  if (!nome.value.trim()) { nome.classList.add('error'); ok = false; }
  if (!email.value.includes('@') || !email.value.includes('.')) { email.classList.add('error'); ok = false; }
  if (!mensagem.value.trim()) { mensagem.classList.add('error'); ok = false; }
  if (!concordo.checked) { ok = false; showToast('⚠️ Aceite a política de privacidade.'); }

  return ok;
}

/* ── Enviar formulário ── */
function enviarFormulario() {
  const isFormComplete = validarFormulario()
  if (isFormComplete === true )
    alert("Email enviado!")
  else {
    alert("Erro: Verifique se não há campos vazios ou inválidos!")
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  setupTelMask();

  /* Botão finalizar → checkout */
  const btnF = document.getElementById('btn-finalizar');
  if (btnF) btnF.addEventListener('click', () => {
    if (cartGetAll().length === 0) return;
    closeCart();
    window.location.href = '../checkout/index.html';
  });

  /* Enter não submete form acidentalmente */
  document.querySelectorAll('.contact-form input').forEach(inp => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') e.preventDefault();
    });
  });
});
