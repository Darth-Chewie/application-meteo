var cityName;
var mainJson;
let map;

const deffault = { lat:46.73709213648879, lng: 2.0023890872275265};

window.initMap = initMap;

function initMap() {


  map = new google.maps.Map(document.getElementById("map"), {
    center: deffault,
    zoom: 7,
  });

  map.addListener("click", (mapsMouseEvent) => {

    locationJson = mapsMouseEvent.latLng.toJSON();  
    cityName = "lat=" +locationJson["lat"] + "lng=" +locationJson["lng"];
    fetchWeather(event);
    enlargeData(event);
  });
}


window.onload=function(){
    const button = document.getElementById('weatherButton');
    button.addEventListener("click", buttonPressed);
}
function buttonPressed(event){
    readTextBox();
    fetchWeather(event);
    enlargeData(event);
 }

function readTextBox(){
    cityName = document.getElementById("cityName").value;
    document.getElementById("cityName").value = "";
}

function fetchWeather(event){
    fetch('https://www.prevision-meteo.ch/services/json/' + cityName)
     .then(onSuccess, onError)
    .then(processJson);
}

function onSuccess(response) {
    mainJson = response.json();
    return mainJson;
}


function processJson(json){
    mainJson = json;
    empty(document.getElementById("data"))
    if(json.hasOwnProperty('errors')){
        const div = document.createElement("div");
        const p = document.createElement("p");
        p.innerText = "Please specify a valid city or a coordinate";
        div.appendChild(p);
        document.getElementById("data").appendChild(div);
    }
    else{
        const mainDiv = document.createElement("div");

        name = json["city_info"]["name"];
            if(name != "NA"){
                const cityNameNode = document.createElement("p");
                cityNameNode.innerText = json["city_info"]["name"];
                mainDiv.appendChild(cityNameNode);
            }
       
        const weekDiv = document.createElement("div");
        weekDiv.setAttribute("class", "daysContainer")
        weekDiv.setAttribute("id", "daysContainer")

        for(var i=0; i<4; i++){
            key = "fcst_day_" + i;
            dayJson = json[key];
            const dayDiv = document.createElement("div");
            dayDiv.classList.add('dayJson');
            dayDiv.setAttribute("id", key);
            dayDiv.addEventListener("click", setMain);

            day_long = document.createElement("p");
            day_long.innerText = dayJson["day_long"];
            dayDiv.appendChild(day_long);

            iconElement = document.createElement("img");
            iconElement.setAttribute("src", dayJson["icon_big"]);
            dayDiv.appendChild(iconElement);

            tempDiv = document.createElement("div");
            tempDiv.setAttribute("class", "tempDiv");

           tmin  = document.createElement("p");
            tmin .innerText = dayJson["tmin"] + "ºC";
            tmin.setAttribute("class", "tmin");
            tempDiv.appendChild(tmin);

            tmax = document.createElement("p");
            tmax.innerText = dayJson["tmax"]+ "ºC";
            tmax.setAttribute("class", "tmax");
            tempDiv.appendChild(tmax );

            dayDiv.appendChild(tempDiv);

            weekDiv.appendChild(dayDiv);
        }

        mainDiv.appendChild(weekDiv);
 
        const selectedDiv = document.createElement("div");
        selectedDiv.setAttribute("id", "selected");
        mainDiv.appendChild(selectedDiv);

       document.getElementById("data").appendChild(mainDiv);

        setMainDay(document.getElementById("fcst_day_0"));
    }
}

function onError(error) {
    console.log("error using the api")
}

function empty(element) {
  while(element.firstElementChild) {
     element.firstElementChild.remove();
  }
}

function setMain(event){
    setMainDay(event.currentTarget);
}

function setMainDay(element){

    bigDiv = document.getElementById("selected");

    children = document.getElementById("daysContainer").children;
    for( var i=0; i<children.length; i++){
        children[i].style.backgroundColor ="white";
    }

    element.style.backgroundColor = "Gainsboro";
    empty(bigDiv);
    dayJson = mainJson[element.id];

    mainDiv = document.createElement("div");

    byHoursDiv = document.createElement("div");
    byHoursDiv.setAttribute("class", "byHoursContainer");

    byHoursJson = dayJson["hourly_data"];

    for(var i = 0; i<24; i+=3){
        hourdiv = document.createElement("div");
        hourdiv.setAttribute("class", "hourdiv");

        hourlyJson = byHoursJson["" + i + "H00"];

        time = document.createElement("p");
        time.innerText = "" + i + ":00";
        hourdiv.appendChild(time);

        iconElement = document.createElement("img");
        iconElement.setAttribute("src", hourlyJson["ICON"]);
        hourdiv.appendChild(iconElement);

        temperatureElement = document.createElement("p");
        temperature = hourlyJson["TMP2m"];
        temperature = Math.floor(temperature);
        temperatureElement.innerText = "" + temperature;
        hourdiv.appendChild(temperatureElement);

        byHoursDiv.appendChild(hourdiv);
    }
    bigDiv.appendChild(byHoursDiv);
}

function enlargeMap(event){
    document.getElementById("map").style.flex = 12;
    document.getElementById("Input").style.flex = 1;
    document.getElementById("data").style.flex = 0;
}
function enlargeData(event){
    document.getElementById("data").style.flex = 5;
    document.getElementById("Input").style.flex = 7;
}
 
