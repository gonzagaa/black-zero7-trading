// Formulário da hero: validação, estados, honeypot, envio e redirecionamento.
// Regra principal (docs/rdstation.md): só vai para o obrigado depois do sucesso do envio.

import { PAGINA_OBRIGADO } from './config.js?v=202611160930';
import { enviarLead } from './rdstation.js?v=202611160930';
import { guardarUtms } from './utm.js?v=202611160930';

// Textos da tabela "Textos que a copy não traz" (docs/copy.md)
const MSG = {
  vazio: 'Preencha este campo.',
  email: 'Digite um e-mail válido.',
  telefone: 'Digite um telefone válido.',
  envio: 'Não foi possível enviar agora. Tente de novo.',
  enviando: 'ENVIANDO...',
};

const RE_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

// Telefone: igual à função /api/lead — tira tudo que não é dígito e aceita de 10 a 15 dígitos
// ("62.99999.0000" vale; o "+" do começo vale e a função o mantém). Com letra, é inválido. Sem máscara.
function telefoneValido(valor) {
  if (/\p{L}/u.test(valor)) return false;
  const digitos = valor.replace(/\D/g, '').length;
  return digitos >= 10 && digitos <= 15;
}

guardarUtms();

const form = document.getElementById('form-lead');
if (form) iniciar(form);

function iniciar(form) {
  const campos = {
    nome: form.querySelector('#nome'),
    email: form.querySelector('#email'),
    telefone: form.querySelector('#telefone'),
  };
  const isca = form.querySelector('#z7_campo_b');
  const botao = form.querySelector('button[type="submit"]');
  const rotulo = botao.querySelector('.z7-btnx__label');
  const rotuloOriginal = rotulo.textContent;
  const erroEnvio = form.querySelector('#erro-envio');
  let enviando = false;

  function validar(nomeCampo) {
    const input = campos[nomeCampo];
    const valor = input.value.trim();
    let erro = '';
    if (!valor) erro = MSG.vazio;
    else if (nomeCampo === 'email' && !RE_EMAIL.test(valor)) erro = MSG.email;
    else if (nomeCampo === 'telefone' && !telefoneValido(valor)) erro = MSG.telefone;
    mostrarErro(input, erro);
    return !erro;
  }

  function mostrarErro(input, texto) {
    const alvo = document.getElementById(input.getAttribute('aria-describedby'));
    if (alvo.textContent !== texto) alvo.textContent = texto;
    if (texto) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  // Valida ao sair do campo (só depois de digitar algo) e limpa o erro assim que o valor fica válido
  for (const [nomeCampo, input] of Object.entries(campos)) {
    input.addEventListener('blur', () => {
      if (input.value.trim() || input.hasAttribute('aria-invalid')) validar(nomeCampo);
    });
    input.addEventListener('input', () => {
      if (input.hasAttribute('aria-invalid')) validar(nomeCampo);
      if (erroEnvio.textContent) erroEnvio.textContent = '';
    });
  }

  function estadoEnviando(ativo) {
    enviando = ativo;
    form.setAttribute('aria-busy', String(ativo));
    if (ativo) {
      botao.setAttribute('aria-disabled', 'true');
      rotulo.textContent = MSG.enviando;
    } else {
      botao.removeAttribute('aria-disabled');
      rotulo.textContent = rotuloOriginal;
    }
  }

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviando) return;
    erroEnvio.textContent = '';

    // valida todos (para mostrar todos os erros) e põe o foco no primeiro inválido
    const invalidos = Object.keys(campos).filter((nomeCampo) => !validar(nomeCampo));
    if (invalidos.length) {
      campos[invalidos[0]].focus();
      return;
    }

    estadoEnviando(true);

    // Robô preencheu o campo-isca: finge sucesso e não envia
    if (isca && isca.value) {
      window.location.assign(PAGINA_OBRIGADO);
      return;
    }

    try {
      await enviarLead({
        nome: campos.nome.value.trim(),
        email: campos.email.value.trim(),
        telefone: campos.telefone.value.trim(),
      });
    } catch (erro) {
      // Sem dado pessoal: só a mensagem técnica do módulo da RD
      console.error(erro instanceof Error ? erro.message : erro);
      estadoEnviando(false);
      erroEnvio.textContent = MSG.envio;
      return;
    }

    // Medição (GTM): só o nome do evento, sem dado pessoal. O GTM chama eventCallback quando as tags do evento
    // terminam (ou depois de eventTimeout). Se o GTM nem carregou, ninguém chama o callback: o setTimeout garante a
    // ida para o obrigado em até 2 s. A trava impede o redirecionamento duplo.
    let redirecionou = false;
    const irParaObrigado = () => {
      if (redirecionou) return;
      redirecionou = true;
      window.location.assign(PAGINA_OBRIGADO);
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_black_trading', eventCallback: irParaObrigado, eventTimeout: 2000 });
    setTimeout(irParaObrigado, 2000);
  });

  // Voltar do obrigado pelo histórico (bfcache): o botão não pode ficar preso em "ENVIANDO..."
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) estadoEnviando(false);
  });

  efeitosBotao(botao);
}

// Brilho que acompanha o mouse e ripple no clique (o botão do site). Nada disso com reduced motion.
function efeitosBotao(botao) {
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)');

  botao.addEventListener('pointermove', (e) => {
    if (calmo.matches || e.pointerType !== 'mouse') return;
    const r = botao.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    botao.style.setProperty('--px', `${x.toFixed(1)}%`);
    botao.style.setProperty('--py', `${y.toFixed(1)}%`);
    // sombra puxada para o lado do cursor
    const dx = ((x - 50) / 50) * 1.6;
    const dy = ((y - 50) / 50) * 1.2;
    botao.style.setProperty('--sh1x', `${dx.toFixed(2)}rem`);
    botao.style.setProperty('--sh1y', `${dy.toFixed(2)}rem`);
    botao.style.setProperty('--sh2x', `${(dx * .6).toFixed(2)}rem`);
    botao.style.setProperty('--sh2y', `${(dy * .6).toFixed(2)}rem`);
  });

  botao.addEventListener('pointerleave', () => {
    for (const p of ['--px', '--py', '--sh1x', '--sh1y', '--sh2x', '--sh2y']) botao.style.removeProperty(p);
  });

  botao.addEventListener('pointerdown', (e) => {
    if (calmo.matches) return;
    const r = botao.getBoundingClientRect();
    const onda = document.createElement('span');
    onda.className = 'z7x-ripple';
    onda.setAttribute('aria-hidden', 'true');
    onda.style.left = `${e.clientX - r.left}px`;
    onda.style.top = `${e.clientY - r.top}px`;
    botao.appendChild(onda);
    onda.addEventListener('animationend', () => onda.remove(), { once: true });
  });
}
