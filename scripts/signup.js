/**
 * Retrieves all form input fields
 * @returns {Object} Object containing DOM elements for name, email, password, and confirmPassword fields
 */
function formFields() {
  return {
    name: document.querySelector('[data-field="name"]'),
    email: document.querySelector('[data-field="email"]'),
    password: document.querySelector('[data-field="password"]'),
    confirmPassword: document.querySelector('[data-field="confirmPassword"]')
  };
}

/**
 * Retrieves all error message elements
 * @returns {Object} Object containing DOM elements for error messages
 */
function errorFields() {
  return {
    name: document.querySelector('[data-field="errorName"]'),
    email: document.querySelector('[data-field="errorEmail"]'),
    password: document.querySelector('[data-field="errorPassword"]'),
  }
}

/**
 * Checks if email already exists in the user database
 * @async
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>} True if email is available, false if already exists
 */
async function checkEmailExists(email) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  const users = await loadData("users/");
  for (const key in users) {
    if (email == users[key].email) {
      errorElements.email.innerHTML = "Email exists";
      addRedOutline(inputContainer[1])
      return false
    }
  }
  return true;
}

/**
 * Adds red outline styling to target element
 * @param {HTMLElement} target - The element to apply red outline to
 * @returns {void}
 */
function addRedOutline(target) {
  target.classList.add("light-red-outline");
}

/**
 * Compares password and confirm password fields for match and length validation
 * @param {HTMLInputElement} password - Password input field
 * @param {HTMLInputElement} confirmPassword - Confirm password input field
 * @returns {boolean} True if passwords match and meet length requirements
 */
function comparePasswords(password, confirmPassword) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  const identical = password.value.trim() === confirmPassword.value.trim();
  if (!identical) {
    errorElements.password.innerHTML = "Passwords are not identical";
    addRedOutline(inputContainer[2])
    addRedOutline(inputContainer[3])
    return false;
  }
  if (password.value.length < 3) {
    errorElements.password.innerHTML = "Passwords length is to short";
    addRedOutline(inputContainer[2])
    addRedOutline(inputContainer[3])
    return false;
  }
  return identical;
}

/**
 * Adds a new user to the system after validation
 * @async
 * @returns {Promise<void>}
 */
async function addUser() {
  const inputs = formFields();
  let signUp = await checkFormFields();
  if (!signUp) return;
  await postUser(
    inputs.name.value,
    inputs.email.value,
    inputs.password.value
  );
  showSignupSuccess();
}

/**
 * Displays success message and redirects to login page
 * @returns {void}
 */
function showSignupSuccess() {
  openOverlay();
  setTimeout(() => {
    closeOverlay();
    openLogin();
  }, 2000);
}

/**
 * Redirects to login page after delay
 * @returns {void}
 */
function openLogin() {
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 250);
}

/**
 * Opens privacy policy page
 * @returns {void}
 */
function openPrivacy() {
  window.location.href = "../html-templates/privacy-policy.html?msg=privacy";
}

/**
 * Validates name field for non-empty input
 * @param {string} userName - The name to validate
 * @returns {boolean} True if name is valid
 */
function checkName(userName) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  let validate = userName.trim() <= 0 || !userName.trim() ? false : true;
  if (!validate) {
    errorElements.name.innerHTML = "Please enter your name";
    addRedOutline(inputContainer[0])
  }
  return validate;
}

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || !email) {
    return false
  }
  return true
}

/**
 * Displays email validation error message
 * @returns {void}
 */
function errorEmail() {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  errorElements.email.innerHTML = 'Please enter a valid email address';
  addRedOutline(inputContainer[1])
}

/**
 * Validates all form fields for signup
 * @async
 * @returns {Promise<boolean>} True if all fields are valid
 */
async function checkFormFields() {
  let inputs = formFields();
  let nameIsValid = checkName(inputs.name.value);
  let emailIsValid = validateEmail(inputs.email.value);
  let emailAvailable = false;
  if (!emailIsValid) errorEmail();
  if (emailIsValid) {
    emailAvailable = await checkEmailExists(inputs.email.value);
  }
  let passwordsMatch = comparePasswords(inputs.password, inputs.confirmPassword);
  let checkbox = checkPrivacy();
  if (!nameIsValid || !emailIsValid || !emailAvailable || !passwordsMatch || !checkbox) return false;
  return true
}

/**
 * Checks if privacy policy checkbox is checked
 * @returns {boolean} True if checkbox is checked
 */
function checkPrivacy() {
  const checkbox = document.getElementById("privacyCheckbox");
  return checkbox.checked
}

/**
 * Toggles visibility of lock and eye icons based on input content
 * @param {Event} e - Input event
 * @param {string} lockId - ID of lock icon element
 * @param {string} eyeId - ID of eye icon element
 * @returns {void}
 */
function toggleLockIcon(e, lockId, eyeId) {
  const lock = document.getElementById(lockId);
  const eye = document.getElementById(eyeId);
  const hasValue = e.target.value.trim().length > 0;
  lock.style.display = hasValue ? 'none' : 'inline';
  eye.style.display = hasValue ? 'inline' : 'none';
  if (!hasValue) {
    e.target.type = 'password';
    eye.src = '../assets/icons/eye-icon.svg';
  }
}

/**
 * Toggles password input field type between text and password
 * @param {Event} e - Click event
 * @param {string} data - Data field attribute value
 * @returns {void}
 */
function toggleInputType(e, data) {
  const input = document.querySelector(`[data-field="${data}"]`);
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  e.target.src = isPassword
    ? '../assets/icons/eye-slash.svg'
    : '../assets/icons/eye-icon.svg';
}

/**
 * Initializes event listeners when DOM is loaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  const inputs = formFields();
  const error = errorFields();
  const inputContainer = document.querySelectorAll(".input-container");
  addEventToInputs(inputs, error, inputContainer);
})

/**
 * Adds click event listeners to form inputs for error clearing
 * @param {Object} inputs - Form input elements
 * @param {Object} error - Error message elements
 * @param {NodeList} inputContainer - Input container elements
 * @returns {void}
 */
function addEventToInputs(inputs, error, inputContainer) {
  for (const key in inputs) {
    if (!inputs[key]) return;
    inputs[key].addEventListener("click", () => {
      let name = inputs[key].getAttribute("name");
      if (name == "name") removeErrorReport(error.name, inputContainer[0]);
      if (name == "email") removeErrorReport(error.email, inputContainer[1]);
      if (name == "password" || name == "confirmPassword") {
        removeErrorReport(error.password, inputContainer[2])
        removeErrorReport(error.password, inputContainer[3])
      };
    });
  }
}

/**
 * Removes error messages and styling from form fields
 * @param {HTMLElement} error - Error message element
 * @param {HTMLElement} inputContainer - Input container element
 * @returns {void}
 */
function removeErrorReport(error, inputContainer) {
  error.innerHTML = "";
  inputContainer.classList.remove("light-red-outline");
}

/**
 * Validates signup form (currently incomplete implementation)
 * @param {Event} event - Form submission event
 * @returns {void}
 */
function validateSignup(event) {
    event.preventDefault(); 
    let isValid = true;

    const name = document.querySelector('input[name="name"]');
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirmPassword"]');

    
    document.querySelectorAll('.error-signup').forEach(e => e.textContent = '');
    document.querySelectorAll('input').forEach(i => i.style.borderColor = '#ccc');
}

/**
 * Displays error message for specific input field
 * @param {HTMLInputElement} input - The input element with error
 * @param {string} message - Error message to display
 * @returns {void}
 */
function showError(input, message) {
    input.style.borderColor = 'red';
    const errorField = document.querySelector(`.error-signup[data-field="error${capitalizeFirstLetter(input.name)}"]`);
    if (errorField) errorField.textContent = message;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} String with first letter capitalized
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
