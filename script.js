// ========================
//   VARIABLES GLOBALES
// ========================
let registros = JSON.parse(localStorage.getItem("registros")) || [];
const form = document.getElementById("registro-form");
const lista = document.getElementById("lista-registros");
const resumen = document.getElementById("resumen");
const exportarPDFBtn = document.getElementById("exportar-pdf");
const exportarPNGBtn = document.getElementById("exportar-png");

// ========================
//   UTILIDADES
// ========================
function guardarRegistros() {
  localStorage.setItem("registros", JSON.stringify(registros));
}

function formatearHora(hora) {
  return hora.padStart(5, "0"); // asegura formato hh:mm
}

function calcularDiferencia(inicio, fin) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;
  return t2 - t1;
}

function formatearMinutos(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}m`;
}

// ========================
//   RENDERIZADO
// ========================
function renderizarRegistros() {
  lista.innerHTML = "";
  registros.forEach((r, i) => {
    const li = document.createElement("li");
    li.className = "registro-item";

    li.innerHTML = `
      <span>${r.fecha} | ${formatearHora(r.inicio)} - ${formatearHora(r.fin)}</span>
      <span>${formatearMinutos(r.duracion)}</span>
      <button class="eliminar" data-index="${i}">✕</button>
    `;

    lista.appendChild(li);
  });
  renderizarResumen();
}

function renderizarResumen() {
  let totalMin = registros.reduce((acc, r) => acc + r.duracion, 0);
  resumen.textContent = `Total acumulado: ${formatearMinutos(totalMin)}`;

  // Resumen por mes
  let resumenMes = {};
  registros.forEach((r) => {
    const mes = r.fecha.slice(0, 7); // yyyy-mm
    resumenMes[mes] = (resumenMes[mes] || 0) + r.duracion;
  });

  let resumenTexto = "Resumen mensual:\n";
  for (const mes in resumenMes) {
    resumenTexto += `${mes}: ${formatearMinutos(resumenMes[mes])}\n`;
  }

  const resumenMesDiv = document.getElementById("resumen-mes");
  if (resumenMesDiv) resumenMesDiv.textContent = resumenTexto.trim();
}

// ========================
//   EVENTOS
// ========================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const inicio = formatearHora(document.getElementById("inicio").value);
  const fin = formatearHora(document.getElementById("fin").value);

  if (!fecha || !inicio || !fin) return;

  const duracion = calcularDiferencia(inicio, fin);
  if (duracion <= 0) return alert("La hora de fin debe ser posterior a la de inicio");

  registros.push({ fecha, inicio, fin, duracion });
  guardarRegistros();
  renderizarRegistros();
  form.reset();
});

lista.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.dataset.index;
    registros.splice(index, 1);
    guardarRegistros();
    renderizarRegistros();
  }
});

// ========================
//   EXPORTAR PDF
// ========================
exportarPDFBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // SVG estilo iOS (círculo simple minimalista)
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#007AFF">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2" stroke="#fff" stroke-width="2" fill="none"/>
    </svg>
  `;

  // Renderizamos icono en base64
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svgBlob = new Blob([svgIcon], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    canvas.width = 40;
    canvas.height = 40;
    ctx.drawImage(img, 0, 0, 40, 40);
    const iconBase64 = canvas.toDataURL("image/png");

    // Encabezado con icono + título
    doc.addImage(iconBase64, "PNG", 10, 10, 15, 15);
    doc.setFontSize(16);
    doc.text("Mis Horas", 30, 20);

    // Listado de registros
    let y = 40;
    registros.forEach((r) => {
      doc.text(`${r.fecha} | ${r.inicio} - ${r.fin} | ${formatearMinutos(r.duracion)}`, 10, y);
      y += 10;
    });

    // Resumen total
    y += 10;
    let totalMin = registros.reduce((acc, r) => acc + r.duracion, 0);
    doc.text(`Total acumulado: ${formatearMinutos(totalMin)}`, 10, y);

    // Guardar PDF
    doc.save("mis-horas.pdf");
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

// ========================
//   EXPORTAR PNG
// ========================
exportarPNGBtn.addEventListener("click", () => {
  const element = document.body;
  html2canvas(element).then((canvas) => {
    const link = document.createElement("a");
    link.download = "mis-horas.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// ========================
//   INICIO
// ========================
renderizarRegistros();