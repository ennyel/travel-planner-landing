// == Datos base (Simulador) ==

const DESTINOS = [
    {id: "panama", nombre: "Panamá", costoDiario: 80},
    {id: "medellin", nombre: "Medellín", costoDiario: 70},
    {id: "mexico", nombre: "México", costoDiario: 90},
    {id: "madrid", nombre: "Madrid", costoDiario: 120},
];

// Multiplicador por plan
const MULTIPLICADOR_PLAN = {
    economico: 0.85,
    normal: 1.0,
    premium: 1.35,

}

// ==DOM==
const form = document.getElementById("simulador-form");
const destinoSelect = document.getElementById("destino-select");
const diasInput = document.getElementById("dias");
const presupuestoInput = document.getElementById("presupuesto");
const planSelect = document.getElementById("plan-select")
const output = document.getElementById("resultado-output");
const btnReset = document.getElementById("btn-reset");

function poblarDestinos(){
    DESTINOS.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.nombre;
        destinoSelect.appendChild(opt);
    })
}

function calcularPresupuestoEstimado(destinoId, dias, plan){
    const destino = DESTINOS.find((d) => d.id === destinoId);
    const mult = MULTIPLICADOR_PLAN[plan] ?? 1;

    const base = destino.costoDiario * dias;
    const estimado = Math.round(base * mult);

    return { destino, base, estimado, mult };
}


function renderResultado({ destino, dias, plan, presupuesto, estimado }){
    const ok = presupuesto >= estimado;

    output.innerHTML = `
        <p><strong>Destino:</strong> ${destino.nombre}</p>
        <p><strong>Días:</strong> ${dias}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Presupuesto ingresado:</strong> $${presupuesto}</p>
        <p><strong>Estimado:</strong> $${estimado}</p>
        <p><strong>Estado:</strong> ${ok ? "Te alcanza" : "Podría quedar corto"}</p>
    `;
}

function resetSimulador(){
    form.reset();
    output.innerHTML= "";
}

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    poblarDestinos();
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const destinoId = destinoSelect.value;
    const dias = Number(diasInput.value);
    const presupuesto = Number(presupuestoInput.value);
    const plan = planSelect.value;
    const error= validarDatos({destinoId,dias,plan,presupuesto})

    if(error){
        output.innerHTML = `<p>${error}</p>`
        return;
    }
   

    const { destino, estimado } = calcularPresupuestoEstimado(destinoId, dias, plan);

    renderResultado({
        destino,
        dias,
        plan,
        presupuesto,
        estimado,
      });

})

function validarDatos({destinoId,dias,plan,presupuesto}){
    const destino = DESTINOS.find((d) => d.id === destinoId);
    if(!destino){
        return "Destino invalido"

    }
    if(!Number.isInteger(dias) || dias < 1 || dias > 30){
        return "Solo puedes ingresar un valor de dia entre 1-30"

    }
    if(!Number.isFinite(presupuesto) || presupuesto<=0){
        return"ingresa un valor de presupuesto valido"

    }
    if (!MULTIPLICADOR_PLAN.hasOwnProperty(plan)) {
        return "Ingresa uno de los planes disponibles";
      }
 
 
    return null


}




btnReset?.addEventListener("click", () => {
    resetSimulador();
  });