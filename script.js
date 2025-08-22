let registros = JSON.parse(localStorage.getItem("registros")) || [];

const form = document.getElementById("registro-form");
const historialEl = document.getElementById("historial");
const totalEl = document.getElementById("total-horas");
const resumenDiaEl = document.getElementById("resumen-dia");
const resumenSemanaEl = document.getElementById("resumen-semana");
const darkToggle = document.getElementById("darkToggle");

// ===================
// Guardar registro
// ===================
form.addEventListener("submit", e => {
  e.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const entrada = document.getElementById("entrada").value;
  const salida = document.getElementById("salida").value;

  if (!fecha || !entrada || !salida) return;

  registros.push({ fecha, entrada, salida });
  localStorage.setItem("registros", JSON.stringify(registros));

  form.reset();
  render();
});

// ===================
// Eliminar registro
// ===================
function eliminarRegistro(index) {
  registros.splice(index, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  render();
}

// ===================
// Calcular horas
// ===================
function calcularHoras(entrada, salida) {
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  let inicio = h1 * 60 + m1;
  let fin = h2 * 60 + m2;
  if (fin < inicio) fin += 24 * 60;
  return (fin - inicio) / 60;
}

// ===================
// Renderizar
// ===================
function render() {
  historialEl.innerHTML = "";
  let total = 0;
  let horasHoy = 0;
  let horasSemana = 0;

  const hoy = new Date().toISOString().slice(0, 10);
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());

  registros.forEach((reg, i) => {
    const horas = calcularHoras(reg.entrada, reg.salida);
    total += horas;

    if (reg.fecha === hoy) horasHoy += horas;
    const fechaReg = new Date(reg.fecha);
    if (fechaReg >= inicioSemana) horasSemana += horas;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${reg.fecha} — ${reg.entrada} a ${reg.salida} (${horas.toFixed(2)}h)</span>
      <button onclick="eliminarRegistro(${i})">✕</button>
    `;
    historialEl.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  resumenDiaEl.textContent = horasHoy.toFixed(2);
  resumenSemanaEl.textContent = horasSemana.toFixed(2);
}

// ===================
// Dark Mode Switch
// ===================
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }
});

render();