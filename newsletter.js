// Newsletter do BeepDo: inscrição e cancelamento (funções no Supabase).
(() => {
  const URL_SB = 'https://kbbclredwktimecdqtwq.supabase.co', CHAVE = 'sb_publishable_vuSQaDWky4xRYPwCPvbr8g_5AUFizC5';
  const rpc = async (nome, corpo) => {
    const r = await fetch(URL_SB + '/rest/v1/rpc/' + nome, {
      method: 'POST',
      headers: { apikey: CHAVE, Authorization: 'Bearer ' + CHAVE, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const dados = await r.json().catch(() => null);
    if (!r.ok) throw new Error((dados && dados.message) || 'erro');
    return dados;
  };
  window.BeepDoNews = {
    inscrever: (email, nome, origem) => rpc('newsletter_inscrever', { p_email: email, p_nome: nome || null, p_origem: origem || 'site' }),
    cancelar: token => rpc('newsletter_cancelar', { p_token: token }),
  };
  const emailOk = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  for (const f of document.querySelectorAll('.news-form')) {
    const msg = f.querySelector('.news-msg');
    const botao = f.querySelector('button[type=submit]');
    const aviso = (t, ok) => { msg.textContent = t; msg.className = 'news-msg ' + (ok ? 'ok' : 'erro'); };
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const email = f.email.value.trim().toLowerCase();
      if (!emailOk(email)) return aviso('Confira o e-mail digitado.');
      if (!f.aceite.checked) return aviso('Marque a caixa para aceitar receber os e-mails.');
      botao.disabled = true; const texto = botao.textContent; botao.textContent = 'Enviando…';
      try {
        await window.BeepDoNews.inscrever(email, f.nome.value.trim(), f.dataset.origem);
        f.reset();
        aviso('Pronto! Você está na lista. Obrigado por acompanhar o BeepDo.', true);
      } catch (err) {
        aviso(/inv[aá]lido/i.test(err.message) ? 'Confira o e-mail digitado.' : 'Não deu certo agora. Tente de novo em instantes.');
      } finally { botao.disabled = false; botao.textContent = texto; }
    });
  }
})();
