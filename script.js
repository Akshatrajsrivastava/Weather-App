

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFoundContainer = document.querySelector("[data-notFound]");

let currentTab = userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        clickedTab.classList.add("current-tab");
        currentTab = clickedTab;

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            notFoundContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFoundContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        if (response.ok) {
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            showNotFound();
        }
    } catch (err) {
        console.error("Error fetching weather data:", err);
        loadingScreen.classList.remove("active");
        showNotFound();
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const temp = document.querySelector("[data-temp]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const humidity = document.querySelector("[data-humidity]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    if (weatherInfo.cod === "404") {
        showNotFound();
        return;
    }

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") return;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        if (response.ok) {
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            showNotFound();
        }
    } catch (e) {
        console.error("Error fetching weather data:", e);
        loadingScreen.classList.remove("active");
        showNotFound();
    }
}

function showNotFound() {
    userInfoContainer.classList.remove("active");
    notFoundContainer.classList.add("active");
}



// const userTab=document.querySelector("[data-userWeather]");
// const searchTab=document.querySelector("[data-searchWeather]");
// const userContainer=document.querySelector(".weather-container");
// const grantAccessContainer=document.querySelector(".grant-location-container");

// const searchForm=document.querySelector("[data-searchForm]");
// const loadingScreen=document.querySelector(".loading-container");
// const userInfoContainer=document.querySelector(".user-info-container");
// const notFound=document.querySelector("[data-notFound]");

// let currentTab=userTab;

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// currentTab.classList.add("current-tab");
// getFromSessionStorage();

// function switchTab(clickedTab){
//     if(clickedTab!=currentTab){
//         currentTab.classList.remove("current-tab");
//         clickedTab.classList.add("current-tab");
//         currentTab=clickedTab;

//         if(!searchForm.classList.contains("active")){
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active")
//         }
//         else{
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             getFromSessionStorage();

//         }
//     }
// }

// userTab.addEventListener("click",()=>{
//     //passed clicked tab as a parameter

//     switchTab(userTab)
// });

// searchTab.addEventListener("click",()=>{
//     switchTab(searchTab)
// });

// //Check if coordinates  are already present in session storage
// function getFromSessionStorage(){
//     const localCoordinates=sessionStorage.getItem("user-coordinates");
//     if(!localCoordinates){

//         //agar local coordinates nhi milai toh 
//         grantAccessContainer.classList.add("active");
//     }
//     else{
//         const coordinates=JSON.parse(localCoordinates);
//         fetchUserWeatherInfo(coordinates);
//     }

// }

// async function fetchUserWeatherInfo(coordinates){
//     const {lat,lon}=coordinates;
//     //make grant container invisible
//     grantAccessContainer.classList.remove("active");
//     //show loading screen
//     loadingScreen.classList.add("active");
//    //api call
//     //try 

//     try{
//         const response=await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//         );
//         const data=await response.json();
//         //hide loading screen
//         loadingScreen.classList.remove("active");
//         //show user info container
//         userInfoContainer.classList.add("active");
//         //update user info
//         renderWeatherInfo(data);
//     }
//     catch(err){
//         console.error("Error fetching weather data:",err);
//         //hide loading screen
//         loadingScreen.classList.remove("active");
//         //show error message
//         alert("Failed to fetch weather data. Please try again later.");

//     }
// }

// function renderWeatherInfo(weatherInfo){
//     //first we need to fetch the data from  the elements
//     const cityName=document.querySelector("[data-cityName]");
//     const countryIcon=document.querySelector("[data-countryIcon]");
//     const desc=document.querySelector("[data-weatherDesc]");
//     const temp=document.querySelector("[data-temp]");
//     const weatherIcon=document.querySelector("[data-weatherIcon]");
//     const humidity=document.querySelector("[data-humidity]");
//     const windSpeed=document.querySelector("[data-windSpeed]");
//     const cloudiness=document.querySelector("[data-cloudiness]");
//     //fetch values from weatherInfo object and put into  our UI Elements


//     cityName.innerText=weatherInfo?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = weatherInfo?.weather?.[0]?.description;
//     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
//     temp.innerText = `${weatherInfo?.main?.temp} °C`;
//     windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
//     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
//     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
    
//     }
//     else{
//         alert("Geolocation is not supported by this browser.");
//     }
// }

// function showPosition(position){
//     const userCoordinates = {
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//     }

//     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
//     fetchUserWeatherInfo(userCoordinates);
// }

// const grantAccessButton=document.querySelector("[data-grantAccess]");

// grantAccessButton.addEventListener("click",getLocation);

// const searchInput=document.querySelector("[data-searchInput]")

// searchForm.addEventListener("submit",(e)=>{
// e.preventDefault();
// let cityName=searchInput.value;
// if(cityName==="") return;

// else
// fetchSearchWeatherInfo(searchInput.value);

// });

// async function fetchSearchWeatherInfo(city){
//     loadingScreen.classList.add("active");
//     userInfoContainer.classList.remove("active");
//     grantAccessContainer.classList.remove("active");

//     try {
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
// );
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     }
//     catch(e){
//         console.error("Error fetching weather data:", e);
//         loadingScreen.classList.remove("active");
//         alert("Failed to fetch weather data. Please try again later.");
//         notFound.classList.add("active");
//     }
// }

