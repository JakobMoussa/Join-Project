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

document.addEventListener("DOMContentLoaded", async () => {});

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
  const wrapper = document.createElement('div');
  wrapper.innerHTML = getContactOverlayTemplate();
  const overlay = wrapper.firstElementChild;
  const modal = overlay.querySelector('.modal');
  document.body.appendChild(overlay);
  overlay.addEventListener('click', () => overlay.remove());
  modal.addEventListener('click', (e) => e.stopPropagation());
  overlay.querySelector('.close-btn').onclick = () => overlay.remove();
  overlay.querySelector('.cancel').onclick = () => overlay.remove();
  overlay.querySelector('.contact-form').onsubmit = (e) => {
    e.preventDefault();
    alert("Kontakt erstellt!");
    overlay.remove();
  };
}
