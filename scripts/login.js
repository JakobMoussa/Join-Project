const registeredEmails = [
    'user@example.com',
    'admin@join.com',
    'test@test.com',
    'demo@demo.com',
    'john.doe@email.com'
];

let emailCheckTimeout;
let isEmailValid = false;

function checkEmailExists() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailError = document.getElementById('email-error');
    const emailSuccess = document.getElementById('email-success');
    const checkingText = document.getElementById('checking-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const loginBtn = document.getElementById('login-btn');

    // Reset previous states
    emailError.style.display = 'none';
    emailSuccess.style.display = 'none';
    emailInput.classList.remove('error', 'success');

    if (!email) {
        isEmailValid = false;
        updateLoginButton();
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        emailInput.classList.add('error');
        isEmailValid = false;
        updateLoginButton();
        return;
    }

    checkingText.style.display = 'inline';
    loadingSpinner.style.display = 'inline-block';

    clearTimeout(emailCheckTimeout);

    emailCheckTimeout = setTimeout(() => {
        checkingText.style.display = 'none';
        loadingSpinner.style.display = 'none';

        if (registeredEmails.includes(email.toLowerCase())) {
            emailSuccess.textContent = 'Email found! Please enter your password.';
            emailSuccess.style.display = 'block';
            emailInput.classList.add('success');
            isEmailValid = true;
        } else {
            emailError.textContent = 'This email is not registered. Please sign up first.';
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            isEmailValid = false;
        }

        updateLoginButton();
    }, 1000); 
}

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
const eyeImg = togglePassword.querySelector('img');

passwordInput.addEventListener('input', () => {
  togglePassword.style.display = passwordInput.value ? 'inline' : 'none';
});

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';

  eyeImg.src = isPassword
    ? '../assets/icons/eye-slash.svg'
    : '../assets/icons/eye-icon.svg';
});

const lockIcon = document.querySelector('.lock'); 

passwordInput.addEventListener('input', () => {
  const hasValue = passwordInput.value.trim().length > 0;

  // Auge zeigen, wenn etwas eingegeben wurde
  togglePassword.style.display = hasValue ? 'inline' : 'none';

  // Lock ausblenden, wenn Auge sichtbar ist
  lockIcon.style.display = hasValue ? 'none' : 'inline';
});


function updateLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password');
    
    if (isEmailValid && passwordInput.value.trim()) {
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
    } else {
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.6';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const passwordError = document.getElementById('password-error');

    passwordError.style.display = 'none';
    document.getElementById('password').classList.remove('error');

    if (!isEmailValid) {
        alert('Please enter a valid registered email address.');
        return;
    }

    if (!password) {
        passwordError.textContent = 'Please enter your password';
        passwordError.style.display = 'block';
        document.getElementById('password').classList.add('error');
        return;
    }

    // Simulate login process
    const loginBtn = document.getElementById('login-btn');
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        // Simulate successful login
        alert(`Welcome back! Logging in with ${email}`);

        
        // Reset button for demo
        loginBtn.textContent = 'Log in';
        loginBtn.disabled = false;
    }, 1500);
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

document.getElementById('email').addEventListener('input', function() {
    clearTimeout(emailCheckTimeout);
    isEmailValid = false;
    updateLoginButton();
});

document.getElementById('password').addEventListener('input', function() {
    updateLoginButton();
});


updateLoginButton();