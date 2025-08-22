let registros = JSON.parse(localStorage.getItem("registros")) || [];

const listaEl = document.getElementById("lista");
const totalEl = document.getElementById("total");

function calcularHoras(entrada, salida) {
  let [h1, m1] = entrada.split(":").map(Number);
  let [h2, m2] = salida.split(":").map(Number);

  let inicio = h1 * 60 + m1;
  let fin = h2 * 60 + m2;
  let diff = fin - inicio;

  return diff > 0 ? (diff / 60).toFixed(2) : 0;
}

function agregarRegistro() {
  const fecha = document.getElementById("fecha").value;
  const entrada = document.getElementById("entrada").value;
  const salida = document.getElementById("salida").value;

  if (!fecha || !entrada || !salida) {
    alert("Completa todos los campos");
    return;
  }

  let horas = calcularHoras(entrada, salida);

  let registro = { fecha, entrada, salida, horas };
  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  mostrarRegistros();
}

function eliminarRegistro(index) {
  registros.splice(index, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrarRegistros();
}

function mostrarRegistros() {
  listaEl.innerHTML = "";
  let totalHoras = 0;

  registros.forEach((r, i) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${r.fecha} | ${r.entrada} - ${r.salida}</span>
      <span>${r.horas} h</span>
      <button class="eliminar" onclick="eliminarRegistro(${i})">✖</button>
    `;
    listaEl.appendChild(li);
    totalHoras += parseFloat(r.horas);
  });

  totalEl.textContent = "Total: " + totalHoras.toFixed(2) + " h";
  resumenHoras();
}

function resumenHoras() {
  let resumenDia = {};
  let resumenSemana = {};

  registros.forEach(r => {
    // resumen por día
    if (!resumenDia[r.fecha]) resumenDia[r.fecha] = 0;
    resumenDia[r.fecha] += parseFloat(r.horas);

    // resumen por semana
    let fechaObj = new Date(r.fecha);
    let primerDia = new Date(fechaObj.getFullYear(), 0, 1);
    let numSemana = Math.ceil((((fechaObj - primerDia) / 86400000) + primerDia.getDay() + 1) / 7);
    let keySemana = `${fechaObj.getFullYear()}-W${numSemana}`;
    if (!resumenSemana[keySemana]) resumenSemana[keySemana] = 0;
    resumenSemana[keySemana] += parseFloat(r.horas);
  });

  let resumenHTML = "<h3>Resumen por día</h3><ul>";
  for (let dia in resumenDia) {
    resumenHTML += `<li>${dia}: ${resumenDia[dia].toFixed(2)} h</li>`;
  }
  resumenHTML += "</ul><h3>Resumen por semana</h3><ul>";
  for (let semana in resumenSemana) {
    resumenHTML += `<li>${semana}: ${resumenSemana[semana].toFixed(2)} h</li>`;
  }
  resumenHTML += "</ul>";

  document.getElementById("resumen").innerHTML = resumenHTML;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("temaOscuro", document.body.classList.contains("dark"));
}

// Mantener el tema al recargar
if (localStorage.getItem("temaOscuro") === "true") {
  document.body.classList.add("dark");
}

mostrarRegistros();