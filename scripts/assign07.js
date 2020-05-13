const AprInput = document.getElementById("apr");
const TermInput = document.getElementById("term");
const AmountInput = document.getElementById("amount");
const PaymentField = document.getElementById("payment");
const AprNotification = document.getElementById("apr-notification");
const TermNotification = document.getElementById("term-notification");
const AmountNotification = document.getElementById("amount-notification");
const AprMax = 25;
const AprMin = 0;
const TermMax = 40;
const TermMin = 1;
const AmountMin = 1;
const AmountMax = Number.MAX_VALUE;

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
 * Determines if the value is a number
 * The return value is boolean
 * @param {*} value 
 */
function isNumber(value) {
    if (!isNaN(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Determines if a value is within range
 * The return value is boolean
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 */
function isInRange(value, min, max) {
    if (value >= min && value <= max) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Determines if a numerical input is valid based on logic
 * The return value is boolean
 * @param {*} value - the value being validated
 * @param {number} min - the minimum value threshold, inclusive
 * @param {number} max - the maximum value threshold, inclusive
 * @param {*} notificationField - the element to display the validation error in
 */
function validateNumberInput(value, min, max, notificationField) {
    if (isEmpty(value)) {
        notificationField.innerHTML = "Cannot be empty";
        return false;
    }

    if (!isNumber(value)) {
        notificationField.innerHTML = "Must be a number";
        return false;
    }

    if (!isInRange(value, min, max)) {
        notificationField.innerHTML = "Must be between " + min + " and " + max;
        return false;
    }
    
    notificationField.innerHTML = "";
    return true;
}

/**
 * Determines if the form inputs are valid
 * The return value is boolean
 */
function validateForm() {

    let isValid = true;

    if (!validateNumberInput(AprInput.value, AprMin, AprMax, AprNotification)) {
        isValid = false;
    }

    if (!validateNumberInput(TermInput.value, TermMin, TermMax, TermNotification)) {
        isValid = false;
    }
    
    if (!validateNumberInput(AmountInput.value, AmountMin, AmountMax, AmountNotification)) {
        isValid = false;
    }

    return isValid;
}

/**
 * Calculates a simple mortgage payment
 * The return value is a number
 * @param {number} apr - the APR as a percentage value, e.g. 3.25, not 0.0325
 * @param {number} term - the term of the loan in years
 * @param {number} amount - the amount of the loan
 */
function calculatePayment(apr, term, amount) {
    const interest = apr / 100 / 12;
    const termMonths = term * 12;
    const factor = (((1 + interest) ** termMonths) - 1) / (interest * (1 + interest) ** termMonths);

    return amount / factor;
}

/**
 * Initiates validation and updates the payment field
 */
function updatePayment() {

    let paymentAmount = 0;

    if (validateForm()) {
        paymentAmount = calculatePayment(AprInput.value, TermInput.value, AmountInput.value);
    }

    PaymentField.innerHTML = "$ " + paymentAmount.toFixed(2);
}

/**
 * Resets the form and fields to initial values
 */
function formReset() {
    
    PaymentField.innerHTML = "$ 0.00";

    const validationFields = document.getElementsByClassName("validation-field");

    for (element of validationFields) {
        element.innerHTML = "";
    }
}