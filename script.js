var apiKey = "5ab750b4ef032a1c52b4db722bd31164";
var cityArray = []
var city
var cityLat
var cityLong
var removedCity

storedCities = JSON.parse(localStorage.getItem("cities"));

if (storedCities !== null) {
    city = storedCities[0].name;
    window.onload = currentCall(city)
};


function renderList() {
    Object.values(storedCities).forEach((value) => {
        var $cityLi = $("<li>", { "class": "list-group-item" });
        $cityLi.text(value.name);
        $(".list-group").prepend($cityLi);
    }
    )
}

if (storedCities !== null) {
    renderList();
}


$("#searchButton").on("click", function () {
    city = $(this).parent("div").children("div").children("input").val();
    $(this).parent("div").children("div").children("input").val("");
    currentCall();
});

function currentCall() {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
        .then(function (response) {
            console.log(response);
            var iconCode = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

            cityObject = {
                name: response.name
            }
            cityArray = JSON.parse(localStorage.getItem("cities"));
            if (cityArray === null) {
                localStorage.setItem("cities", JSON.stringify([cityObject]));
            }
            else {

                function listCleaner() {
                    for (i = 0; i < cityArray.length; i++) {
                        if (cityArray[i].name === cityObject.name) {
                            removedCity = cityArray.splice([i], 1);
                        };
                    }
                    cityArray.unshift(cityObject);

                    localStorage.setItem("cities", JSON.stringify(cityArray));

                }
            }       if (cityArray !== null){
                    listCleaner();}
                    

            $(".city").text(response.name);
            $(".temp").text("Temp: " + response.main.temp.toFixed(0)+" °F");
            $(".humidity").text("Humidity: " + response.main.humidity+" %");
            $(".windSpeed").text("Wind: " + response.wind.speed+" mph");
            $("#icon").attr('src', iconURL);
            cityLat = response.coord.lat;
            cityLong = response.coord.lon;
            cityId = response.id;

            var uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLong}&units=imperial`;
            $.ajax({
                url: uviURL,
                method: "GET",
            })
                .then(function (response) {
                    console.log(response);
                    $(".uvIndex").text("UVI: "+response.value);
                    var $dateHeader = $("<h2>");
                    var shortDate = response.date_iso.substr(0, response.date_iso.indexOf('T'));
                    $dateHeader.text(shortDate);
                    $("h1").append($dateHeader);
                })

            var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&id=${cityId}&units=imperial`;
            var index = 3;
            $.ajax({
                url: fiveDayURL,
                method: "GET",
            })
                .then(function (response) {
                    for (var i = 4; i < response.list.length; i += 8) {
                        var iconCode = response.list[i].weather[0].icon;
                        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                        var shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
                        $("#day-" + index).text(shortDate);
                        $("#temp-" + index).text("Temp: "+response.list[i].main.temp.toFixed(0)+" °F");
                        $("#humid-" + index).text("Humidity: "+response.list[i].main.humidity+" %");
                        $("#icon-" + index).attr('src', iconURL);
                        index = index + 8;
                    }
                })
        })
};

$(document).on("click", "li", function () {
    city = $(this).text();
    currentCall();
});