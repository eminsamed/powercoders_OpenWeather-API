//Dom elemanlarimiza ulastik.
let current_info = document.querySelector(".current-info");
let future_forecast = document.querySelector(".future-forecast");
let date_container = document.querySelector(".date-container");
let search = document.getElementById("search");


const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

//Verileri icine enjekte edecegimiz div elementlerimizi olusturduk.
let currentWeatherItemEl = document.createElement("div");
currentWeatherItemEl.setAttribute("class", "others");

let currentMapItemEl = document.createElement("div");
let currentTempEl = document.createElement("div");
currentTempEl.setAttribute("class", "today");

let weatherForecastEl = document.createElement("div");
weatherForecastEl.setAttribute("class", "weather-forecast");

//https://home.openweathermap.org/api_keys  adresinden API mizi olusturduk.
//OpenWeather API - for getting current, daily & hourly forecasted weather data.
let API_KEY = "5bdc9bb5e105da7714d3b4fda20a88c6";

//setInterval her saniyede saatimizi güncelliyor, burada toLocaleString()methodu,
//yerel ayarları kullanarak Sayılar, Diziler veya Tarihleri dizeye dönüştürür.
//syntax i bu sekilde, en-Us.
//https://www.w3schools.com/jsref/jsref_tolocalestring.asp
setInterval(() => {
  const time = new Date();
  let exactTime = time.toLocaleString("en-Us", {
    hour12: true,
    timeStyle: "medium",
    localeMatcher: "lookup",
  });
  let exactDate = time.toLocaleString("en-Us", {
    hour12: true,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    localeMatcher: "lookup",
  });

  timeEl.innerHTML = exactTime;
  dateEl.innerHTML = exactDate;
  date_container.append(timeEl, dateEl);
}, 1000);

//ismi girip enterlayinca calisan fonksiyonumuz
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //preventDefault ilgili elementin tarayıcı tarafından o an yaptığı varsayılan işlemi engellemeye yarar.
  //API sini cektigimiz sayfa kendini yeniledigi zaman bizim talep ettigimiz bilgi sifirlanasin diye yazdik.

  //Open weathet Apinin dökümantasyonuna göre url yazildi.
  let searchItem = search.value;
  let search_url = `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_KEY}&units=metric&lang=en`;
  getWeather(search_url);
  search.value = ""; //Yeni gelecek olan verileri görebilmek icin eski degeri sifirliyoruz
});

//async fonksiyonu neden olusturduk? yukardaki fonksiyonlar daha erken calistigi icin bu fonksiyonu beklemeden calisiyorlar,
//bundan dolayi asenkron bir fonksiyon yazdik. url nin herseyden önce kendini olusturmasi icin yazdik.
//async ile await her zaman birlikte yazilir. hatali veri döndürmemek icin async fonk kullandik.mesela url gec dönmesin diye.
//üstteki islemlerden gec gelen vs olursa hata almamak icin async fonksiyon yazdik.
//try catch hata yakalama olayi.
async function getWeather(search_url) {
  try {
    let res = await fetch(search_url);
    let data = await res.json();
    if (data.message === "city not found") {
      errorMsg();
    } else {
      showWeather(data);
    }
  } catch (err) {
    console.log(err);
  }
}

function errorMsg() {
  window.alert("OPPS!! ENTER A CITY NAME PLEASE");
  document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?')";
  }
  
function showWeather(data) {
  currentMapItemEl.innerHTML = "";
  let {
    name,
    main: { humidity, pressure, feels_like, temp_min },
    coord: { lon, lat },
  } = data; //sectigimiz bu parametreleri console.log da gösteriliyor asagida.

  //Mevcut gündeki hava durumu datalarini olusturan fonksiyonumuz.
  //Gelen datalari burada inner.html ile olusturdugumuz div in icine yerlestiriyoruz.
  let weather_info_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=metric&lang=en`;
  console.log(weather_info_url); //console da verileri görebiliyoruz.
  getWeather_info(weather_info_url);

  //137 deki current_info nun altina ekledigimiz currentWeatherItemEl elementine gömüyoruz.
  currentWeatherItemEl.innerHTML = ` 
          <div class="weather-item">
          <h2>${name}</h2>
          </div>
          <div class="weather-item">
          <div>Humidity</div>
          <div>${humidity}%</div>
          </div>
          <div class="weather-item">
          <div>Pressure</div>
          <div>${pressure}</div>
          </div>
          <div class="weather-item">
          <div>Feels-Like</div>
          <div>${feels_like}°C</div>
          </div>
          <div class="weather-item">
          <div>Min-Temp</div>
          <div>${temp_min}°C</div>
          </div>
          `;

  //sehirlerle alakali resmi elde etme: backround api kullandik. dökümantasyonun tüm backround ini bu resim olarak ayarliyor.
  //Unsplash API - for getting images as per searched & current city name.
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" +
    name +
    "')";

  //Bugunkü hava durumu. current_info nun altina currentWeatherItemEl ve currentMapItemEl ekledik.
  current_info.append(
    currentWeatherItemEl,
    );
}

//asenkron fonksiyon yukaridakiyle ayni amacla kullanildi.
async function getWeather_info(weather_info_url) {
  try {
    let res = await fetch(weather_info_url);
    let data = await res.json();
    if (data.message === "city not found") {
      errorMsg();
    } else {
      showWeather_info(data);
    }
  } catch (err) {
    console.log(err);
  }
}

//
function showWeather_info(data) {
  let otherDayForecast = "";
  currentTempEl.innerHTML = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      //Hava durumunun günesli, yagmurlu vs oldugunu gösteren kücük ikon
      currentTempEl.innerHTML = `   <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@4x.png "
      alt="weather icon"
      class="w-icon"
    />
    <div class="other">
    <div class="day">${convertDate(day.dt)}</div>
    <div class="temp">Morn:  ${day.temp.morn}&#176;C</div>
    <div class="temp">Night:  ${day.temp.night}&#176;C</div>
    </div>`;
    } else if (idx < 7) {
      otherDayForecast += `
      <div class="weather-forecast-item">
      <div class="day">${convertDate(day.dt)}</div>
          <img src="https://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt="weather icon" class="w-icon">
          <div class="temp">Morn:&nbsp;  ${
            day.temp.morn
          }&#176;C</div>
          <div class="temp">Night:&nbsp;  ${
            day.temp.night
          }&#176;C</div>
      </div>
      
      `;
    }
  });

  //Tüm günleri gösteren kisim
  weatherForecastEl.innerHTML = otherDayForecast;
  future_forecast.append(currentTempEl, weatherForecastEl);
}
//Tüm günleri gösteren kisim, saniyede datayi güncelliyor.
function convertDate(date) {
  const unixTimestamp = date;
  const milliseconds = unixTimestamp * 1000;
  const dateObject = new Date(milliseconds);
  let day = dateObject.toLocaleString("en-US", {
    weekday: "long",
  });
  return day;
}
