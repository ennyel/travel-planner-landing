// == Datos base (Simulador) ==

const DESTINOS = [
    {id: "panama", nombre: "Panamá", costoDiario: 80, imagen:"./img/Panamá-img.jpeg"},
    {id: "medellin", nombre: "Medellín", costoDiario: 70, imagen:"./img/Medellin-img.jpeg"},
    {id: "mexico", nombre: "México", costoDiario: 90, imagen:"./img/Mexico-img.jpeg"},
    {id: "madrid", nombre: "Madrid", costoDiario: 120, imagen:"./img/Madrid-img.jpeg"},
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
const outputContent= document.getElementById("resultado")
const output = document.getElementById("resultado-output");
const btnReset = document.getElementById("btn-reset");


const resumenHeader= document.getElementById("header-resumen");
const resumenHeaderContent= document.getElementById("header-content-resumen")
const resumenDestino= document.getElementById("destino");
const resumenDuracion=document.getElementById("duracion");
const resumenPresupuesto=document.getElementById("presupuestoResumen");
const resumenPlan=document.getElementById("plan");


function actualizarResumen(){
    const destinoId = destinoSelect.value;
    console.log("id",destinoId);
    const destinoEncontado= DESTINOS.find((d)=>d.id === destinoId);
    console.log("objeto:",destinoEncontado)
    console.log("presupuesto_input",presupuestoInput.value)

    resumenDestino.textContent= destinoEncontado?  destinoEncontado.nombre : "---";
    resumenDuracion.textContent= diasInput.value? `${diasInput.value} dias` : "---";
    resumenPresupuesto.textContent= presupuestoInput.value? `$ ${presupuestoInput.value} USD` : "$0 USD";
    resumenPlan.textContent = planSelect.value || "---";

    if(destinoEncontado){
        resumenHeader.innerHTML=`<img src="${destinoEncontado.imagen}" style="width:100%; height:100%; object-fit:cover; border-top-right-radius: 10px;
                        border-top-left-radius:10px ;  ">`;
        resumenHeaderContent.style.display="none";
    }
    else{
        resumenHeader.innerHTML = "";
        resumenHeader.appendChild(resumenHeaderContent)
        resumenHeaderContent.style.display="";

    }

}




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
    outputContent.classList.remove("is-hidden")
    output.innerHTML = `
        <p><strong>Destino:</strong> ${destino.nombre}</p>
        <p><strong>Días:</strong> ${dias}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Presupuesto ingresado:</strong> $${presupuesto}</p>
        <p><strong>Estimado:</strong> $${estimado}</p>
        <p><strong>Estado:</strong> ${ok ? "Te alcanza" : "Podría quedar corto"}</p>
    `;

    outputContent.scrollIntoView({behavior:'smooth',block:'start'});
}

function resetSimulador(){
    form.reset();
    outputContent.classList.add("is-hidden")
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
    if(!Number.isFinite(presupuesto) || presupuesto<=0 ||presupuesto<50){
        return"ingresa un valor de presupuesto valido"

    }
    if (!MULTIPLICADOR_PLAN.hasOwnProperty(plan)) {
        return "Ingresa uno de los planes disponibles";
      }
 
 
    return null


}

form.addEventListener("input",()=>{
    actualizarResumen();
})


btnReset?.addEventListener("click", () => {
    resetSimulador();
    actualizarResumen();

  });