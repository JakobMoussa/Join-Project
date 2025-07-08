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

document.addEventListener("DOMContentLoaded", async () => {
});

function openOverlay() {
  document.getElementById("overlay").classList.remove("hidden");
  setTimeout(() => {
    toggleAnimation();
  }, 10);
}

function closeOverlay() {
  toggleAnimation();
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
  }, 250);
}

function toggleAnimation() {
  document.getElementById("overlay-wrapper").classList.toggle("transit");
}

function onclickProtection(event) {
  event.stopPropagation();
}

async function addTask(htmlPage) {
  try {
    openAddTask();
    const container = document.getElementById('add-task-form');
    const html = await loadHTML(htmlPage);
    let start = html.indexOf('<form class="tasks-form-container"');
    let end = html.indexOf('<div class="task-controls">');
    const addTaskTemplate = html.slice(start, end)
    container.innerHTML = addTaskTemplate;
  } catch (error) {
    console.error(error);
  }
}

async function loadHTML(link) {
  const resp = await fetch(link);
  const html = await resp.text();
  return html;
}

function openAddTask() {
  const addTask = document.getElementById('add-task-board');
  const container = document.getElementById('add-task-container');
  addTask.classList.toggle("d-none");
  setTimeout(() => {
    addTask.classList.toggle('transparent-background');
    container.classList.toggle("transit");
  }, 10);
}

function closeAddTask() {
  const addTask = document.getElementById('add-task-board');
  const container = document.getElementById('add-task-container');
  addTask.classList.toggle('transparent-background');
  container.classList.toggle("transit");
  setTimeout(() => {
    addTask.classList.toggle("d-none");
  }, 250);
}