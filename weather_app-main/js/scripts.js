const apiKey = "8b3f05698425fcadb965ed1c6426fedf";
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");

  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", apiCountryURL + data.sys.country);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove("hide");
};

// Função para compartilhar informações do clima
const shareWeatherInfo = () => {
  const city = cityElement.innerText;
  const temperature = tempElement.innerText;
  const description = descElement.innerText;
  const humidity = umidityElement.innerText;
  const wind = windElement.innerText;

  const shareText = `Clima em ${city}: ${temperature}°C, ${description}, Umidade: ${humidity}, Vento: ${wind}`;

  if (navigator.share) {
    navigator.share({
      title: `Clima em ${city}`,
      text: shareText,
      url: window.location.href
    }).then(() => {
      console.log('Compartilhado com sucesso');
    }).catch(error => {
      console.error('Erro ao compartilhar:', error);
    });
  } else {
    // Funcionalidade de compartilhamento de fallback
    alert('Para compartilhar estas informações, copie a URL da página e compartilhe manualmente.');
  }
};

// Adicionando evento de clique ao botão de compartilhamento
const shareBtn = document.querySelector("#shareBtn");
shareBtn.addEventListener("click", shareWeatherInfo);

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});
// Função para obter a localização atual do usuário
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeatherForCurrentLocation);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

// Função para mostrar a previsão do tempo com base na localização atual
const showWeatherForCurrentLocation = async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  displayWeatherData(data);
};

// Função para exibir os dados de clima na tela
const displayWeatherData = (data) => {
  // Aqui você pode atualizar os elementos HTML com os dados de clima obtidos
  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", apiCountryURL + data.sys.country);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Alterar o fundo conforme necessário
  document.body.style.backgroundImage = `url("${apiUnsplash + data.name}")`;

  weatherContainer.classList.remove("hide");
};

// Chamar a função para obter a localização atual quando a página é carregada
getLocation();
