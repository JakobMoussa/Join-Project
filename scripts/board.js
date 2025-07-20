function renderBoard(tasks) {
  const columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    column.querySelectorAll(".task").forEach((task) => task.remove());
    column.querySelectorAll(".empty").forEach((empty) => empty.remove());
  });

  if (tasks) {
    for (let task in tasks) {
      let column = document.querySelector(`.column[data-task="${tasks[task].status}"]`);
      if (column) {
        let taskTemplate = createTaskTemplate(task, tasks[task]);
        column.innerHTML += taskTemplate;
      }
    }
  } else {
    return createTaskPlaceholder();
  }
  addPlaceholdersToEmptyColumns();
}

function createCategoryClass(category) {
  // from e.g. "Technical Task" to "technical-task" for CSS class
  return category.toLowerCase().split(" ").join("-");
}

function checkForSubtask(subtasks) {
  if (subtasks) {
    let progressHTML = "";
    const numerus = subtasks.length === 1 ? "Subtask" : "Subtasks";
    const subtaskDone = subtasks.filter((subtask) => subtask.edit);
    progressHTML += createProgressTemplate(subtasks, numerus, subtaskDone);
    return progressHTML;
  } else {
    return "";
  }
}

function checkForAssignment(assignedUserArr) {
  if (assignedUserArr) {
    let personHTML = "";
    assignedUserArr.forEach((userObj) => {
      let username = createUsernameAbbreviation(userObj);
      personHTML += createPersonTemplate(userObj, username);
    });
    return personHTML;
  } else {
    return "";
  }
}

function createUsernameAbbreviation(userObj) {
  let usernameArr = userObj.name.split(" ");
  if (usernameArr.length > 1) {
    let usernameAbbr = usernameArr[0][0] + usernameArr[1][0];
    return usernameAbbr;
  }
}

function addPlaceholdersToEmptyColumns() {
  const columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    if (!column.querySelector(".task")) {
      column.innerHTML += createTaskPlaceholder();
    }
  });
}

async function renderSelectedTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);

  overlayRef.innerHTML = "";
  overlayRef.innerHTML += createDetailedTaskTemplate(taskId, task);
  openOverlay();
}

function checkForAssignmentDetailView(assignedUserArr) {
  if (assignedUserArr) {
    return createPersonTemplateDetailView(assignedUserArr);
  } else {
    return "";
  }
}

function createPersonList(assignedUserArr) {
  let html = "";
  assignedUserArr.forEach((userObj) => {
    let username = createUsernameAbbreviation(userObj);
    html += createPersonListItem(userObj, username);
  });
  return html;
}

function checkForSubtasksDetailView(taskId, subtaskArr) {
  if (subtaskArr) {
    return createSubtaskTemplate(taskId, subtaskArr);
  } else {
    return "";
  }
}

function createSubtaskList(taskId, subtaskArr) {
  let html = "";
  subtaskArr.forEach((subtaskObj) => {
    html += createSubtaskListItem(taskId, subtaskObj);
  });
  return html;
}

async function checkInOutSubtask(taskId, subtaskId) {
  let taskObj = await loadData("tasks/" + taskId);
  let subtaskRef = document.querySelector(`.btn-subtask[data-id="${subtaskId}"]`);
  let subtask = taskObj.subtask.find((subtask) => subtask.id == subtaskId);

  subtaskRef.classList.toggle("checked");
  if (subtask) {
    subtask.edit = !subtask.edit;
    await putData("tasks/" + taskId, taskObj);
  }
}

async function deleteTask(path) {
  await deleteData(path);
  closeOverlay();
  try {
    await initBoard();
  } catch (error) {
    console.error(error);
  }
}

async function searchTasks() {
  const tasks = await loadData("/tasks");
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const tasksObjLength = Object.keys(tasks).length;

  for (let task in tasks) {
    const taskElement = document.querySelector(`.task[data-id="${task}"]`);
    if (taskElement) {
      const isVisible = tasks[task].title.toLowerCase().includes(searchInput) || tasks[task].description.toLowerCase().includes(searchInput);
      taskElement.classList.toggle("hidden", !isVisible);
    }
  }

  document.querySelectorAll(".empty").forEach((element) => element.classList.add("hidden"));

  const taskElements = document.querySelectorAll(".task.hidden");
  checkIfNoResults(tasksObjLength, taskElements);

  if (!searchInput) {
    document.querySelectorAll(".empty").forEach((element) => element.classList.remove("hidden"));
  }
}

function checkIfNoResults(totalTaskCount, hiddenTaskElements) {
  let noResultsRef = document.querySelector(".no-results");

  if (totalTaskCount === hiddenTaskElements.length) {
    noResultsRef.classList.remove("hidden");
  } else {
    noResultsRef.classList.add("hidden");
  }
}

async function initBoard() {
  let taskObj = await loadData("tasks/");
  document.getElementById("search-input").value = "";
  renderBoard(taskObj);
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});

async function editTask(taskId) {
  const task = await loadData(`tasks/${taskId}`);
  resetTaskData();
  prepareOverlay(taskId);
  await loadUsersTask();
  importEditElements(task);
  activePriority(task.priority);
  changeCategorie(task);
  loadSubTasks(task.subtask);
  renderAssignedUsers(task);
}

function prepareOverlay(taskId) {
  const overlayWrapper = document.getElementById("overlay-wrapper");
  overlayWrapper.innerHTML = "";
  overlayWrapper.innerHTML += editTaskTpl();
  overlayWrapper.innerHTML += okBtn(taskId);
}

function resetTaskData() {
  subtask = [];
  users = [];
  assignedUserArr = [];
}

function importEditElements(task) {
  const editTaskContainer = document.querySelector(".editTask-container");
  editTaskContainer.innerHTML += titleTaskTpl(task.title);
  editTaskContainer.innerHTML += descriptionTaskTpl(task.description);
  editTaskContainer.innerHTML += dateTaskTpl(task.date);
  editTaskContainer.innerHTML += prioTaskTpl();
  editTaskContainer.innerHTML += assignedTaskTpl();
  editTaskContainer.innerHTML += categoryTaskTpl();
  editTaskContainer.innerHTML += subtaskTpl();
  taskStatus = task.status;
}

function changeCategorie(task) {
  let selectCategory = document.getElementById("select-category");
  selectCategory.innerHTML = task.category;
}

function loadSubTasks(arr) {
  const subList = document.getElementById("sub-list");
  if (!arr) return;
  arr.forEach((task) => {
    subtask.push(task);
    task.edit = false;
    subList.innerHTML += subListItem(task.value, task.id);
  });
}

function renderAssignedUsers(task) {
  task.assigned.forEach((user) => {
    assignedUser(user.name);
  });
}

async function saveEditedTask(taskId) {
  if (!taskId) return;
  let path = "tasks/" + taskId;
  let title = document.getElementById("titleInput");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let selectCategory = document.getElementById("select-category");
  let validateTask = isTaskDataValid(title, date, selectCategory);
  if (validateTask) return;

  let task = taskObjTemplate(title.value, description.value, date.value, selectedPriority, assignedUserArr, selectCategory.innerHTML, subtask, taskStatus);
  await putData(path, task);
  await initBoard();
  await renderOpenTask(taskId);
}

async function renderOpenTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);
  overlayRef.innerHTML = "";
  let taskTemplate = createDetailedTaskTemplate(taskId, task).replace("transit", "");
  overlayRef.innerHTML += taskTemplate;
}

async function renderTaskFromBoard() {
  let validate = validateTaskFromBoard();
  if (validate) return;
  let createTask = await createTaskForm();
  closeAddTask();
  clearTaskFormContainers();
  await initBoard();
}

function clearTaskFormContainers() {
  let firstBoardAddTask = document.getElementById("firstBoardAddTask");
  let secondBoardAddTask = document.getElementById("secondBoardAddTask");
  firstBoardAddTask.innerHTML = "";
  secondBoardAddTask.innerHTML = "";
}

function validateTaskFromBoard() {
  let title = document.getElementById("titleInput");
  let date = document.getElementById("date");
  let selectCategory = document.getElementById("select-category");
  let validateTask = isTaskDataValid(title, date, selectCategory);
  return validateTask;
}

/*  Drag & Drop function */

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  const taskId = ev.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskId);

  const targetColumn = ev.target.closest(".column");
  if (targetColumn) {
    targetColumn.appendChild(taskElement);

    const newStatus = targetColumn.getAttribute("data-task");
    updateTaskStatus(taskId, newStatus);
  }
}

function updateTaskStatus(taskId, newStatus) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    saveTasksToBackend();
  }
}

/*  -------------  */
