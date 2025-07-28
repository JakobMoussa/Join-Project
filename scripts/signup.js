function formFields() {
  return {
    name: document.querySelector('[data-field="name"]'),
    email: document.querySelector('[data-field="email"]'),
    password: document.querySelector('[data-field="password"]'),
    confirmPassword: document.querySelector('[data-field="confirmPassword"]')
  };
}

function errorFields() {
  return {
    name: document.querySelector('[data-field="errorName"]'),
    email: document.querySelector('[data-field="errorEmail"]'),
    password: document.querySelector('[data-field="errorPassword"]'),
  }
}

function validateEmail(email) {
  let errorElements = errorFields();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || !email) {
    errorElements.email.innerHTML = 'Please enter a valid email address';
    isEmailValid = false;
    return false
  }
  return true
}

async function checkEmailExists(email) {
  let errorElements = errorFields();
  const users = await loadData("users/");
  for (const key in users) {
    if (email == users[key].email) {
      errorElements.email.innerHTML = "Email exists";
      return false
    }
  }
  return true;
}

function comparePasswords(password, confirmPassword) {
  let errorElements = errorFields();
  const identical = password.value.trim() === confirmPassword.value.trim();
  console.log(password.value + confirmPassword.value);
  if (!identical) {
    errorElements.password.innerHTML = "Passwords are not identical";
    return false;
  }
  if (password.value.length < 3) {
    errorElements.password.innerHTML = "Passwords length is to short";
    return false;
  }
  return identical;
}

async function addUser() {
  const inputs = formFields();
  let signUp = await checkFormFields();
  if (!signUp) return;
  postUser(
    inputs.name.value,
    inputs.email.value,
    inputs.password.value
  );
}

function checkName(userName) {
  let errorElements = errorFields();
  let validate = userName.trim() <= 0 || !userName.trim() ? false : true;
  if (!validate) {
    errorElements.name.innerHTML = "Please enter your name";
  }
  return validate;
}

async function checkFormFields() {
  let inputs = formFields();
  let nameIsValid = checkName(inputs.name.value);
  let emailIsValid = validateEmail(inputs.email.value);
  let emailAvailable = false;
  if (emailIsValid) {
    emailAvailable = await checkEmailExists(inputs.email.value);
  }
  let passwordsMatch = comparePasswords(inputs.password, inputs.confirmPassword);
  if (!nameIsValid || !emailIsValid || !emailAvailable || !passwordsMatch) return false;
  return true
}

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

function toggleInputType(e, data) {
  const input = document.querySelector(`[data-field="${data}"]`);
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  e.target.src = isPassword
    ? '../assets/icons/eye-slash.svg'
    : '../assets/icons/eye-icon.svg';
}