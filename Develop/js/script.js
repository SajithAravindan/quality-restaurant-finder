// Creation Date: 08/09/2023

// Global Variables.
var userFormEl = document.querySelector('#frmUserSearch');
var strCityName = document.querySelector('#txtboxCityName');
var strUserAddress = document.querySelector('#txtboxUserAddress');
var divContainerMain = document.querySelector('#divContainerMain');
var submitButton = document.querySelector('#submit');
var intOriginLat = 0;
var intOriginLong = 0;
let favoritesArea = document.querySelector('#favorites');

//Function on Startup of Application
function init() {
    //Event Handler for Button Click
    userFormEl.addEventListener('submit', SearchSubmitHandler);// Search Button   

    //Empty Pre existing data
    divContainerMain.textContent = "";
}

//Function called when search button is clicked
var SearchSubmitHandler = function (event) {
    event.preventDefault();
    //Empty existing data
    divContainerMain.textContent = "";

    var strUserSearch = strCityName.value.trim();//get User input
    var strUAddress = strUserAddress.value.trim();//get User input

    if (strUserSearch && strUAddress) {
        getUserRepos(strUserSearch);//get restaurant data        
        strCityName.textContent = '';
    } else {
        alert('Please enter a City Name and Address');
    }
};

//function to get location ID of user input -city/State using the worldwide restaurants API.
var getUserRepos = function (USearch) {
    //Empty existing data
    divContainerMain.textContent = "";

    var intLocationID = 0;
    const strLocationIDAPIurl = 'https://worldwide-restaurants.p.rapidapi.com/typeahead';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '842fcf83d1msh73d65cea85f5337p127931jsn1beb0099353f',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: new URLSearchParams({
            q: '' + USearch + '',
            language: 'en_US'
        })
    };

    fetch(strLocationIDAPIurl, options)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    intLocationID = data.results.data[0].result_object.location_id;
                    getRestaurantData(intLocationID);
                });
            } else {
                alert('Error: ' + response.statusText);//if response not OK
            }
        })
        .catch(function (error) {//Exception Handling
            alert('Unable to connect to API');
        });
};

//Function to get data from worldwide-restaurants external API
//get the location id of  user input -city/State as parameter.
function getRestaurantData(intULocId) {
    const strRestaurantDataAPIurl = 'https://worldwide-restaurants.p.rapidapi.com/search';
    const optionsRestaurant = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '842fcf83d1msh73d65cea85f5337p127931jsn1beb0099353f',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: new URLSearchParams({
            language: 'en_US',
            limit: '30',
            location_id: '' + intULocId + '',
            currency: 'USD'
        })
    };

    fetch(strRestaurantDataAPIurl, optionsRestaurant)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    DisplayRestaurantData(data);
                });
            } else {
                alert('Error: ' + response.statusText);//if response not OK
            }
        })
        .catch(function (error) {//Exception Handling
            alert('Unable to connect to API');
        });
}
//Function to Display the Restaurants Data
//Jason Data object from Restpoint External API as parameter
function DisplayRestaurantData(objRestuarantAPIJson) {
    let strFLContnet = '';
    //loop through the JSON
    for (i = 0; i < 6; i++) {
         
        //Main Card display       
        var divCardBlock = document.createElement('div');//Card 
        divCardBlock.setAttribute('class', 'pl-6 mx-3 my-5 ripple relative overflow-hidden rounded-lg bg-cover bg-[50%] bg-no-repeat shadow-lg dark:shadow-black/20');       
        divCardBlock.setAttribute('style', 'max-width: 92rem; background-color:#FFFFFF;');

        var divCardBlockHeader = document.createElement('div');//card Header
        divCardBlockHeader.setAttribute('class', 'card-header');
        divCardBlockHeader.setAttribute('style', 'background-color: #FFFFFF')

        var hTitle = document.createElement('h2')//header title 
        hTitle.setAttribute('class', 'text-gray-900 mb-2 mt-0 text-4xl font-bold leading-tight text-primary')
        hTitle.textContent = objRestuarantAPIJson.results.data[i].name;//Hotel Name        
        //add icon to title        
        divCardBlockHeader.append(hTitle);//add title to header
        //card body
        var divCardBlockBody = document.createElement('div');
        divCardBlockBody.setAttribute('class', 'card-body');
        divCardBlockBody.setAttribute('style', 'background-color: #FFFFFF;')

        var imgRestaurant = document.createElement('img');//Main Image 
        imgRestaurant.setAttribute('src', '' + objRestuarantAPIJson.results.data[i].photo.images.small.url + '');
        imgRestaurant.setAttribute('alt', 'Hotel');
        imgRestaurant.setAttribute('class','rounded shadow-lg dark:shadow-black/20')
        //Details
        var divCardBlockContentTemp = document.createElement('p');
        divCardBlockContentTemp.setAttribute('class', 'card-text');
        strFLContnet = ''
        if (objRestuarantAPIJson.results.data[i].description != '' && objRestuarantAPIJson.results.data[i].description != null)
            strFLContnet = objRestuarantAPIJson.results.data[i].description + '<br /><br />';
        strFLContnet = strFLContnet + '<b>Rating:</b> ' + objRestuarantAPIJson.results.data[i].rating + ',  <b>Ranking :</b> ' + objRestuarantAPIJson.results.data[i].ranking +
            ',  <b>Open/Close :</b> ' + objRestuarantAPIJson.results.data[i].open_now_text + ', ' + objRestuarantAPIJson.results.data[i].price_level +
            ',  <b>Distance :</b> <label id="DD-' + i + '"></label>';
        divCardBlockContentTemp.innerHTML = strFLContnet;
        strFLContnet = '';//Empty Contents 

        var divCardBlockContentTemp2 = document.createElement('p');
        divCardBlockContentTemp2.setAttribute('class', 'card-text');
        //add details
        strFLContnet = '<b>Address:</b> ' + objRestuarantAPIJson.results.data[i].address + ',  <b>Phone </b> ' + objRestuarantAPIJson.results.data[i].phone +
            ',  <b>email:</b> <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href = "mailto:' + objRestuarantAPIJson.results.data[i].email + '" target="_blank">Send Email</a><br />' +
            '<a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="' + objRestuarantAPIJson.results.data[i].website + '" target="_blank">Restuarant Website</a>' +
            ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="' + objRestuarantAPIJson.results.data[i].web_url + '" target="_blank">Trip Advisor Website</a>' +
            ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="' + objRestuarantAPIJson.results.data[i].web_url + '#REVIEWS" target="_blank">Read Review</a>' +
            ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="' + objRestuarantAPIJson.results.data[i].write_review + '" target="_blank">Write Review</a>';
        if (objRestuarantAPIJson.results.data[i].booking != null) {
            strFLContnet = strFLContnet + '<br /><b>Order Online :</b> <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="' + objRestuarantAPIJson.results.data[i].booking.url + '" target="_blank">' +
                ' ' + objRestuarantAPIJson.results.data[i].booking.provider + '</a>';
        }
        divCardBlockContentTemp2.innerHTML = strFLContnet;

        strFLContnet = '';//Empty Contents 
        var divCardBlockContentTemp3 = document.createElement('p');
        divCardBlockContentTemp3.setAttribute('class', 'card-text');
        //get Cuisine
        if (objRestuarantAPIJson.results.data[i].cuisine != '' && objRestuarantAPIJson.results.data[i].cuisine != null) {
            strFLContnet = '<br /><b><ul>Cuisine: </ul></b>';
            let objContents = objRestuarantAPIJson.results.data[i].cuisine;
            strFLContnet = strFLContnet + getInnerContents(objRestuarantAPIJson.results.data[i].cuisine);
        }
        //get Food Options
        if (objRestuarantAPIJson.results.data[i].dietary_restrictions != '' && objRestuarantAPIJson.results.data[i].dietary_restrictions != null) {
            strFLContnet = strFLContnet + ' <br /> <b><ul>Options:</ul></b>';
            strFLContnet = strFLContnet + getInnerContents(objRestuarantAPIJson.results.data[i].dietary_restrictions);
        }
        //Favorites button
        strFLContnet = strFLContnet + '<br> <button id="favoritesButtons" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3" data-restaurant-name="' + objRestuarantAPIJson.results.data[i].name + '">Add to Favorites!</button>'
        divCardBlockContentTemp3.innerHTML = strFLContnet;


        divCardBlockBody.append(imgRestaurant);
        divCardBlockBody.append(divCardBlockContentTemp);
        divCardBlockBody.append(divCardBlockContentTemp2);
        divCardBlockBody.append(divCardBlockContentTemp3);
        divCardBlock.append(divCardBlockHeader);
        divCardBlock.append(divCardBlockBody);
        divContainerMain.append(divCardBlock);//add card to container

        fetchDistance(objRestuarantAPIJson.results.data[i].address, i);
    }
    // Runs after looping in order to set event listeners to button elements
    storeFavorites();
}

//Gets data from a array object
function getInnerContents(objContents) {
    let strInnerContents = '';
    for (cnt = 0; cnt < objContents.length; cnt++) {
        if (cnt != 0) strInnerContents = strInnerContents + ', ';
        strInnerContents = strInnerContents + objContents[cnt].name;
    }
    return strInnerContents;
}

//Funtion returns distance & duration from a origin to destination.
//destination and loop id as parameters
function fetchDistance(strdestinationlat, id) {    
    var ielement = "DD-"
    var origin = strUserAddress.value + " " + strCityName.value;//Origin
    var distanceSpan = document.getElementById('DD-' + id);//get label where to embed the data
    var strResults = "working";
    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [origin],
        destinations: [strdestinationlat],
        travelMode: google.maps.TravelMode.DRIVING, // You can change this to other modes like WALKING, BICYCLING, or TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL, // You can change this to METRIC if you prefer metric units
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false,
    }, function (response, status) {

        if (status == google.maps.DistanceMatrixStatus.OK) {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;

            strResults = 'Distance: ' + distance + ' , Duration: ' + duration;
            console.log('strResults inside: ' + strResults);
            distanceSpan.textContent = strResults;
        } else {
            strResults = 'Error calculating distance & duration';
        }
    });
}

// Stores the favorites into local storage and takes into consideration whether or not there was previous data stored
function storeFavorites() {
    let favoritesButtons = document.querySelectorAll('#favoritesButtons');
    let storedRestaurantString = localStorage.getItem('restaurants');
    if (storedRestaurantString == "" || storedRestaurantString == null) {
        let storedRestaurants = [];
        favoritesButtons.forEach(button => {
            button.addEventListener('click', () => {
                const restaurantName = button.getAttribute('data-restaurant-name');
                storedRestaurants.unshift(restaurantName);
                const thisRestaurantSearch = document.createElement('h3');
                searchNode = document.createTextNode(restaurantName);
                thisRestaurantSearch.appendChild(searchNode);
                favoritesArea.appendChild(thisRestaurantSearch);
                let restaurantString = JSON.stringify(storedRestaurants);
                localStorage.setItem('restaurants', restaurantString);
            })
        })
    } else {       
        let storedRestaurantsArray = JSON.parse(storedRestaurantString);
        favoritesButtons.forEach(button => {
            button.addEventListener('click', () => {
                const restaurantName = button.getAttribute('data-restaurant-name');
                storedRestaurantsArray.unshift(restaurantName);
                const thisRestaurantSearch = document.createElement('h3');
                searchNode = document.createTextNode(restaurantName);
                thisRestaurantSearch.appendChild(searchNode);
                favoritesArea.appendChild(thisRestaurantSearch);
                let storedRestaurantString = JSON.stringify(storedRestaurantsArray);
                localStorage.setItem('restaurants', storedRestaurantString)
            })
        })
    }
}

//Retrieves previous restaurants that have been favorited by the user
function getRestaurants() {
    let storedRestaurantsString = localStorage.getItem('restaurants');    
    if (storedRestaurantsString != "" && storedRestaurantsString != null) {  
        let storedRestaurantArray = JSON.parse(storedRestaurantsString);      
        for (let SRAi = 0; SRAi < storedRestaurantArray.length; SRAi++) {
            let restaurant = storedRestaurantArray[SRAi];
            const divTag = document.createElement("div")
            const thisRestaurant = document.createElement("h3");
            searchNode = document.createTextNode(restaurant);
            thisRestaurant.appendChild(searchNode)
            divTag.appendChild(thisRestaurant)
            favoritesArea.appendChild(divTag);
        }
    }
}
//Runs the function whenever the application is started
getRestaurants();
init();//Initiate the Application