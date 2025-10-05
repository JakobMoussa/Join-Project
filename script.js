/**
 * Fetches HTML content from a file and inserts it into a target element
 * @async
 * @param {string} targetId - The ID of the target element to insert HTML into
 * @param {string} htmlPage - The path to the HTML file to fetch
 * @returns {Promise<void>}
 */
async function fetchAndInsertHtml(targetId, htmlPage) {
  try {
    const target = document.getElementById(targetId);
    const resp = await fetch(htmlPage);
    const html = await resp.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Opens overlay by removing hidden class and adding visible class with animation
 * @returns {void}
 */
function openOverlay() {
  const overlay = document.querySelectorAll(".overlay");
  overlay.forEach((element) => {
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("visible");
      toggleAnimation();
    }, 1);
  });
}

/**
 * Closes overlay by removing visible class and adding hidden class with animation
 * @returns {void}
 */
function closeOverlay() {
  const overlay = document.querySelectorAll(".overlay");
  overlay.forEach((element) => {
    element.classList.remove("visible");
    toggleAnimation();
    setTimeout(() => {
      element.classList.add("hidden");
    }, 250);
  });
}

/**
 * Toggles animation class on overlay wrapper elements
 * @returns {void}
 */
function toggleAnimation() {
  const overlayWrapper = document.querySelectorAll(".overlay-wrapper");
  overlayWrapper.forEach((element) => {
    element.classList.toggle("transit");
  });
}

/**
 * Placeholder function for menu toggle functionality
 * @returns {void}
 */
function toggleMenu () {
  const menu = document.getElementById("menu");
}

/**
 * Prevents event propagation to parent elements
 * @param {Event} event - The event object
 * @returns {void}
 */
function onclickProtection(event) {
  event.stopPropagation();
}

/**
 * Updates task status and opens add task overlay
 * @async
 * @param {string} status - The status to set for the new task
 * @returns {Promise<void>}
 */
async function addTask(status) {
  updateTaskStatus(status);
  openAddTask();
  await loadUsersTask();
  loadTaskFormTemplate("firstBoardAddTask", "secondBoardAddTask");
  activePriority("medium");
}

/**
 * Updates the global task status variable
 * @param {string} status - The status to set
 * @returns {void}
 */
function updateTaskStatus(status) {
  if (!status) return;
  taskStatus = status;
}

/**
 * Loads HTML content from a given URL
 * @async
 * @param {string} link - The URL to fetch HTML from
 * @returns {Promise<string>} The HTML content as string
 */
async function loadHTML(link) {
  const resp = await fetch(link);
  const html = await resp.text();
  return html;
}

/**
 * Opens the add task overlay with animation
 * @returns {void}
 */
function openAddTask() {
  const addTask = document.getElementById("add-task-board");
  const container = document.getElementById("task-overlay");
  addTask.classList.toggle("d-none");
  setTimeout(() => {
    addTask.classList.toggle("transparent-background");
    container.classList.toggle("transit");
  }, 10);
}

/**
 * Closes the add task overlay with animation
 * @returns {void}
 */
function closeAddTask() {
  clearTaskFormContainers();
  const addTask = document.getElementById("add-task-board");
  const container = document.getElementById("task-overlay");
  addTask.classList.toggle("transparent-background");
  container.classList.toggle("transit");
  setTimeout(() => {
    addTask.classList.toggle("d-none");
  }, 250);
}

//---------Call up user information------------------------

/**
 * Renders user avatar icon in the profile picture element
 * @async
 * @returns {Promise<void>}
 */
async function renderUserIcon() {
  const element = document.querySelector(".profile-picture");
  let name = loadUrlParams();
  if (!name) name = "Guest";
  element.innerHTML = createAvater(name);
}

/**
 * Loads and returns URL parameters from current page URL
 * @returns {string|null} The value of the 'msg' parameter or null if not found
 */
function loadUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  return msg;
}

/**
 * Creates avatar initials from a full name
 * @param {string} name - The full name to create avatar from
 * @returns {string} The avatar initials (first letters of each word)
 */
function createAvater(name) {
  let myArr = name.split(" ");
  let avatar = "";
  myArr.forEach((element) => {
    avatar += element.charAt(0);
  });
  return avatar;
}

/**
 * Updates navigation links with user parameter
 * @param {string} target - The data-task attribute value to target
 * @returns {void}
 */
function updateLinksWithUserKey(target) {
  let name = loadUrlParams();
  if (!name) name = "Guest";
  const links = document.querySelectorAll(`[data-task="${target}"]`);
  links.forEach((element) => {
    let newLink = element.href + `?msg=${encodeURIComponent(name)}`;
    element.href = newLink;
  });
}

/**
 * Updates menu links with user parameter
 * @returns {void}
 */
function updateMenuWithUserKey() {
  let name = loadUrlParams();
  const menu = document.querySelector(".menu").children;
  if (!name) name = "Guest";
  for (let index = 0; index < menu.length; index++) {
    if (index == 2) break;
    let newLink = menu[index].href + `?msg=${encodeURIComponent(name)}`;
    menu[index].href = newLink;
  }
}

/**
 * Checks if current page is privacy policy view and adjusts layout accordingly
 * @returns {void}
 */
function isPrivacyMessage() {
  let msg = loadUrlParams();
  if (msg === "privacy") adjustLayoutForPrivacyView();
}

/**
 * Adjusts layout for privacy policy view by modifying navigation elements
 * @returns {void}
 */
function adjustLayoutForPrivacyView() {
  const ul = document.querySelector(".nav-wrapper").children[0];
  const helpSymbol = document.querySelector(".help-symbol");
  const profilePicture = document.querySelector(".profile-picture");
  ul.innerHTML = "";
  ul.innerHTML += navLink("login", "../index.html", "Log in");
  if(profilePicture, helpSymbol) {
    helpSymbol.remove();
    profilePicture.remove();
  }
}

/**
 * Initializes navbar by rendering user icon and updating links
 * @returns {void}
 */
function initializeNavbar() {
  renderUserIcon();
  updateLinksWithUserKey("navLink");
  updateMenuWithUserKey();
}

/**
 * Toggles menu visibility using translateX transformation
 * @returns {void}
 */
function toggleMenuSimple() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("menu-translateX");
}

/**
 * Toggles menu visibility with animation effects
 * @returns {void}
 */
function toggleMenu() {
  const container = document.querySelector('.menu-container');
  const menu = document.querySelector('.menu');

  if (container.style.display === 'flex') {

    menu.classList.remove('menu-visible');
    menu.classList.add('menu-hidden');

    menu.addEventListener('animationend', function handler() {
      container.style.display = 'none';
      menu.removeEventListener('animationend', handler);
    });
  } else {

    container.style.display = 'flex';
    menu.classList.remove('menu-hidden');
    menu.classList.add('menu-visible');
  }
}

/**
 * Adjusts back button link based on current page context
 * @returns {void}
 */
function adjustBackButtonLink () {
  const currentUrl = window.location.href;
  const button = document.querySelector(".back-button");
  if(!button) return;

  const backButtonLink = button.closest("a");
  if(!backButtonLink) return;

  if(currentUrl.includes("?msg=privacy")) {
    backButtonLink.href = "../html-templates/signup.html";
  } else {
    backButtonLink.href = "../html-templates/summary.html";
  }
}

/**
 * Adjusts back button link when DOM is loaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", adjustBackButtonLink);

/**
 * Adds click event listeners to navigation links when DOM is loaded
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link').forEach(function (li) {
    const a = li.querySelector('a[href]');
    if (!a) return; 

    li.addEventListener('click', function () {
      window.location.href = a.href;
    });
  });
});
