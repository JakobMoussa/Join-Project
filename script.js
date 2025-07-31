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

document.addEventListener("DOMContentLoaded", async () => { });

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

function toggleAnimation() {
  const overlayWrapper = document.querySelectorAll(".overlay-wrapper");
  overlayWrapper.forEach((element) => {
    element.classList.toggle("transit");
  });
}

function onclickProtection(event) {
  event.stopPropagation();
}

async function addTask(status) {
  updateTaskStatus(status);
  openAddTask();
  await loadUsersTask();
  loadTaskFormTemplate("firstBoardAddTask", "secondBoardAddTask");
  activePriority("medium");
}

function updateTaskStatus(status) {
  if (!status) return;
  taskStatus = status;
}

async function loadHTML(link) {
  const resp = await fetch(link);
  const html = await resp.text();
  return html;
}

function openAddTask() {
  const addTask = document.getElementById("add-task-board");
  const container = document.getElementById("task-overlay");
  addTask.classList.toggle("d-none");
  setTimeout(() => {
    addTask.classList.toggle("transparent-background");
    container.classList.toggle("transit");
  }, 10);
}

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

// ----------------Contact Overlay function---------------------

function openAddContactOverlay() {
  const overlayRef = document.getElementById("overlay");
  overlayRef.innerHTML = "";
  overlayRef.innerHTML += getContactOverlayTemplate();
  openOverlay();

  initContactForm();

}

//---------Call up user information------------------------


 document.addEventListener("DOMContentLoaded", async () => {
        const users = await loadData("users"); // Holt alle User-Daten aus Firebase

        document.querySelectorAll(".contact").forEach(contactEl => {
            contactEl.addEventListener("click", () => {
                const name = contactEl.querySelector(".name").textContent.trim();
                const email = contactEl.querySelector(".email").textContent.trim();

                // Sucht passenden User aus Firebase (per Email oder Name)
                const userKey = Object.keys(users).find(key => 
                    users[key].email === email || users[key].name === name
                );

                if (userKey) {
                    const user = users[userKey];
                    renderUserInfo(user);
                } else {
                    console.warn("User not found in Firebase");
                }
            });
        });
    });

async function renderUserIcon() {
  const element = document.querySelector(".profile-picture");
  const name = loadUrlParams();  
  if (!name) name = "Guest";
  element.innerHTML = createAvater(name);
}

function loadUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');
  return msg
}

function createAvater(name) {
  let myArr = name.split(" ");
  let avatar = "";
  myArr.forEach(element => {
    avatar += element.charAt(0);
  });
  return avatar
}

function updateNavLinksWithUserKey() {
  const name = loadUrlParams();
  const links = document.querySelectorAll('[data-task="navLink"]');
  links.forEach(element => {
    let newLink = element.href + `?msg=${encodeURIComponent(name)}`;
    element.href = newLink;
  });
}

function initializeNavbar() {
  renderUserIcon();
  updateNavLinksWithUserKey();
}
