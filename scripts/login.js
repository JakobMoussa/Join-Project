/**
 * Resets the signup form by hiding error/success messages and removing styling classes
 * @returns {void}
 */
function resetSignup() {
    emailForm.error.style.display = 'none';
    emailForm.success.style.display = 'none';
    emailForm.input.classList.remove('error', 'success');
}

/**
 * Updates the login button state based on email validity and password input
 * @returns {void}
 */
function updateLoginButton() {
    const passwordInput = document.getElementById('password');
    if (isEmailValid && passwordInput.value.trim()) {
        emailForm.button.disabled = false;
        emailForm.button.style.opacity = '1';
    } else {
        emailForm.button.disabled = true;
        emailForm.button.style.opacity = '0.6';
    }
}

/**
 * Handles the login process by validating user credentials
 * @async
 * @returns {Promise<void>}
 */
async function handleLogin() {
    const users = await loadData("users/");
    let userName = isValidLogin(users);
    if (userName) {    
        window.location.href = `./html-templates/summary.html?msg=${userName}`;
    } else {
        failLogin();
    }
}

/**
 * Displays login failure messages and styling
 * @returns {void}
 */
function failLogin() {
    const errorElements = errorFields();
    const container = document.querySelectorAll(".input-container");
    errorElements.password.innerHTML = "Check your email and Password. Please try again.";
    container.forEach(element => {
        addRedOutline(element);
    });
}

/**
 * Validates if login credentials match any user in the database
 * @param {Object} users - User data object
 * @returns {string|boolean} Returns username if valid, false otherwise
 */
function isValidLogin(users) {
    const inputs = formFields();
    let validate = false;
    for (const key in users) {
        if (users[key].email == inputs.email.value &&
            users[key].password == inputs.password.value) {
            return users[key].name
        }
    }
    return false
}

/**
 * Performs guest login without credentials
 * @returns {void}
 */
function guestLogin() {
    window.location.href = `./html-templates/summary.html?msg=Guest`;
}

/**
 * Activates login functionality by validating email and password
 * @returns {void}
 */
function activateLogin() {
    const inputs = formFields();
    let email = validateEmail(inputs.email.value.trim());
    let password = checkPasswordLength(inputs.password.value.trim());
    updateLoginButton(email, password);
}

/**
 * Checks if password meets minimum length requirement
 * @param {string} password - The password to validate
 * @returns {boolean} True if password has content, false otherwise
 */
function checkPasswordLength(password) {
    if (password.length > 0) return true
    return false
}

/**
 * Updates the login button state based on validation results
 * @param {boolean} email - Email validation status
 * @param {boolean} password - Password validation status
 * @returns {void}
 */
function updateLoginButton(email, password) {
    let loginBtn = document.getElementById("login-btn");
    if (email && password) {
        loginBtn.disabled = false;
    } else loginBtn.disabled = true;
}

/**
 * Removes login error messages and styling
 * @returns {void}
 */
function removeLoginErrors() {
    const container = document.querySelectorAll(".input-container");
    const errors = errorFields();
    container.forEach(element => {
        element.classList.remove("light-red-outline");
    });
    errors.password.innerHTML = "";
}

/**
 * Initializes event listeners for form inputs when DOM is loaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
    const inputs = formFields();
    for (const key in inputs) {
        if (inputs[key] == null) continue
        inputs[key].addEventListener("click", () => {
            removeLoginErrors();
        })
    }
});

/**
 * Handles page load animation for logo overlay and content
 * @returns {void}
 */
window.addEventListener('load', () => {
    const overlay = document.querySelector('.logo-overlay'); 
    const content = document.querySelector('.content');
    if (!overlay || !content) return;
  
    setTimeout(() => {
      overlay.classList.add('hidden');
      setTimeout(() => {
        content.classList.add('visible');
      }, 500);
    }, 2000);
  });
