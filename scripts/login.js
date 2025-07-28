const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
const eyeImg = togglePassword.querySelector('img');
const lockIcon = document.querySelector('.lock');

const emailForm = {
    input: document.getElementById('email'),
    error: document.getElementById('email-error'),
    success: document.getElementById('email-success'),
    checkingText: document.getElementById('checking-text'),
    button: document.getElementById('login-btn'),
    value: document.getElementById('email').value.trim()
};

let emailCheckTimeout;
let isEmailValid = false;

function resetSignup() {
    emailForm.error.style.display = 'none';
    emailForm.success.style.display = 'none';
    emailForm.input.classList.remove('error', 'success');
}

togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    eyeImg.src = isPassword
        ? '../assets/icons/eye-slash.svg'
        : '../assets/icons/eye-icon.svg';
});


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

function handleLogin(event) {
    // const password = document.getElementById('password').value.trim();
    // const passwordError = document.getElementById('password-error');

    // passwordError.style.display = 'none';
    // document.getElementById('password').classList.remove('error');

    // if (!isEmailValid) {
    //     alert('Please enter a valid registered email address.');
    //     return;
    // }

    // if (!password) {
    //     passwordError.textContent = 'Please enter your password';
    //     passwordError.style.display = 'block';
    //     document.getElementById('password').classList.add('error');
    //     return;
    // }
}

function guestLogin() {
    alert('Logging in as guest...');
}

function redirectToSignup() {
    alert('Redirecting to sign up page...');
}

function showPrivacyPolicy() {
    alert('Privacy Policy clicked');
}

function showLegalNotice() {
    alert('Legal Notice clicked');
}

// Behalten!
passwordInput.addEventListener('input', () => {
    const hasValue = passwordInput.value.trim().length > 0;
    // Auge zeigen, wenn etwas eingegeben wurde
    togglePassword.style.display = hasValue ? 'inline' : 'none';
    // Lock ausblenden, wenn Auge sichtbar ist
    lockIcon.style.display = hasValue ? 'none' : 'inline';
});