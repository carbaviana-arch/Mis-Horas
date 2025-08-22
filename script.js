const listaEl = document.getElementById("lista-registros");
const resumenDiaEl = document.getElementById("resumen-dia");
const resumenSemanaEl = document.getElementById("resumen-semana");
const resumenMesEl = document.getElementById("resumen-mes");
const darkModeToggle = document.getElementById("darkModeToggle");

let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Guardar registro
document.getElementById("guardar").addEventListener("click", () => {
  const fecha = document.getElementById("fecha").value;
  const entrada = document.getElementById("entrada").value;
  const salida = document.getElementById("salida").value;

  if (!fecha || !entrada || !salida) return;

  registros.push({ fecha, entrada, salida });
  localStorage.setItem("registros", JSON.stringify(registros));
  renderRegistros();
  actualizarResumen();
});

// Renderizar historial
function renderRegistros() {
  listaEl.innerHTML = "";
  registros.forEach((r, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${r.fecha} → ${r.entrada} - ${r.salida}</span>
      <button class="eliminar" onclick="eliminarRegistro(${i})">✕</button>
    `;
    listaEl.appendChild(li);
  });
}
window.eliminarRegistro = (i) => {
  registros.splice(i, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  renderRegistros();
  actualizarResumen();
};

// Calcular horas trabajadas
function horasTrabajadas(entrada, salida) {
  const [eh, em] = entrada.split(":").map(Number);
  const [sh, sm] = salida.split(":").map(Number);
  return (sh * 60 + sm - (eh * 60 + em)) / 60;
}

// Resumen
function actualizarResumen() {
  const hoy = new Date().toISOString().split("T")[0];
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const inicioMes = new Date();
  inicioMes.setDate(1);

  let horasDia = 0, horasSemana = 0, horasMes = 0;
  registros.forEach(r => {
    const h = horasTrabajadas(r.entrada, r.salida);
    if (r.fecha === hoy) horasDia += h;
    if (new Date(r.fecha) >= inicioSemana) horasSemana += h;
    if (new Date(r.fecha) >= inicioMes) horasMes += h;
  });

  resumenDiaEl.textContent = `Hoy: ${horasDia.toFixed(2)} h`;
  resumenSemanaEl.textContent = `Semana: ${horasSemana.toFixed(2)} h`;
  resumenMesEl.textContent = `Mes: ${horasMes.toFixed(2)} h`;
}

// Exportar PDF con encabezado e icono
document.getElementById("exportar-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Icono en base64 (reloj minimalista negro)
  const iconBase64 =
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="black" viewBox="0 0 24 24"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm.5-9.59V7a.5.5 0 0 0-1 0v5a.5.5 0 0 0 .146.354l3.5 3.5a.5.5 0 0 0 .708-.708l-3.354-3.354z"/></svg>`);

  doc.addImage(iconBase64, "PNG", 15, 10, 15, 15);
  doc.setFontSize(16);
  doc.text("Registro de Horas", 35, 20);

  doc.setFontSize(12);
  let y = 40;
  registros.forEach(r => {
    const h = horasTrabajadas(r.entrada, r.salida).toFixed(2);
    doc.text(`${r.fecha}: ${r.entrada} - ${r.salida} (${h} h)`, 20, y);
    y += 8;
  });

  doc.save("registro_horas.pdf");
});

// Dark mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkModeToggle.checked = true;
}
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkModeToggle.checked);
  localStorage.setItem("darkMode", darkModeToggle.checked);
});

renderRegistros();
actualizarResumen();