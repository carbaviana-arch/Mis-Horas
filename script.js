const form = document.getElementById("form-registro");
const historialEl = document.getElementById("historial");
const totalEl = document.getElementById("total");
const resumenEl = document.getElementById("resumen");
const toggleTema = document.getElementById("toggle-tema");

let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Cargar tema guardado
if (localStorage.getItem("tema") === "oscuro") {
  document.body.classList.add("dark");
  toggleTema.checked = true;
}

// Escuchar cambios en el switch
toggleTema.addEventListener("change", () => {
  if (toggleTema.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("tema", "oscuro");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("tema", "claro");
  }
});

// Guardar registro
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const entrada = document.getElementById("entrada").value;
  const salida = document.getElementById("salida").value;

  if (!fecha || !entrada || !salida) return;

  const horas = calcularHoras(entrada, salida);
  registros.push({ fecha, entrada, salida, horas });
  localStorage.setItem("registros", JSON.stringify(registros));

  form.reset();
  render();
});

// Calcular horas
function calcularHoras(entrada, salida) {
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  let inicio = h1 * 60 + m1;
  let fin = h2 * 60 + m2;
  if (fin < inicio) fin += 24 * 60; // cruza medianoche
  return (fin - inicio) / 60;
}

// Eliminar registro
function eliminarRegistro(i) {
  registros.splice(i, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  render();
}

// Renderizar historial y resumen
function render() {
  historialEl.innerHTML = "";
  let total = 0;

  registros.forEach((r, i) => {
    total += r.horas;
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${r.fecha}</strong>
        <span>${r.entrada} - ${r.salida}</span>
      </div>
      <div>
        <span>${r.horas.toFixed(2)} h</span>
        <button onclick="eliminarRegistro(${i})">✕</button>
      </div>
    `;
    historialEl.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  renderResumen();
}

function renderResumen() {
  const porDia = {};
  const porSemana = {};

  registros.forEach(r => {
    porDia[r.fecha] = (porDia[r.fecha] || 0) + r.horas;

    const semana = getSemana(r.fecha);
    porSemana[semana] = (porSemana[semana] || 0) + r.horas;
  });

  let html = "<h3>Resumen por día</h3><ul>";
  for (const d in porDia) {
    html += `<li>${d}: ${porDia[d].toFixed(2)} h</li>`;
  }
  html += "</ul><h3>Resumen por semana</h3><ul>";
  for (const s in porSemana) {
    html += `<li>Semana ${s}: ${porSemana[s].toFixed(2)} h</li>`;
  }
  html += "</ul>";

  resumenEl.innerHTML = html;
}

function getSemana(fechaStr) {
  const fecha = new Date(fechaStr);
  const start = new Date(fecha.getFullYear(), 0, 1);
  const diff = (fecha - start) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

// Primera carga
render();