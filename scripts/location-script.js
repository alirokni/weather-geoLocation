// intial funtion on load of weather report
$( window ).load(function() {
    var intialCity = 'Paris';
    searchGetLocation( intialCity );
});

// main function
$(function () {
    $('#js-geo-btn').on('click', findMyLocationWeather);
    $('#js-geo-search').on('click', searchLocationEnter);
    setTimeout(function(){$('.information:first li:first').removeClass('bg-warning');},3000);
});

var $latitude, $longitude;
function findMyLocationWeather() {
    // check if browser supports geo location and get coordination, else call search by city name function
    if (!navigator.geolocation) {
        $('#js-container-message').text('Your browser is not supporting html5 geo location.\nA Please use Search for your location.').addClass('container-message bg-danger');
    }else{
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
        $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
        $('.information:first li:first').addClass('bg-warning');
        setTimeout(function(){$('.information:first li:first').removeClass('bg-warning');},3000);
    }

    // on success, get and display the corrodincations and call openWeatherApi using latitude and longitude
    function geoSuccess(position) {
        $latitude = (position.coords.latitude).toFixed(3);
        $longitude = (position.coords.longitude).toFixed(3);
        $('#js-lat').text($latitude);
        $('#js-lon').text($longitude);
        $('#js-acc').text(position.coords.accuracy);
        findLocationCoordination($latitude, $longitude);
    }
    // on failure of permission denied, show an error message. On other errors call search function
    function geoFail(error) {
        var errorMessage = '';
        if (error.code === 1) { //  geoError = { 1: 'PERMISSION DENIED', 2: 'POSITION UNAVAILABLE', 3: 'TIMEOUT' };
            errorMessage = error.message + '. Please \'Allow\' use of your computer location on browser\'s address bar and reload this page.';
            $('#js-container-message').text(errorMessage).addClass('container-message bg-danger');
            $('.information:first li:first').addClass('bg-warning');
            setTimeout(function(){$('.information:first li:first').removeClass('bg-warning');},3000);
        } else {
            $('#js-container-search').removeClass('hidden');
            searchLocationEnter();
        }
    }
}

//construction of openWeatherApi url with geo location coordination
function findLocationCoordination($latitude, $longitude) {
    searchGetLocation('', $latitude, $longitude);
    $('#js-container-report').addClass('bg-success');
    $('#js-location-list').removeClass('hidden');
}

// construction of openWeatherApi url with search query
function searchLocationEnter() {
    var $serachVal = $('#js-citySerach').val();
    $('#js-location-list').addClass('hidden');
    // validation for empty serach value
    if (!!$serachVal.length) {
        searchGetLocation($serachVal);
        $('#js-container-report').addClass('bg-success');
    }
}

// converstion of Kelvin to Farhrenheit
function KelvinToFahrenheit(temperature ){
    var temp = Math.round(((temperature - 273.15) * 9 / 5) + 32);
    return temp;
}

// on success get openWeatherApi json data and display the result else show the error message
function searchGetLocation(cityName, $latitude, $longitude) {
    $('#js-citySerach').val('');
    var city = cityName,
        weatherParam;
    if(city){
        weatherParam = 'q=' + city;
    }else{
        weatherParam = '&lat=' + $latitude + '&lon=' + $longitude;
    }

    $('#js-container-message').text('Loading ...').addClass('container-message bg-info');
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://api.openweathermap.org/data/2.5/weather',
        data: weatherParam,
        beforeSend: function() {
            //$('#js-container-message').text('Loading ...').addClass('container-message bg-info');
        },
        success: function (weather) {
            if (weather.cod !== '404') {
                $('#js-container-message').text('').removeClass('container-message bg-danger');
                $('#js-city').text(weather.name);
                $('#js-country').text(weather.sys.country);
                $('#js-weather-description').text(weather.weather[0].description);
                $('#js-weather-main').text(weather.weather[0].main);
                $('#js-weather-temp').text( KelvinToFahrenheit(weather.main.temp) );
                $('#js-img-icon').prop('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
                $('#js-container-report').removeClass('hidden');
            } else {
                $('#js-container-message').text(weather.message).addClass('container-message bg-danger');
                setTimeout(function(){$('#js-container-report').removeClass('bg-success');},3000);
            }
        },
        error: function (textStatus, error) {
            var err = textStatus + ', ' + error;
            console.log('Request Failed: ' + err);
        }
    });
}
