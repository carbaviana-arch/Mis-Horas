const form = document.getElementById("form-registro");
const fechaEl = document.getElementById("fecha");
const entradaEl = document.getElementById("entrada");
const salidaEl = document.getElementById("salida");
const historialEl = document.getElementById("historial");
const totalEl = document.getElementById("total");
const resumenEl = document.getElementById("resumen");
const toggleTema = document.getElementById("toggle-tema");

let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Guardar registro
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fecha = fechaEl.value;
  const entrada = entradaEl.value;
  const salida = salidaEl.value;

  if (!fecha || !entrada || !salida) return;

  const horas = calcularHoras(entrada, salida);

  registros.push({ fecha, entrada, salida, horas });
  localStorage.setItem("registros", JSON.stringify(registros));

  form.reset();
  render();
});

// Calcular diferencia de horas
function calcularHoras(entrada, salida) {
  const [eh, em] = entrada.split(":").map(Number);
  const [sh, sm] = salida.split(":").map(Number);
  let inicio = eh * 60 + em;
  let fin = sh * 60 + sm;
  if (fin < inicio) fin += 24 * 60; // cruza medianoche
  return (fin - inicio) / 60;
}

// Renderizar historial
function render() {
  historialEl.innerHTML = "";
  let total = 0;

  registros.forEach((r, i) => {
    total += r.horas;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="info">
        <div class="fecha">${r.fecha}</div>
        <div class="horas">${r.entrada} - ${r.salida} (${r.horas.toFixed(2)} h)</div>
      </div>
      <button onclick="eliminar(${i})">✕</button>
    `;
    historialEl.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2) + " h";
  renderResumen();
}

// Eliminar registro
function eliminar(index) {
  registros.splice(index, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  render();
}

// Resumen por día y semana
function renderResumen() {
  let porDia = {};
  let porSemana = {};

  registros.forEach(r => {
    porDia[r.fecha] = (porDia[r.fecha] || 0) + r.horas;

    let semana = getSemana(r.fecha);
    porSemana[semana] = (porSemana[semana] || 0) + r.horas;
  });

  let html = "<h3>Por Día</h3><ul>";
  for (let d in porDia) {
    html += `<li>${d}: ${porDia[d].toFixed(2)} h</li>`;
  }
  html += "</ul><h3>Por Semana</h3><ul>";
  for (let s in porSemana) {
    html += `<li>Semana ${s}: ${porSemana[s].toFixed(2)} h</li>`;
  }
  html += "</ul>";

  resumenEl.innerHTML = html;
}

function getSemana(fecha) {
  const f = new Date(fecha);
  const año = f.getFullYear();
  const primera = new Date(año, 0, 1);
  const diff = (f - primera) / 86400000;
  return Math.ceil((diff + primera.getDay() + 1) / 7);
}

// Tema oscuro con switch
if (localStorage.getItem("tema") === "oscuro") {
  document.body.classList.add("dark");
  toggleTema.checked = true;
}

toggleTema.addEventListener("change", () => {
  if (toggleTema.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("tema", "oscuro");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("tema", "claro");
  }
});

render();