const form = document.getElementById("registro-form");
const listaRegistros = document.getElementById("lista-registros");
const resumenDia = document.getElementById("resumen-dia");
const resumenSemana = document.getElementById("resumen-semana");
const resumenMes = document.getElementById("resumen-mes");
const exportarBtn = document.getElementById("exportar-pdf");
const darkModeSwitch = document.getElementById("darkModeSwitch");

let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Guardar registro
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const entrada = document.getElementById("entrada").value;
  const salida = document.getElementById("salida").value;

  if (!fecha || !entrada || !salida) return;

  const horas = calcularHoras(entrada, salida);
  const registro = { fecha, entrada, salida, horas };

  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  form.reset();
  mostrarRegistros();
  actualizarResumen();
});

// Calcular horas trabajadas
function calcularHoras(entrada, salida) {
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;
  const diff = t2 - t1;
  return diff > 0 ? (diff / 60).toFixed(2) : 0;
}

// Mostrar registros
function mostrarRegistros() {
  listaRegistros.innerHTML = "";
  registros.forEach((r, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        ${r.fecha} <span>${r.entrada} - ${r.salida}</span>
      </div>
      <div>
        ${r.horas}h 
        <button class="eliminar" onclick="eliminarRegistro(${i})">✕</button>
      </div>
    `;
    listaRegistros.appendChild(li);
  });
}

// Eliminar registro
function eliminarRegistro(i) {
  registros.splice(i, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrarRegistros();
  actualizarResumen();
}

// Resumen
function actualizarResumen() {
  const hoy = new Date().toISOString().slice(0, 10);
  const semana = getWeekNumber(new Date());
  const mes = new Date().toISOString().slice(0, 7);

  let horasDia = 0, horasSemana = 0, horasMes = 0;

  registros.forEach(r => {
    if (r.fecha === hoy) horasDia += parseFloat(r.horas);
    if (getWeekNumber(new Date(r.fecha)) === semana) horasSemana += parseFloat(r.horas);
    if (r.fecha.startsWith(mes)) horasMes += parseFloat(r.horas);
  });

  resumenDia.textContent = `Hoy: ${horasDia.toFixed(2)}h`;
  resumenSemana.textContent = `Esta semana: ${horasSemana.toFixed(2)}h`;
  resumenMes.textContent = `Este mes: ${horasMes.toFixed(2)}h`;
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

// Exportar PDF con encabezado
exportarBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Icono (SVG convertido a texto)
  const icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#007aff" stroke-width="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="3" ry="3"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>`;

  doc.setFontSize(16);
  doc.text("Registro de Horas", 20, 20);
  doc.line(20, 24, 190, 24);

  doc.setFontSize(12);
  let y = 35;
  registros.forEach(r => {
    doc.text(`${r.fecha} | ${r.entrada} - ${r.salida} | ${r.horas}h`, 20, y);
    y += 8;
  });

  doc.save("reporte_horas.pdf");
});

// Dark mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkModeSwitch.checked = true;
}

darkModeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Inicializar
mostrarRegistros();
actualizarResumen();