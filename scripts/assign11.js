const PhoneInput = document.getElementById("phone");
const PhoneNotification = document.getElementById("phone_notification");
const CCNumberInput = document.getElementById("credit_card");
const CCNumberNotification = 
    document.getElementById("credit_card_notification");
const CCExpInput = document.getElementById("exp_date");
const CCExpNotification = document.getElementById("exp_date_notification");
const FNameInput = document.getElementById("first_name");
const FNameNotification = document.getElementById("first_name_notification");
const LNameInput = document.getElementById("last_name");
const LNameNotification = document.getElementById("last_name_notification");
const AddressInput = document.getElementById("address");
const AddressNotification = document.getElementById("address_notification");
const PurchaseTotal = document.getElementById("total");
const ItemList = document.getElementById("item_list");
const PurchaseItemsNotification = document.getElementById("items_notification");
const CardTypeNotification = document.getElementById("card_notification");

const ValidationFields = document.getElementsByClassName("validation-field");
let PurchaseItemCheckboxes = null;
const CardTypes = document.getElementsByName("card");

const PhoneRegExp = /^[2-9]\d{2}-\d{3}-\d{4}$/;
const CCNumberRegExp = /^\d{16}$/;
const CCExpRegExp = /^\d{2}-\d{4}$/;
const NameRegExp = /^[A-Z][a-zA-Z ,.'-]*$/;

const PurchaseItems = [
    {id: "item_0", name:"Yo-Yo", price: 14.99},
    {id: "item_1", name:"Water Gun", price: 17.99},
    {id: "item_2", name: "Doll", price: 21.99},
    {id: "item_3", name: "Playing Cards", price: 5.99}
];

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
 * Determines if the first name is valid
 * The return value is boolean
 */
function validateFirstName() {

    let message = null;

    if (isEmpty(FNameInput.value)) {
        FNameNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(FNameInput.value, NameRegExp))
    {
        FNameNotification.innerHTML = 
            "Invalid - examples: Smith, O'Connell, Billie-Jo"
        return false;
    }
    
    FNameNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the last name is valid
 * The return value is boolean
 */
function validateLastName() {

    let message = null;

    if (isEmpty(LNameInput.value)) {
        LNameNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(FNameInput.value, NameRegExp))
    {
        LNameNotification.innerHTML = 
            "Invalid - examples: Smith, O'Connell, Billie-Jo"
        return false;
    }

    LNameNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the credit card number is valid
 * The return value is boolean
 */
function validateCCNumber() {

    let message = null;

    if (isEmpty(CCNumberInput.value)) {
        CCNumberNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(CCNumberInput.value, CCNumberRegExp))
    {
        CCNumberNotification.innerHTML = 
            "Must be 16 numbers with no spaces or dashes"
        return false;
    }

    CCNumberNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the credit card exp is valid
 * The return value is boolean
 */
function validateCCExp() {

    let message = null;

    if (isEmpty(CCExpInput.value)) {
        CCExpNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(CCExpInput.value, CCExpRegExp))
    {
        CCExpNotification.innerHTML = "Must be ##-####"
        return false;
    }

    const values = (CCExpInput.value).split("-");
    const month = parseInt(values[0]);
    const year = parseInt(values[1]);

    if ((month < 1 || month > 12) || (year < 2020)) {
        CCExpNotification.innerHTML = 
            "Month must be between 1 and 12, "
            + "year must be at least 2020"
        return false;
    }

    CCExpNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the phone number is valid
 * The return value is boolean
 */
function validatePhone() {

    let message = null;

    if (isEmpty(PhoneInput.value)) {
        PhoneNotification.innerHTML = "Cannot be empty";
        return false;
    }

    if (!matchesRegexp(PhoneInput.value, PhoneRegExp))
    {
        PhoneNotification.innerHTML = "Must be ###-###-####"
        return false;
    }

    PhoneNotification.innerHTML = null;
    return true;
}

/**
 * Determines if the address is valid
 * The return value is boolean
 */
function validateAddress() {

    let message = null;

    if (isEmpty(AddressInput.value)) {
        AddressNotification.innerHTML = "Cannot be empty";
        return false;
    }

    AddressNotification.innerHTML = null;
    return true;
}

/**
 * Ensures at least one purchase item is checked
 * The return value is boolean
 */
function validatePurchaseItems() {
    for (item of PurchaseItemCheckboxes) {
        if (item.checked == true) {
            PurchaseItemsNotification.innerHTML = null;
            return true;
        }
    }
    PurchaseItemsNotification.innerHTML = "Must Select at least one item";
    return false;
}

/**
 * Ensures a card type is selected
 * The return value is boolean
 */
function validateCardType() {
    for (item of CardTypes) {
        if (item.checked == true) {
            CardTypeNotification.innerHTML = null;
            return true;
        }
    }
    CardTypeNotification.innerHTML = "Must select a card type";
    return false;
}

/**
 * Determines if all form element inputs are valid
 * The return value is boolean
 */
function validateForm() {
    
    const validFirstName = validateFirstName();
    const validLastName = validateLastName();
    const validPhone = validatePhone();
    const validCCNumber = validateCCNumber();
    const validCCExp = validateCCExp();
    const validAddress = validateAddress();
    const validPurchaseItems = validatePurchaseItems();
    const validCardType = validateCardType();

    if (validFirstName
        && validLastName
        && validPhone
        && validCCNumber
        && validCCExp
        && validAddress
        && validPurchaseItems
        && validCardType) {
            return true;
    }

    return false;
}

/**
 * Updates the total price based on checked items
 */
function calculateTotal() {

    let newTotal = 0;

    for (checkbox of PurchaseItemCheckboxes) {
        if (checkbox.checked == true) {
            let item = findObject(checkbox.id, PurchaseItems)
            if (item != null) {
                newTotal += item.price;
            }
        }
    }

    PurchaseTotal.innerHTML = "$ " + newTotal.toFixed(2);
}

/**
 * Clears all alert fields
 */
function clearAlerts() {
    for (field of ValidationFields) {
        field.innerHTML = "";
    }
}

/**
 * Clears all selected items
 */
function clearPurchaseItems() {
    for (checkbox of PurchaseItemCheckboxes) {
        checkbox.checked = false;
    }
}

/**
 * Clears radio button selections
 */
function clearRadioButtons() {
    for (radioButton of CardTypes) {
        radioButton.checked = false;
    }
}

/**
 * Resets the form and fields to initial values
 */
function formReset() {
    clearPurchaseItems();
    clearRadioButtons();
    clearAlerts();
    PurchaseTotal.innerHTML = "$ 0.00";
    FNameInput.focus();
}

/**
 * Creates a list and input element and adds it to the purchase item list
 * @param {*} item a purchase item object
 */
function addPurchaseItem(item) {
    const newListItem = document.createElement('li');
    const newInput = document.createElement('input');
    const newLabel = document.createElement('label');

    newInput.type = "checkbox";
    newInput.name = "items[]";
    newInput.id = item.id;
    newInput.value = item.id;
    newInput.setAttribute("class", "purchase_items");
    newInput.setAttribute("onchange", "calculateTotal();validatePurchaseItems()");

    newLabel.setAttribute("for", item.id);
    newLabel.id = item.id + "_label";
    newLabel.setAttribute("class", "hand-writing");
    newLabel.innerHTML = item.name + " - " + item.price;
    
    newListItem.innerHTML += 
        newInput.outerHTML + newLabel.outerHTML;

    ItemList.appendChild(newListItem);
}

/**
 * Passes objects to be added to the purchase items list
 */
function populatePurchaseItems() {
    addPurchaseItem(PurchaseItems[0]);
    addPurchaseItem(PurchaseItems[1]);
    addPurchaseItem(PurchaseItems[2]);
    addPurchaseItem(PurchaseItems[3]);

    PurchaseItemCheckboxes = 
    document.getElementsByClassName("purchase_items");
}

/**
 * Searches for an array for an object containing a passed 'id' value
 * Returns the object if found, otherwise returns null
 * @param {*} key The 'id' value to search for
 * @param {*} inputArray The array to search
 */
function findObject(key, inputArray) {
    for (let i=0; i < inputArray.length; i++) {
        if (inputArray[i].id === key) {
            return inputArray[i];
        }
    }

    return null;
}