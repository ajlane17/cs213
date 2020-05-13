const Form = document.getElementById('registrationForm');
const Buttons = document.getElementById('buttons');
const RegistrationList = document.getElementById('registration-list')
const PerformanceType = document.getElementById('performance');
const PerformanceTypeNotification = document.getElementById('performance_notification');
const Skill = document.getElementById('skill');
const SkillNotification = document.getElementById('skill_notification');
const Instrument = document.getElementById('instrument')
const InstrumentNotification = document.getElementById('instrument_notification');
const FName01Input = document.getElementById("first_name_01");
const FName01Notification = document.getElementById("first_name_01_notification");
const LName01Input = document.getElementById("last_name_01");
const LName01Notification = document.getElementById("last_name_01_notification");
const StudentId01Input = document.getElementById('student_id_01');
const StudentId01Notification = document.getElementById('student_id_01_notification');
const RoomInput = document.getElementById('room');
const RoomNotification = document.getElementById('room_notification');
const Locations = document.getElementsByName("location");
const LocationNotification = document.getElementById('location_notification');
const TimeSlot = document.getElementById('time_slot');
const TimeSlotNotification = document.getElementById('time_slot_notification');
const SubmitNotification = document.getElementById('submit_notification');
const DeleteNotification = document.getElementById('delete_notification');

const RegistrationService = "assign13.php";
const NameRegExp = /^[A-Z][a-zA-Z ,.'-]*$/;
const NumberRegExp = /^[1-9]\d{2}$/;



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
 * Determines if the a name is valid
 * The return value is boolean
 * @param {string} value
 * @param {div} notificationField
 */
function validateName(value, notificationField) {

    if (isEmpty(value)) {
        notificationField.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(value, NameRegExp))
    {
        notificationField.innerHTML = 
            "Invalid - examples: Smith, O'Connell, Billie-Jo"
        return false;
    }
    
    notificationField.innerHTML = null;
    return true;
}

/**
 * Checks to ensure number meets required format
 * The return value is boolean
 * @param {number} value 
 * @param {div} notificationField 
 */
function validateNumber(value, notificationField) {

    if (isEmpty(value)) {
        notificationField.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(value, NumberRegExp))
    {
        notificationField.innerHTML = 
            "Invalid - examples: 101, 204, 500"
        return false;
    }
    
    notificationField.innerHTML = null;
    return true;
}

/**
 * Ensures a radio option is selected
 * The return value is boolean
 */
function validateRadioSelect(options, notificationField) {
    for (item of options) {
        if (item.checked == true) {
            notificationField.innerHTML = null;
            return true;
        }
    }
    notificationField.innerHTML = "Must select an option";
    return false;
}

/**
 * Ensures an option is selected from a dropdown
 * The return value is boolean
 * @param {string} value 
 * @param {div} notificationField 
 */
function validateDropDownSelect(value, notificationField) {

    if (isEmpty(value)) {
        notificationField.innerHTML = "Must select an option";
        return false;
    }
    
    notificationField.innerHTML = null;
    return true;
}

/**
 * Validates all form elements
 * The return value is boolean
 */
function validateForm() {

    const fName02Input = document.getElementById("first_name_02");
    const fName02Notification = document.getElementById("first_name_02_notification");
    const lName02Input = document.getElementById("last_name_02");
    const lName02Notification = document.getElementById("last_name_02_notification");
    const studentId02Input = document.getElementById('student_id_02');
    const studentId02Notification = document.getElementById('student_id_02_notification');
    
    let isValid = true;

    const performance = validateDropDownSelect(PerformanceType.value, PerformanceTypeNotification);
    const skill = validateDropDownSelect(Skill.value, SkillNotification);
    const instrument = validateDropDownSelect(Instrument.value, InstrumentNotification);
    const timeSlot = validateDropDownSelect(TimeSlot.value, TimeSlotNotification);
    const firstName01 = validateName(FName01Input.value, FName01Notification);
    const lastName01 = validateName(LName01Input.value, LName01Notification);
    const studentId01 = validateNumber(StudentId01Input.value, StudentId01Notification);
    const firstName02 = (fName02Input != null && validateName(fName02Input.value, fName02Notification));
    const lastName02 = (lName02Input != null && validateName(lName02Input.value, lName02Notification));
    const studentId02 = (studentId02Input != null && validateNumber(studentId02Input.value, studentId02Notification));
    const room = validateNumber(RoomInput.value, RoomNotification);
    const location = validateRadioSelect(Locations, LocationNotification);

    if ( !performance
        || !skill
        || !instrument
        || !timeSlot
        || !firstName01
        || !lastName01
        || !studentId01
        || !room
        || !location) {

        isValid = false;
    }

    if ( PerformanceType.value === "duet" && (!firstName02 || !lastName02 || !studentId02)) {
        isValid = false;
    }

    return isValid;
}

/**
 * Adds the optional partner fields to the form
 */
function addPartner() {

    const newField = document.createElement('fieldset');
    newField.id = "partner";
    const subHeading = document.createElement('legend');
    subHeading.innerHTML = "Partner";
    newField.appendChild(subHeading);
    Form.insertBefore(newField, Buttons);

    const list = document.createElement('ul');
    newField.appendChild(list);

    const firstNameLI = createTextInput("first_name_02",
                                        "First Name",
                                        "Jane");

    list.appendChild(firstNameLI);

    const lastNameLI = createTextInput("last_name_02",
                                        "Last Name",
                                        "Doe");

    list.appendChild(lastNameLI);

    const studentIdLI = createTextInput("student_id_02",
                                        "Student ID",
                                        "234");

    list.appendChild(studentIdLI);
}

/**
 * Removes the optional partner input fields from the form
 */
function deletePartner() {
    const partnerField = document.getElementById("partner");

    if (partnerField != null) {
        Form.removeChild(partnerField);
    }
}

/**
 * A helper function to construct a text input inside a line item
 * Returns a line item with child input elements
 * @param {string} name the input name value
 * @param {string} label the label text
 * @param {string} placeholder the placeholder value
 */
function createTextInput(name, label, placeholder) {
    // Add the first name field
    const lineItem = document.createElement('li');

    const inputArea = document.createElement('div');
    inputArea.classList.add('input-area');
    lineItem.appendChild(inputArea);

    const inputLabel = document.createElement('label');
    inputLabel.setAttribute('for', name);
    inputLabel.innerHTML = label;
    inputArea.appendChild(inputLabel);

    const input = document.createElement('input');
    input.id = name;
    input.setAttribute('name', name);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);
    inputArea.appendChild(input);

    const notificationArea = document.createElement('div');
    notificationArea.id = `${name}_notification`;
    notificationArea.classList.add('notification');
    lineItem.appendChild(notificationArea);

    return lineItem;
}

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
 * Fetches the registration data
 * Returns the parsed response
 */
async function getRegistrationData() {
    
    let responseText = null;

    try {
        responseText = await httpGet(RegistrationService);
        const registrations = JSON.parse(responseText);
        return registrations;
    }
    catch (error) {
        throw error;
    }
}

/**
 * Updates the registrations display column
 */
async function displayRegistrations() {

    RegistrationList.textContent = '';

    let registrations = await getRegistrationData();

    for (entry of registrations) {
        RegistrationList.appendChild(createEntryDisplay(entry));
    }
}

/**
 * Helper method to construct and display a single registration
 * @param {object} entry A registration entry object
 */
function createEntryDisplay(entry) {

    const div = document.createElement('div');
    div.classList.add('card');

    for (student of entry.students) {

        const combined = 
            `${student.firstName} ${student.lastName} - ${student.studentId}`;

        div.appendChild(createEntryLine("Student", combined));
    }

    div.appendChild(createEntryLine('Type', entry.entryType));
    div.appendChild(createEntryLine('Skill Level', entry.skill));
    div.appendChild(createEntryLine('Instrument', entry.instrument));
    div.appendChild(createEntryLine('Location', entry.location));
    div.appendChild(createEntryLine('Room #', entry.room));
    div.appendChild(createEntryLine('Time Slot', entry.timeSlot));

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('onclick', `deleteEntry(${entry.entryId})`);
    deleteButton.innerHTML = "Delete";
    div.appendChild(deleteButton);

    return div;
}

/**
 * Helper method to construct a data field row for registrations
 * @param {string} key The header text
 * @param {string} value The value text
 */
function createEntryLine(key, value) {

    const p = document.createElement('p');
    const keySpan = document.createElement('span');
    keySpan.classList.add('card-th');
    keySpan.innerHTML = `${key}:`;
    p.appendChild(keySpan);
    const valueSpan = document.createElement('span');
    valueSpan.innerHTML = `${value}`;
    p.appendChild(valueSpan);

    return p;
}

/**
 * Retrieves values from the registration form
 * Returns associative array of values
 */
function getFormData() {

    const dataPairs =[];

    dataPairs['performance'] = PerformanceType.value;
    dataPairs['first_name_01'] = FName01Input.value;
    dataPairs['last_name_01'] = LName01Input.value;
    dataPairs['student_id_01'] = StudentId01Input.value;
    dataPairs['skill'] = Skill.value;
    dataPairs['instrument'] = Instrument.value;
    dataPairs['room'] = RoomInput.value;
    dataPairs['time_slot'] = TimeSlot.value;

    for (let i = 0; i < Locations.length; i++) {
        if (Locations[i].checked) {
            dataPairs['location'] = Locations[i].value;
        }
    }

    if (PerformanceType.value === 'duet') {

        const fName02Input = document.getElementById("first_name_02");
        const lName02Input = document.getElementById("last_name_02");
        const studentId02Input = document.getElementById('student_id_02');

        dataPairs['first_name_02'] = fName02Input.value;
        dataPairs['last_name_02'] = lName02Input.value;
        dataPairs['student_id_02'] = studentId02Input.value;
    }

    return dataPairs;
}

/**
 * Constructs a url encoded key value pair set for form encoded posts
 * Returns an x-www-form-urlencoded string
 * @param {Array} data associative array of key value pairs
 */
function encodeFormBody(data) {

    let formEncoded = "";
    let urlEncodedPairs = [];

    for (item in data) {
        urlEncodedPairs.push(`${encodeURIComponent(item)}=${encodeURIComponent(data[item])}`);
    }

    formEncoded = urlEncodedPairs.join('&').replace(/%20/g, '+');
    return formEncoded;
}

/**
 * Submits a form post to the http endpoint
 * Returns a promise with the resulting data
 * @param {string} path the url path to the resource
 * @param {string} body x-www-form-encoded string
 */
async function httpFormPost(path, body) {
    const req = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status >= 300) {
                    reject(`Error posting contents for 
                           ${path}; body: ${body}; 
                           ${req.responseText}; 
                           status = ${req.status}`);
                }
                else {
                resolve(req.responseText);
                }
            }
        }
        req.open('POST', `${path}`, true);
        req.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        req.send(body);
    });
}

/**
 * Submits a registration entry
 */
async function addEntry() {


    if (validateForm()) {
        SubmitNotification.removeAttribute("class");
        
        formData = getFormData();
        formData['action'] = "add";
        formEncodedData = encodeFormBody(formData);

        try {
            clearNotifications();
            response = await httpFormPost(RegistrationService, formEncodedData);
            SubmitNotification.removeAttribute("class");
            SubmitNotification.classList.add('notification');
            SubmitNotification.classList.add('success');
            SubmitNotification.innerHTML = "Successfully registered"
            displayRegistrations();
        }
        catch (error) {
            SubmitNotification.classList.add('notification');
            SubmitNotification.classList.add('error')
            SubmitNotification.innerHTML = "Registration failed"
            throw error;
        }
    }
}

/**
 * Deletes a registration entry
 * @param {number} id The numeric ID of the entry
 */
async function deleteEntry(id) {
    
    let formData = [];
    formData['action'] = "delete";
    formData['id'] = id;

    let encodedFormData = encodeFormBody(formData);

    try {
        response = await httpFormPost(RegistrationService, encodedFormData);
        DeleteNotification.removeAttribute("class");
        DeleteNotification.classList.add('notification');
        DeleteNotification.classList.add('success');
        DeleteNotification.innerHTML = "Successfully deleted";
        displayRegistrations();
    }
    catch (error) {
        DeleteNotification.classList.add('notification');
        DeleteNotification.classList.add('error')
        DeleteNotification.innerHTML = "Delete failed"
        throw error;
    }

}

/**
 * Clear notifications on the page
 */
function clearNotifications() {
    const notifications = document.getElementsByClassName('notification');
    for (notification of notifications) {
        notification.innerHTML = "";
    }
}

// Performance event listener to add partner inputs if needed
PerformanceType.addEventListener("change", () => {
    if (PerformanceType.value === "duet") {
        addPartner();
    }
    else {
        deletePartner();
    }
});

// Display registrations on page load
document.onload = displayRegistrations();