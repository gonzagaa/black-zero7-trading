// Guarda as UTMs da URL de entrada em sessionStorage, para seguirem com o lead (mesma ideia do js/utmForward.js do site).

const CHAVE = 'z7_black_utms';
const CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export function guardarUtms() {
  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return;
  }

  const achadas = {};
  for (const campo of CAMPOS) {
    const valor = params.get(campo);
    if (valor) achadas[campo] = valor.slice(0, 200);
  }

  // Só sobrescreve quando a URL traz UTM: navegar sem UTM não apaga as da entrada
  if (Object.keys(achadas).length === 0) return;
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(achadas));
  } catch {
    /* sessionStorage bloqueado: segue sem UTM */
  }
}

export function lerUtms() {
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE) || '{}');
    return salvo && typeof salvo === 'object' ? salvo : {};
  } catch {
    return {};
  }
}
