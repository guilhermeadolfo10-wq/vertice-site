/* Configuração do site — altere aqui os endereços e contatos. */
const CONFIG = {
  portalColaborador: "https://portal.verticeshipping.com.br", // portal administrativo (equipe)
  portalCliente: "https://tracking.verticeshipping.com.br",   // Vértice Tracking (área do cliente)
  email: "comercial@verticeshipping.com.br",     // cotações e contato comercial
  emailCarreiras: "contato@verticeshipping.com.br", // Trabalhe conosco (currículos)
  whatsapp: "", // só números com DDI e DDD, ex.: "5547999999999" — vazio esconde o WhatsApp
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
