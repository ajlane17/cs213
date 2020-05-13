// HTML elements
const CountrySelect = document.getElementById('country_selection');
const CountryTable = document.getElementById('country_table');
const CountryNotification = document.getElementById('country_notification');
const StudentFilePath = document.getElementById('file_path')
const StudentNotification = document.getElementById('student_notification');
const StudentCards = document.getElementById('student_cards');

// Regex that matches a combination of tabs and/or two or more spaces
const ColumnSeparatorRegExp = /[ \t]{2,}/;

// Map of country name and JSON data location
const CountryData = new Map();
CountryData.set("Canada", "week09/canada.txt");
CountryData.set("Mexico", "week09/mexico.txt");
CountryData.set("Russia", "week09/russia.txt");
CountryData.set("USA", "week09/usa.txt");

/**
 * Populates the select dropdown based on Country Data available
 */
function PopulateCountrySelect() {
    for (let key of CountryData.keys()) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.innerHTML = key;
        CountrySelect.appendChild(opt);
      }
}

/**
 * Retrieves the contents of a text-based file
 * Returns a promise with the resulting data
 * @param {string} filePath The relative path or url to the file
 */
async function GetFileContents(filePath) {
    const req = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status >= 300) {
                    reject("Error getting contents for "
                        + filePath + ": status = "
                        + req.status);
                }
                else {
                resolve(req.responseText);
                }
            }
        }
        req.open('GET',filePath, true);
        req.send();
    });
  }

/**
 * Parses multi-line two-column text as city and population values
 * Returns a map of cities and populations
 * @param {string} text The multi-line string of city data to parse
 */
function ParseCityData(text) {
    const cityData = new Map();
    const lines = text.split("\n");
    for (line of lines) {
        let kv = line.split(ColumnSeparatorRegExp);
        cityData.set(kv[0], kv[1]);
    }

    return cityData;
}

/**
 * Updates the Country HTML table with the data provided
 * @param {Map} cityData The collection of city data to be added
 */
function UpdateCountryTable(cityData) {
    
    // Construct and display header
    const headerRow = document.createElement('tr');
    
    const cityHeader = document.createElement('th');
    cityHeader.innerHTML = "City";
    headerRow.appendChild(cityHeader);
    
    const populationHeader = document.createElement('th');
    populationHeader.innerHTML = "Population";
    headerRow.appendChild(populationHeader);

    CountryTable.appendChild(headerRow);
    
    // Construct and display item rows
    for (let [key, value] of cityData) {
        if (key != null && key != "") {
            const itemRow = document.createElement('tr');

            const cityName = document.createElement('td');
            cityName.innerHTML = key;
            itemRow.appendChild(cityName);
            
            const cityPopulation = document.createElement('td');
            cityPopulation.innerHTML = value;
            itemRow.appendChild(cityPopulation);

            CountryTable.appendChild(itemRow);
        }
    }
}

/**
 * Updates the Student HTML div with the data provided
 * @param {Array} studentData An array of student objects
 */
function UpdateStudentTable(studentData) {

    for (let student of studentData) {
        const itemRow = document.createElement('div');
        itemRow.setAttribute('class', 'student_card');

        const firstName = document.createElement('p');
        firstName.setAttribute('class', 'card_line_item hand-writing');
        firstName.innerHTML = 
            '<span class="card_line_item_header">First Name: </span>' 
            + student.first;
        itemRow.appendChild(firstName);
        
        const lastName = document.createElement('p');
        lastName.setAttribute('class', 'card_line_item hand-writing');
        lastName.innerHTML = 
            '<span class="card_line_item_header">Last Name: </span>' 
            + student.last;
        itemRow.appendChild(lastName);

        const address = document.createElement('p');
        address.setAttribute('class', 'card_line_item hand-writing');
        address.innerHTML =
            '<span class="card_line_item_header">Address: </span>'
            + student.address.city + " "
            + student.address.state + ", "
            + student.address.zip;
        itemRow.appendChild(address);

        const major = document.createElement('p');
        major.setAttribute('class', 'card_line_item hand-writing');
        major.innerHTML = 
            '<span class="card_line_item_header">Major: </span>' 
            + student.major;
        itemRow.appendChild(major);

        const gpa = document.createElement('p');
        gpa.setAttribute('class', 'card_line_item hand-writing');
        gpa.innerHTML = 
            '<span class="card_line_item_header">GPA: </span>' 
            + student.gpa;
        itemRow.appendChild(gpa);

        StudentCards.appendChild(itemRow);
    }
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
 * The event handler that executes the steps to fetch and display country data
 */
async function DisplayCountryData() {
    
    let responseText = null;
    let parsedData = null;

    // Clear any table data
    ClearAllChildElements(CountryTable);

    // Clear any errors
    CountryNotification.innerHTML = "";

    // Get selected item
    const selectedValue = 
        CountrySelect.options[CountrySelect.selectedIndex].value;

    // If no option is selected, do nothing
    if (selectedValue == "") {
        return;
    }

    // Get url path to country data
    let path = CountryData.get(selectedValue);

    // Get the country file contents
    try {
        responseText = await GetFileContents(path);
    }
    catch (error) {
        CountryNotification.innerHTML = error;
        return;
    }

    // Confirm response isn't empty
    if (responseText == null || responseText === "") {
        CountryNotification.innerHTML = "Error: Response is empty";
        return;
    }

    // Parse the response text
    parsedData = ParseCityData(responseText);

    // Display the data
    UpdateCountryTable(parsedData);
}

/**
 * The event handler that executes the steps to fetch and display student data
 */
async function DisplayStudentData() {

    let responseText = null;
    let parsedData = null;

    // Clear any table data
    ClearAllChildElements(StudentCards);

    // Clear any errors
    StudentNotification.innerHTML = "";

    // If no path is entered, do nothing
    if (StudentFilePath.value === "") {
        StudentNotification.innerHTML = "Must provide a path";
        return;
    }

    try {
        responseText = await GetFileContents(StudentFilePath.value);
    }
    catch (error) {
        StudentNotification.innerHTML = error;
        return;
    }

    // Confirm response isn't empty
    if (responseText == null || responseText === "") {
        StudentNotification.innerHTML = "Error: Response is empty";
        return;
    }

    // Parse the response
    try {
        parsedData = JSON.parse(responseText);
    }
    catch (error) {
        StudentNotification.innerHTML = "Unable to prase data = " + error;
        return;
    }

    // Display the data
    UpdateStudentTable(parsedData.students);
}

// On load, add dynamic elements
document.addEventListener('DOMContentLoaded', function() {
    PopulateCountrySelect();
 }, false);