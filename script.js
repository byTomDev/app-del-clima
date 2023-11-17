const API_KEY = '034697bde0db8fe2f09d607f7bf0ace3';
const $city = document.getElementById('ciudadEntrada')
const $btnBusqueda = document.getElementById('botonBusqueda');
const $datosClima = document.getElementById('datosClima');
const $tplInfo = document.getElementById('info-clima').content;

function buildServiceUrl(city){
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
}

async function fetchCityWeather(city) {
    try {
        const response = await fetch(buildServiceUrl(city));
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        throw error; // Lanzar el error para que sea manejado por el llamador si es necesario
    }
}

function cleanFields(){
    $city.value = '';
    $datosClima.innerHTML = '';
}

async function handleCityWeatherConsultation() {
    try {
        if ($city.value) {
            const auxCity = $city.value;
            cleanFields();
            const cityWeatherData = await fetchCityWeather(auxCity);
            const data = document.createDocumentFragment()
            const {main, name, sys, weather} = cityWeatherData;
            const temperature = kelvinToCelsius(main.temp);
            const description = weather[0].description
            const iconInfo = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

            $tplInfo.getElementById('title-info').textContent = `${name}, ${sys.country}`;
            $tplInfo.getElementById('img-info').setAttribute('src', iconInfo);
            $tplInfo.getElementById('temp-info').textContent = `La temperatura es de ${temperature}°C`;
            $tplInfo.getElementById('desc-info').textContent = `La descripción meteorológica es: ${description}`;

            let $clone = document.importNode($tplInfo, true);
            $datosClima.appendChild($clone)
            
        }
        
    } catch (error) {
        // console.error('Error en la consulta de datos del clima:', error);
    }
}

function kelvinToCelsius(kelvin) {
    // Validar que el argumento sea un número
    if (typeof kelvin !== 'number' || isNaN(kelvin)) {
        console.error('Por favor, proporciona un valor numérico para la temperatura en Kelvin.');
        return undefined;
    }

    // Validar que la temperatura en Kelvin no sea negativa
    if (kelvin < 0) {
        console.error('La temperatura en Kelvin no puede ser negativa.');
        return undefined;
    }

    // Fórmula de conversión de Kelvin a Celsius
    const celsius = Math.round(kelvin - 273.15);
    return celsius;
}

$btnBusqueda.addEventListener('click', handleCityWeatherConsultation);