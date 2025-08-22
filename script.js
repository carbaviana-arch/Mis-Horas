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

function mostrarRegistros() {
  listaEl.innerHTML = "";
  let totalHoras = 0;

  registros.forEach(r => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${r.fecha} | ${r.entrada} - ${r.salida}</span>
      <span>${r.horas} h</span>
    `;
    listaEl.appendChild(li);
    totalHoras += parseFloat(r.horas);
  });

  totalEl.textContent = "Total: " + totalHoras.toFixed(2) + " h";
}

mostrarRegistros();