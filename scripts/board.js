/**
 * Renders all tasks on the board organized by status columns
 * @param {Object} tasks - Object containing all tasks
 * @returns {void}
 */
function renderBoard(tasks) {
  removeTasks();
  removePlaceholder();
  if (!tasks) return;

  let categories = {};
  Object.entries(tasks).forEach((task) => {
    if (!categories[task[1].status]) categories[task[1].status] = [];
    categories[task[1].status].push(task);
  });

  for (let status in categories) {
    let column = document.querySelector(`.column[data-task="${status}"]`);
    let taskWrapper = column?.querySelector(".task-wrapper");
    if (taskWrapper) {
      let sortedTasks = categories[status].sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0));
      sortedTasks.forEach((task) => taskWrapper.innerHTML += createTaskTemplate(task[0], task[1]));
    }
  }
  addPlaceholdersToEmptyColumns();
}

/*** Removes all task elements from the board
 * @returns {void}
 */
function removeTasks() {
  document.querySelectorAll(".task-wrapper .task").forEach((task) => task.remove());
}

/**
 * Removes all placeholder elements
 * @returns {void}
 */
function removePlaceholder() {
  document.querySelectorAll(".task-wrapper .empty").forEach((empty) => empty.remove());
}

/*** Creates CSS class name from category string
 * @param {string} category - Category name
 * @returns {string} Formatted class name
 */
function createCategoryClass(category) {
  return category.toLowerCase().split(" ").join("-");
}

/*** Checks if subtasks exist and creates progress bar
 * @param {Array<Object>} subtasks - Array of subtasks
 * @returns {string} HTML for progress wrapper
 */
function checkForSubtask(subtasks) {
  if (!subtasks) return "";
  const numerus = subtasks.length === 1 ? "Subtask" : "Subtasks";
  const subtaskDone = subtasks.filter((subtask) => subtask.edit);
  return createProgressWrapper(subtasks, numerus, subtaskDone);
}

/*** Creates HTML for assigned users display
 * @param {Array<Object>} assignedUserArr - Assigned users array
 * @returns {string} HTML for assigned users
 */
function checkForAssignment(assignedUserArr) {
  if (!assignedUserArr) return "";
  let personHTML = "";
  assignedUserArr.forEach((userObj) => {
    let username = createUsernameAbbreviation(userObj);
    personHTML += createPersonTemplate(userObj, username);
  });
  return personHTML;
}

/*** Creates username abbreviation
 * @param {Object} userObj - User object
 * @returns {string|undefined} Two-letter abbreviation
 */
function createUsernameAbbreviation(userObj) {
  let usernameArr = userObj.name.split(" ");
  return usernameArr.length > 1 ? usernameArr[0][0] + usernameArr[1][0] : undefined;
}

/*** Adds placeholders to empty columns
 * @returns {void}
 */
function addPlaceholdersToEmptyColumns() {
  document.querySelectorAll(".task-wrapper").forEach((taskWrapper) => {
    if (!taskWrapper.querySelector(".task") && !taskWrapper.querySelector(".empty")) {
      const placeholder = taskWrapper.dataset.task === "done" 
        ? createTaskPlaceholderDone() 
        : createTaskPlaceholder();
      taskWrapper.innerHTML += placeholder;
    }
  });
}

/*** Loads and renders detailed task view
 * @async
 * @param {string} taskId - Task identifier
 * @returns {Promise<void>}
 */
async function renderSelectedTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);
  overlayRef.innerHTML = createDetailedTaskTemplate(taskId, task);
  openOverlay();
}

/**
 * Creates HTML for assigned users in detail view
 * @param {Array<Object>} assignedUserArr - Assigned users array
 * @returns {string} HTML for detail view
 */
function checkForAssignmentDetailView(assignedUserArr) {
  return assignedUserArr ? createPersonTemplateDetailView(assignedUserArr) : "";
}

/**
 * Creates HTML list of assigned users
 * @param {Array<Object>} assignedUserArr - Assigned users array
 * @returns {string} HTML user list
 */
function createPersonList(assignedUserArr) {
  let html = "";
  assignedUserArr.forEach((userObj) => {
    let username = createUsernameAbbreviation(userObj);
    html += createPersonListItem(userObj, username);
  });
  return html;
}

/**
 * Creates HTML for subtasks in detail view
 * @param {string} taskId - Task identifier
 * @param {Array<Object>} subtaskArr - Subtasks array
 * @returns {string} HTML for subtasks
 */
function checkForSubtasksDetailView(taskId, subtaskArr) {
  return subtaskArr ? createSubtaskTemplate(taskId, subtaskArr) : "";
}

/*** Creates HTML list of subtasks
 * @param {string} taskId - Task identifier
 * @param {Array<Object>} subtaskArr - Subtasks array
 * @returns {string} HTML subtask list
 */
function createSubtaskList(taskId, subtaskArr) {
  let html = "";
  subtaskArr.forEach((subtaskObj) => html += createSubtaskListItem(taskId, subtaskObj));
  return html;
}

/*** Toggles subtask completion state
 * @async
 * @param {string} taskId - Task identifier
 * @param {number} subtaskId - Subtask identifier
 * @returns {Promise<void>}
 */
async function checkInOutSubtask(taskId, subtaskId) {
  let taskObj = await loadData("tasks/" + taskId);
  let subtaskRef = document.querySelector(`.btn-subtask[data-id="${subtaskId}"]`);
  let subtask = taskObj.subtask.find((subtask) => subtask.id == subtaskId);
  
  if (subtaskRef) subtaskRef.classList.toggle("checked");
  if (subtask) {
    subtask.edit = !subtask.edit;
    await putData("tasks/" + taskId, taskObj);
    updateProgressBar(taskObj, document.getElementById(`${taskId}`)?.querySelector(".progress-wrapper"));
  }
}

/*** Updates subtask progress bar
 * @param {Object} taskObj - Task object
 * @param {HTMLElement} subtaskProgress - Progress element
 * @returns {void}
 */
function updateProgressBar(taskObj, subtaskProgress) {
  if (!subtaskProgress) return;
  const numerus = taskObj.subtask.length === 1 ? "Subtask" : "Subtasks";
  const subtaskDone = taskObj.subtask.filter((st) => st.edit);
  subtaskProgress.innerHTML = progessTemplate(taskObj.subtask, numerus, subtaskDone);
  subtaskProgress.style.display = subtaskDone.length === 0 ? "none" : "";
}

/*** Deletes task from database
 * @async
 * @param {string} path - Task path
 * @returns {Promise<void>}
 */
async function deleteTask(path) {
  await deleteData(path);
  closeOverlay();
  try { await initBoard(); } catch (error) { console.error(error); }
}

/*** Searches and filters tasks
 * @async
 * @returns {Promise<void>}
 */
async function searchTasks() {
  const tasks = await loadData("/tasks");
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const tasksObjLength = Object.keys(tasks).length;

  for (let task in tasks) {
    const taskElement = document.querySelector(`.task[data-id="${task}"]`);
    if (taskElement) {
      const isVisible = tasks[task].title.toLowerCase().includes(searchInput) || 
                       tasks[task].description.toLowerCase().includes(searchInput);
      taskElement.classList.toggle("hidden", !isVisible);
    }
  }

  document.querySelectorAll(".empty").forEach((el) => el.classList.add("hidden"));
  const hiddenTasks = document.querySelectorAll(".task.hidden");
  document.querySelector(".no-results").classList.toggle("hidden", tasksObjLength !== hiddenTasks.length);
  
  if (!searchInput) document.querySelectorAll(".empty").forEach((el) => el.classList.remove("hidden"));
}

/*** Opens task edit form
 * @async
 * @param {string} taskId - Task identifier
 * @returns {Promise<void>}
 */
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

/*** Prepares overlay for editing
 * @param {string} taskId - Task identifier
 * @returns {void}
 */
function prepareOverlay(taskId) {
  const overlayWrapper = document.getElementById("overlay-wrapper");
  overlayWrapper.innerHTML = editTaskTpl() + okBtn(taskId);
}

/*** Resets task data arrays
 * @returns {void}
 */
function resetTaskData() {
  subtask = [];
  users = [];
  assignedUserArr = [];
}

/*** Imports task form elements
 * @param {Object} task - Task object
 * @returns {void}
 */
function importEditElements(task) {
  const container = document.querySelector(".editTask-container");
  container.innerHTML = titleTaskTpl(task.title) + descriptionTaskTpl(task.description) + 
                       dateTaskTpl(task.date) + prioTaskTpl() + assignedTaskTpl() + 
                       categoryTaskTpl() + subtaskTpl();
  taskStatus = task.status;
}

/*** Updates category display
 * @param {Object} task - Task object
 * @returns {void}
 */
function changeCategorie(task) {
  document.getElementById("select-category").innerHTML = task.category;
}

/*** Loads subtasks into UI
 * @param {Array<Object>} arr - Subtasks array
 * @returns {void}
 */
function loadSubTasks(arr) {
  const subList = document.getElementById("sub-list");
  if (!arr) return;
  arr.forEach((task) => {
    subtask.push({...task, edit: false});
    subList.innerHTML += subListItem(task.value, task.id);
  });
}

/*** Renders assigned users
 * @param {Object} task - Task object
 * @returns {void}
 */
function renderAssignedUsers(task) {
  if (!task.assigned || !users?.length) return;
  task.assigned.forEach((user) => user?.name && assignedUser(user.name));
}

/*** Saves edited task
 * @async
 * @param {string} taskId - Task identifier
 * @returns {Promise<void>}
 */
async function saveEditedTask(taskId) {
  if (!taskId || !isTaskDataValid()) return;
  let task = taskObjTemplate(selectedPriority, assignedUserArr, subtask, taskStatus);
  await putData("tasks/" + taskId, task);
  await initBoard();
  await renderOpenTask(taskId);
  resetTaskData();
}

/*** Renders task without animation
 * @async
 * @param {string} taskId - Task identifier
 * @returns {Promise<void>}
 */
async function renderOpenTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);
  overlayRef.innerHTML = createDetailedTaskTemplate(taskId, task).replace("transit", "");
}

/*** Creates new task from board
 * @async
 * @returns {Promise<void>}
 */
async function renderTaskFromBoard() {
  if (!isTaskDataValid()) return;
  await createTaskForm();
  closeAddTask();
  clearTaskFormContainers();
  await initBoard();
}

/*** Clears form containers
 * @returns {void}
 */
function clearTaskFormContainers() {
  document.getElementById("firstBoardAddTask").innerHTML = "";
  document.getElementById("secondBoardAddTask").innerHTML = "";
}

/**
 * Handles drag start
 * @param {DragEvent} ev - Drag event
 * @param {string} id - Task ID
 * @returns {void}
 */
function dragstartHandler(ev, id) {
  ev.dataTransfer.setData("text", id);
  ev.target.classList.add("dragging");
}

/*** Handles drag end
 * @param {DragEvent} ev - Drag event
 * @returns {void}
 */
function dragendHandler(ev) {
  ev.target.classList.remove("dragging");
}

/*** Handles drag over
 * @param {DragEvent} ev - Drag event
 * @returns {void}
 */
function dragoverHandler(ev) {
  ev.preventDefault();
  const column = ev.target.closest(".task-wrapper");
  const afterElement = getDragAfterElement(column, ev.clientY);
  const draggable = document.querySelector(".dragging");
  afterElement ? column.insertBefore(draggable, afterElement) : column.appendChild(draggable);
}

/*** Gets element to insert before
 * @param {HTMLElement} column - Column element
 * @param {number} y - Y coordinate
 * @returns {HTMLElement|undefined} Target element
 */
function getDragAfterElement(column, y) {
  const draggableElements = [...column.querySelectorAll(".draggable:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Handles task drop
 * @async
 * @param {DragEvent} ev - Drop event
 * @param {string} category - New category
 * @returns {Promise<void>}
 */
async function dropHandler(ev, category) {
  ev.preventDefault();
  const taskId = ev.dataTransfer.getData("text");
  const targetColumn = ev.target.closest(".task-wrapper");
  if (!targetColumn) return;
  
  let taskObj = await loadData("tasks/" + taskId);
  taskObj.status = category;
  adjustPlaceholders();
  await putData("tasks/" + taskId, taskObj);
  await adjustTaskOrder(targetColumn);
}

/**
 * Adjusts placeholders
 * @returns {void}
 */
function adjustPlaceholders() {
  removePlaceholder();
  addPlaceholdersToEmptyColumns();
}

/*** Adjusts task order in column
 * @async
 * @param {HTMLElement} targetColumn - Target column
 * @returns {Promise<void>}
 */
async function adjustTaskOrder(targetColumn) {
  const tasks = targetColumn.querySelectorAll(".draggable");
  for (let i = 0; i < tasks.length; i++) {
    const taskId = tasks[i].dataset.id;
    let taskObj = await loadData("tasks/" + taskId);
    taskObj.order = i;
    await putData("tasks/" + taskId, taskObj);
  }
}

/*** Mobile navigation handler */
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.add-btn');
  if (button && window.innerWidth < 800) {
    button.addEventListener('click', () => window.location.href = 'add-task.html');
  }
});

/**
 * Initializes board
 * @async
 * @returns {Promise<void>}
 */
async function initBoard() {
  let taskObj = await loadData("tasks/");
  document.getElementById("search-input").value = "";
  renderBoard(taskObj);
}

document.addEventListener("DOMContentLoaded", () => initBoard());