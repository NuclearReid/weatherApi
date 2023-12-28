
// the API url
var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=kyabram&cnt=5&appid=735ee00c033a0c203ee912145178a36b';

var weatherApiStart = 'https://api.openweathermap.org/data/2.5/forecast?q='
var weatherApiEnd = '&appid=735ee00c033a0c203ee912145178a36b'


// The HTML elements that I'm targetting
var searchBtn = $('#citySearchBtn')

var weatherHeader = $('#weatherHeader');

var todayWeatherLiEl = $('#todayWeatherli');
var dayTwoLiEl = $('#dayTwo');
var dayThreeLiEl = $('#dayThree');
var dayFourLiEl = $('#dayFour');
var dayFiveLiEl = $('#dayFive');


// The different arrays that will be used to store the data i get from the api
var cTempArr = [];
var cTempArr5 = [];

var skyArr = [];
var skyArr5 = [];

var windSpeedArr = [];
var windSpeedArr5 = [];

var humidityArr = [];
var humidityArr5 = [];

var dateTimeArr = [];
var dateTimeArr5 = [];

// The HTML elements I'm creating
var listTempEl = $('<li>');
var listSkyEl = $('<li>');
var listWindEl = $('<li>');
var listHumEl = $('<li>');

var listTemp2El = $('<li>');
var listSky2El = $('<li>');
var listWind2El = $('<li>');
var listHum2El = $('<li>');

var listTemp3El = $('<li>');
var listSky3El = $('<li>');
var listWind3El = $('<li>');
var listHum3El = $('<li>');

var listTemp4El = $('<li>');
var listSky4El = $('<li>');
var listWind4El = $('<li>');
var listHum4El = $('<li>');

var listTemp5El = $('<li>');
var listSky5El = $('<li>');
var listWind5El = $('<li>');
var listHum5El = $('<li>');

// Starts up dayjs()
var theDay = dayjs();
var today = dayjs();

// retrieves the items stored in the local storage and displays them when the page loads
$(document).ready(function() {
    // this function is basically copied and pasted from the clalWeatherApi()

    // creates a variable that gets the items stored in the local storage under the key 'storedCitites' 
    var storedCities = JSON.parse(localStorage.getItem('storedCities'));

    // this for loop appends a button for each of the values in the local storage
    for (var i = 0; i < storedCities.length; i++) {
        var cityName = storedCities[i];
        var pastSearches = $('#pastSearches');
        var pastBtn = $('<button>');
        pastBtn.text(cityName);
        pastSearches.attr('class', 'd-flex row row-cols-1  align-items-start justify-content-center');
        pastBtn.attr('class', 'btn btn-outline-secondary w-75 my-2');
        pastSearches.append(pastBtn);
    }
});

// Sets the headers of the cards with the date for today and the next 4 days
function nextFiveDays(){
    // sets the text for today ie 'Thursday 28 Dec 2023'
    var formattedToday = today.format(('dddd D MMM YYYY'));

    // I have the Id of each header (in the HTML) as #day1(1-5) this is because it's easy to use the for loop to cycle through them.
        // sets the header of today's weather to display the date today 
    $('#day11').text(formattedToday);
    // goes through the rest of the days
        //I start the loop at 1 because 0 would be for today which is already being displayed
    for(var i = 1; i <= 5; i++){
        // this is used to get the next day's date ie (Friday 29)
        var addedDay = theDay.add(i,'day').format('dddd D');
        // I started my Ids with #day11 instead of #day10 so I need to use (i+1)
          // in the first ittiration, this will grab #day12
        var dayId = $('#day1'+(i+1));
        // sets the text to display the day
        dayId.text(addedDay);
    }
}

// Gets the data from the weatherApi and appends each search as a button
function callWeatherApi(cityNameApi, cityName){
    $.ajax({
        url: cityNameApi,
        method: 'GET',
    }).then(function(response){
        //this is still in here so i can check if there is other data I want to display
        // console.log(response);


        // the response.list is 40 items (8 items per day) so increment i by 8 each time to grab the next day's data
        for(var i=0; i<response.list.length; i+=8){
            // the temp is in kelvin so I need to convert the data into an int before I convert it to c
            var tempInt = parseInt(response.list[i].main.temp);
            // I subtract 273 to convert the temp from K to C and store it
            var cTemp = tempInt - 273;
            // gets the windspeed, humidity, and sky conditions
            var windSpeed = response.list[i].wind.speed;
            var humidity = response.list[i].main.humidity;
            var sky = response.list[i].weather[0].main;
            // sends the data to the displaySearch() function
            displaySearch(cTemp, windSpeed, humidity, sky);
        }

        // Gets the stored cities from the local storage. Will be used to check if a new city is searched for and if so, will append it as a new button
            // the '|| []' is there for when the app is first started and there is nothing in the local storage, it'll create an empty array to be filled
        var storedCities = JSON.parse(localStorage.getItem('storedCities')) || [];

        // This if statement is checking if the searched city is NOT in the local storage. And if it isn't, it'll append it as a new button
        if (!storedCities.includes(cityName)){
            var pastSearches = $('#pastSearches');
            var pastBtn = $('<button>');
            pastBtn.text(cityName);
            pastSearches.attr('class', 'container-fluid row row-cols-1 rounded align-items-start justify-content-center');
            pastBtn.attr('class', 'btn btn-outline-secondary w-75 my-2');
            
            //this if statement fixed a bug I was having
                // when the user clicked on an appeneded button, a 'null' value was put in the local storage and that 'null' was then appeneded into a button
                    // this if statment essentially checks if what's trying to be appended is null and if it's NOT null then it'll append the button
            if(pastBtn.text() !== ''){
                pastSearches.append(pastBtn);
                storedCities.push(cityName);
                // stores the searched city into the local storage
                localStorage.setItem('storedCities', JSON.stringify(storedCities));
            }
        }
    // if the user searches a value that is not a city the api can find, sends an alert and ends the javascript
    }).fail(function(fail){
        if(fail.status !== 200){
            alert('Could not get the info for that city');
            return;
        }
    });
}

// Just displayes the data for the searched city
function displaySearch(cTemp, windSpeed, humidity, sky){
    // sets the text for the next 5 days
    nextFiveDays();
    // removes the current list elements
    listTempEl.remove();
    listSkyEl.remove();
    listWindEl.remove();
    listHumEl.remove();

    // creates an array with the weather data
    cTempArr.push(cTemp);
    skyArr.push(sky);
    windSpeedArr.push(windSpeed);
    humidityArr.push(humidity);

    // makes sure the array is 5 long before appending data.
    if(cTempArr.length == 5){
        // When the array is filled with the weather data I set it as a new array
        cTempArr5 = [...cTempArr];
        skyArr5 = [...skyArr];
        windSpeedArr5 = [...windSpeedArr];
        humidityArr5 = [...humidityArr];
        dateTimeArr5 = [...dateTimeArr];
        // I then reset the original array so when the person clicks on another city, it doesn't push to the end of the previous array
        cTempArr = [];
        skyArr = [];
        windSpeedArr = [];
        humidityArr = [];
        dateTimeArr = [];

        // I place the targetted elements into arrays so they are easier to itirate through 
        var listTempEls = [listTempEl, listTemp2El, listTemp3El, listTemp4El, listTemp5El];
        var listSkyEls = [listSkyEl,listSky2El,listSky3El,listSky4El,listSky5El]
        var listWindEls = [listWindEl, listWind2El, listWind3El, listWind4El, listWind5El];
        var listHumEls = [listHumEl, listHum2El, listHum3El, listHum4El, listHum5El];

        // fills each of the list elements with the weather data from the arrays created at the start of the if statement
        for(var i = 0; i <cTempArr5.length; i++){
            listTempEls[i].text('The temp will be ' + cTempArr5[i]+'c');
            listSkyEls[i].text('The conditions will be '+skyArr5[i]);
            listWindEls[i].text('The wind speed will be : '+windSpeedArr5[i] + 'kph');
            listHumEls[i].text('The humidity will be : '+ humidityArr5[i] + '%');
            listTempEls[i].appendTo('#day' + (i+1));
            listSkyEls[i].appendTo('#day'+(i+1));
            listWindEls[i].appendTo('#day' + (i+1));
            listHumEls[i].appendTo('#day' + (i+1));
        }

    }

}
// This function just gets the city name from the search box & creates the weatherapi url
function handleSearchFormSubmit(event){
    event.preventDefault();
    var cityName = $("#cityName").val();
    cityName = cityName.toLowerCase();
    // sets the header of the page to say 'weather for _____'
    weatherHeader.text('The Weather for '+cityName);
    // sets the weatherApi url
    var cityNameApi = weatherApiStart + cityName + weatherApiEnd;

    // I originally was appending the buttons of the past searches in this function but had to change it because I couldn't check if the city was in the api here
        // If the city wasn't in the api, I didn't want to append the button
            // This is the reason I pass the city name to the callWeatherApi()
    callWeatherApi(cityNameApi, cityName);
}
    
// when they submit the form looking for a city
$('#citySearch').on('submit', handleSearchFormSubmit);


// this function is just for when they click on one of the appended buttons & calls to the api to get the weather for the city of that button
$('#pastSearches').on('click', function(event){       
    var clickedCity = $(event.target).text();
    weatherHeader.text('The weather for '+ clickedCity);
    var pastCityNameApi = weatherApiStart + clickedCity + weatherApiEnd;
    callWeatherApi(pastCityNameApi);
});
