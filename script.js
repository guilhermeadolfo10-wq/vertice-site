/* Configuração do site — altere aqui os endereços e contatos. */
const CONFIG = {
  portalColaborador: "https://portal.verticeshipping.com.br", // portal administrativo (equipe)
  portalCliente: "https://portal.verticeshipping.com.br/tracking", // Vértice Tracking (área do cliente, no mesmo app do portal)
  email: "comercial@verticeshipping.com.br",     // cotações e contato comercial
  emailCarreiras: "contato@verticeshipping.com.br", // Trabalhe conosco (currículos)
  whatsapp: "554791230451", // WhatsApp comercial, só números com DDI e DDD
};

const ano = document.getElementById("ano"); if (ano) ano.textContent = String(new Date().getFullYear());

// Links do portal
document.querySelectorAll('[data-link="colaborador"]').forEach(a => (a.href = CONFIG.portalColaborador));
document.querySelectorAll('[data-link="cliente"]').forEach(a => (a.href = CONFIG.portalCliente));

// "Acessar portal" abre a escolha Colaborador / Cliente
const dialog = document.getElementById("acesso");
document.querySelectorAll("[data-access]").forEach(el => el.addEventListener("click", e => {
  if (!dialog || typeof dialog.showModal !== "function") return; // sem suporte: segue para /acesso.html
  e.preventDefault(); closeMenu(); dialog.showModal();
}));
dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

// Contatos
document.querySelectorAll('[data-contact="email"] a').forEach(a => { a.href = `mailto:${CONFIG.email}`; a.textContent = CONFIG.email; });
const wa = document.querySelector('[data-contact="whatsapp"]');
if (wa && CONFIG.whatsapp) { wa.hidden = false; const a = wa.querySelector("a"); a.href = `https://wa.me/${CONFIG.whatsapp}`; a.textContent = `+${CONFIG.whatsapp.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, "$1 ($2) $3-$4")}`; }
if (CONFIG.whatsapp) {
  const button = document.createElement("a");
  button.className = "whatsapp-float";
  button.href = `https://wa.me/${CONFIG.whatsapp}`;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", "Falar com o comercial pelo WhatsApp");
  button.title = "Falar com o comercial pelo WhatsApp";
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 32 32"><path fill="currentColor" d="M19.11 17.44c-.26-.13-1.51-.74-1.75-.83-.23-.08-.4-.13-.57.13-.17.26-.66.83-.81 1-.15.17-.3.19-.55.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.4.11-.53.12-.11.26-.3.38-.45.13-.15.17-.26.26-.43.08-.17.04-.32-.02-.45-.06-.13-.57-1.38-.79-1.89-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.68.32-.23.26-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.16.17 1.6.1.49-.07 1.51-.62 1.72-1.21.21-.6.21-1.1.15-1.21-.06-.11-.23-.17-.49-.3M16.04 27h-.01a10.94 10.94 0 0 1-5.58-1.53l-.4-.24-4.15 1.09 1.11-4.05-.26-.42A10.94 10.94 0 0 1 5.07 16c0-6.03 4.91-10.94 10.95-10.94 2.92 0 5.67 1.14 7.74 3.21A10.87 10.87 0 0 1 26.97 16c0 6.04-4.91 10.95-10.93 10.95m9.31-20.28A13.1 13.1 0 0 0 16.02 2.8C8.75 2.8 2.84 8.71 2.84 16c0 2.32.61 4.59 1.77 6.58L2.73 29.4l6.98-1.83A13.17 13.17 0 0 0 16.03 29h.01c7.27 0 13.18-5.91 13.18-13.18 0-3.52-1.37-6.83-3.87-9.32"/></svg>';
  document.body.append(button);
}

// Menu no celular
const toggle = document.querySelector(".menu-toggle"); const menu = document.getElementById("menu");
function closeMenu() { if (!menu || !toggle) return; menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
toggle?.addEventListener("click", () => { const open = menu.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

// Cabeçalho com sombra ao rolar
const header = document.querySelector(".site-header");
const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Formulário de cotação: valida e abre o e-mail (ou WhatsApp) já preenchido — o site não guarda dados.
const form = document.getElementById("form-cotacao");
if (form) form.addEventListener("submit", e => {
  const status = form.querySelector(".form-status");
  e.preventDefault();
  const invalid = [...form.querySelectorAll("[required]")].find(el => (el.type === "checkbox" ? !el.checked : !el.value.trim()) || (el.type === "email" && !el.checkValidity()));
  form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
  if (invalid) { invalid.setAttribute("aria-invalid", "true"); invalid.focus(); status.textContent = invalid.type === "checkbox" ? "Para enviar, aceite a Política de Privacidade." : "Preencha os campos obrigatórios."; status.className = "form-status error"; return; }
  const d = Object.fromEntries(new FormData(form));
  const body = [`Nome: ${d.nome}`, `Empresa: ${d.empresa}`, `E-mail: ${d.email}`, `Telefone: ${d.telefone || "—"}`, `Serviço: ${d.servico}`, `Origem: ${d.origem || "—"}`, `Destino: ${d.destino || "—"}`, "", d.mensagem || ""].join("\n");
  const subject = `Pedido de cotação — ${d.servico} — ${d.empresa}`;
  window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Abrimos seu aplicativo de e-mail com o pedido preenchido. Se nada abrir, escreva para " + CONFIG.email + ".";
  status.className = "form-status ok";
});

// Trabalhe conosco: valida e abre o e-mail para contato@ com os dados; o candidato anexa o currículo.
const cv = document.getElementById("form-carreiras");
document.querySelectorAll("[data-email-carreiras]").forEach(a => { a.href = `mailto:${CONFIG.emailCarreiras}`; a.textContent = CONFIG.emailCarreiras; });
if (cv) cv.addEventListener("submit", e => {
  e.preventDefault();
  const status = cv.querySelector(".form-status");
  const invalid = [...cv.querySelectorAll("[required]")].find(el => (el.type === "checkbox" ? !el.checked : !el.value.trim()) || (el.type === "email" && !el.checkValidity()));
  cv.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
  if (invalid) { invalid.setAttribute("aria-invalid", "true"); invalid.focus(); status.textContent = invalid.type === "checkbox" ? "Para enviar, aceite a Política de Privacidade." : "Preencha os campos obrigatórios."; status.className = "form-status error"; return; }
  const d = Object.fromEntries(new FormData(cv));
  const body = [`Nome: ${d.nome}`, `E-mail: ${d.email}`, `Telefone: ${d.telefone || "—"}`, `Cidade/UF: ${d.cidade || "—"}`, `Área de interesse: ${d.area}`, `LinkedIn: ${d.linkedin || "—"}`, "", d.mensagem || "", "", "(Currículo em anexo)"].join("\n");
  window.location.href = `mailto:${CONFIG.emailCarreiras}?subject=${encodeURIComponent(`Currículo — ${d.area} — ${d.nome}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Abrimos seu e-mail com os dados preenchidos. Não esqueça de anexar o currículo (PDF) antes de enviar.";
  status.className = "form-status ok";
});
