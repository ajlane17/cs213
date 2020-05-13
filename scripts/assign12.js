// HTML elements
const StartCity = document.getElementById('startCity');
const StartState = document.getElementById('startState');
const EndCity = document.getElementById('endCity');
const EndState = document.getElementById('endState')
const StartCityNotification = document.getElementById('startCityNotification');
const StartStateNotification = document.getElementById('startStateNotification');
const EndCityNotification = document.getElementById('endCityNotification');
const EndStateNotification = document.getElementById('endStateNotification');
const DistanceCards = document.getElementById('distanceCards');
const DistanceNotification = document.getElementById('distanceNotification');

const DistanceService = "../cgi-bin/ercanbracks/mileage/mileageAjaxJSON";

// Regex that matches a exactly two letters
const StateRegExp = /^[a-z]{2}$/i;

/**
 * Determines if value matches the regex pattern
 * The return value is boolean
 * @param {*} value
 * @param {RegExp} regexp 
 */
function matchesRegexp(value, regexp) {
    if (regexp.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Determines if value is empty
 * The return value is boolean
 * @param {*} value 
 */
function isEmpty(value) {
    if (value == "") {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Determines if the start city is valid
 * The return value is boolean
 */
function validateStartCity() {
    let message = null;

    if (isEmpty(StartCity.value)) {
        StartCityNotification.innerHTML = "Cannot be empty";
        return false;
    }
    
    StartCityNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the start state is valid
 * The return value is boolean
 */
function validateStartState() {
    let message = null;

    if (isEmpty(startState.value)) {
        StartStateNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(startState.value, StateRegExp))
    {
        StartStateNotification.innerHTML = 
            "Invalid - examples: ID, UT, CA"
        return false;
    }
    
    StartStateNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the end city is valid
 * The return value is boolean
 */
function validateEndCity() {
    let message = null;

    if (isEmpty(EndCity.value)) {
        EndCityNotification.innerHTML = "Cannot be empty";
        return false;
    }
    
    EndCityNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the end state is valid
 * The return value is boolean
 */
function validateEndState() {
    let message = null;

    if (isEmpty(endState.value)) {
        EndStateNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(endState.value, StateRegExp))
    {
        EndStateNotification.innerHTML = 
            "Invalid - examples: ID, UT, CA"
        return false;
    }
    
    EndStateNotification.innerHTML = null;
    return true;
}

/**
 * Determines if all form element inputs are valid
 * The return value is boolean
 */
function validateForm() {
    
    const validStartCity = validateStartCity();
    const validStartState = validateStartState();
    const validEndCity = validateEndCity();
    const validEndState = validateEndState();

    if (validStartCity
        && validStartState
        && validEndCity
        && validEndState) {
            return true;
    }

    return false;
}

/**
 * Removes all child elements from provided parent node
 * @param {Node} parent The parent node with children to remove
 */
function ClearAllChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**

*/ 

/**
 * Retrieves the response of an http get with optional parameters
 * Returns a promise with the resulting data
 * @param {string} path the url path to the resource
 * @param {string} queryStr defaults to empty, expects a formatted query string
 */
async function httpGet(path, queryStr = "") {
    const req = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status >= 300) {
                    reject(`Error getting contents for 
                           ${path}?${queryStr} : status = 
                           ${req.status}`);
                }
                else {
                resolve(req.responseText);
                }
            }
        }
        if (queryStr != "") {
            req.open('GET', `${path}?${queryStr}` , true);
        }
        else {
            req.open('GET', `${path}` , true);
        }
        req.send();
    });
  }

  /**
   * Constructs a query string and fetches the data
   * Returns a string response
   * @param {string} startCity Starting city
   * @param {string} startState Two-letter starting state
   * @param {string} endCity Destination city
   * @param {string} endState Two-letter destination state
   */
async function getDistanceData(startCity, startState, endCity, endState) {
    // construct URLSearchParams
    // fetch the data
    // return response contents

    console.log(startCity + endCity);

    const params = {
        startCity: startCity,
        startState: startState,
        endCity: endCity,
        endState: endState
    }

    let queryString = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');

    console.log(queryString);

    let responseText = null;

    try {
        responseText = await httpGet(DistanceService, queryString);
        return responseText;
    }
    catch (error) {
        throw error;
    }
}

/**
 * This method attempts to parse a JSON string into an object
 * Returns a JavaScript object from the JSON's data structure
 * @param {string} data Stringified JSON object
 */
function parseDistanceData(data) {

    try {
        let parsedData = JSON.parse(data);
        return parsedData;
    }
    catch (error) {
        throw error;
    }
}

/**
 * Attempts to update the display with the distance response object
 * @param {object} data 
 */
async function updateDistanceDisplay(data) {

    ClearAllChildElements(DistanceCards);

    const itemRow = document.createElement('div');
    itemRow.setAttribute('class', 'card');

    const startCity = document.createElement('p');
    startCity.setAttribute('class', 'card_line_item hand-writing');
    startCity.innerHTML = 
        '<span class="card_line_item_header">Starting City: </span>' 
        + data.trip.startcity;
    itemRow.appendChild(startCity);
    
    const startState = document.createElement('p');
    startState.setAttribute('class', 'card_line_item hand-writing');
    startState.innerHTML = 
        '<span class="card_line_item_header">Starting State: </span>' 
        + data.trip.startstate;
    itemRow.appendChild(startState);

    const endCity = document.createElement('p');
    endCity.setAttribute('class', 'card_line_item hand-writing');
    endCity.innerHTML =
        '<span class="card_line_item_header">Destination City: </span>'
        + data.trip.endcity;
    itemRow.appendChild(endCity);

    const endState = document.createElement('p');
    endState.setAttribute('class', 'card_line_item hand-writing');
    endState.innerHTML = 
        '<span class="card_line_item_header">Destination State: </span>' 
        + data.trip.endstate;
    itemRow.appendChild(endState);

    const miles = document.createElement('p');
    miles.setAttribute('class', 'card_line_item hand-writing');
    miles.innerHTML = 
        '<span class="card_line_item_header">Miles: </span>' 
        + data.trip.miles;
    itemRow.appendChild(miles);

    DistanceCards.appendChild(itemRow);
}

/**
 * The event handler for the page's display distance button
 */
async function displayDistance() {

    let isValid = validateForm();

    if (!isValid) {
        return;
    }

    try {
        let responseText = await getDistanceData(StartCity.value,
                                                 StartState.value,
                                                 EndCity.value,
                                                 EndState.value);
        
        let parsedResponse = parseDistanceData(responseText);
        updateDistanceDisplay(parsedResponse);
    }
    catch (error) {
        console.log(error);
    }
}
