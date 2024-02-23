const container = document.querySelector('#contenedor');
const result = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', fetchClima);
})

function fetchClima(e) {
    e.preventDefault();

    // Validando
    const ciudad = formulario.querySelector('#ciudad').value;
    const pais = formulario.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        mostrarError("Todos los campos son obligatorios");

        return;
    }

    // Fetch
    consultarAPI(ciudad, pais);


}


function consultarAPI(ciudad, pais) {

    const appId = '4a9463ee8866d8b4188eb00d7b8b0f2b';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},{pais}&appid=${appId}`;

    // spinner de carga
    spinner();

    setTimeout(() => {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(response => {
                limpiarHtml();
                if(response.cod === "404") {
                    mostrarError('Ciudad no encontrada')
                    return;
                }
    
                mostrarClima(response);
            })
    }, 1000);
}

function mostrarClima(clima) {
    console.log(clima)
    const {name, main: {temp, temp_max, temp_min, humidity, feels_like}} = clima;
    
    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Ciudad: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity}%`;
    humedad.classList.add('text-xl');

    // Conversion
    const centigrados = kelvinACenti(temp);
    const maxCent = kelvinACenti(temp_max);
    const minCent = kelvinACenti(temp_min);
    const sensacion = kelvinACenti(feels_like);

    const tempActual = document.createElement('p');
    tempActual.innerHTML = `Temperaura actual: ${centigrados} &#8451;`;
    tempActual.classList.add('font-bold', 'text-4xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${maxCent} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${minCent} &#8451;`;
    tempMin.classList.add('text-xl');

    const sensacionDiv = document.createElement('p');
    sensacionDiv.innerHTML = `Sensación de: ${sensacion} &#8451;`;
    sensacionDiv.classList.add('text-xl');

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('text-center', 'text-white');
    resultDiv.appendChild(nombreCiudad);
    resultDiv.appendChild(tempActual);
    resultDiv.appendChild(tempMax);
    resultDiv.appendChild(tempMin);
    resultDiv.appendChild(sensacionDiv);
    resultDiv.appendChild(humedad);

    result.appendChild(resultDiv);

}

function kelvinACenti(grados) {
    return parseInt(grados - 273.15);
}

function mostrarError(message) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        const alertaDiv = document.createElement('div');

        alertaDiv.classList.add('bg-red-100', 'border-red-600', 'text-red-700', 'px-4',
        'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alertaDiv.innerHTML = `
            <strong class="font-bold">Ups!</strong>
            <span class="block">${message}</span>
        `;

        container.appendChild(alertaDiv)


        setTimeout(() => {
            alertaDiv.remove();
        }, 3000); 
    }
}


function limpiarHtml() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function spinner() {
    limpiarHtml();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-folding-cube');
    divSpinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `;

    result.appendChild(divSpinner);
}