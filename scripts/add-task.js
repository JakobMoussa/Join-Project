let subtask = [];
let users = [];
let selectedPriority = "medium";
let assignedUserArr = [];
let taskStatus = "to-do";

/**
 * Initializes the Add Task page
 * @async
 * @returns {Promise<void>}
 */
async function initAddTaskPage() {
  await loadUsersTask();
  loadTaskFormTemplate("firstTaskContainer", "secondTaskContainer");
  activePriority("medium");
  const clearBtn = document.getElementById("clear-btn");
  clearBtn.addEventListener("click", () => activePriority("medium"));
}
/**
 * Loads users from storage
 * @async
 * @returns {Promise<void>}
 */
async function loadUsersTask() {
  try {
    let usersObj = await loadData("users");
    users = [];
    if (usersObj && typeof usersObj === 'object') {
      for (const key in usersObj) {
        users.push(usersObj[key]);
      }
    }
    if (users.length === 0) {
      users.push({ name: "Guest", color: "#29ABE2", assigned: false });
    }
  } catch (error) {
    console.warn("Fehler beim Laden der Benutzer:", error);
    users = [{ name: "Guest", color: "#29ABE2", assigned: false }];
  }
}
/**
 * Creates a subtask object
 * @param {number} id - The unique identifier
 * @param {string} value - The text content
 * @returns {Object} The subtask object
 */
function createSubObj(id, value) {
  return { id: id, value: value, edit: false };
}

/**
 * Prevents default form submission
 * @param {Event} event - The form submit event
 * @returns {void}
 */
function preventFromSubmit(event) {
  event.preventDefault();
}
/**
 * Loads task form template
 * @param {string} firstTarget - ID of first container
 * @param {string} secondTarget - ID of second container
 * @returns {void}
 */
function loadTaskFormTemplate(firstTarget, secondTarget) {
  let firstContainer = document.getElementById(firstTarget);
  let secondContainer = document.getElementById(secondTarget);
  firstContainer.innerHTML = titleTaskTpl() + descriptionTaskTpl() + dateTaskTpl();
  secondContainer.innerHTML = prioTaskTpl() + assignedTaskTpl() + categoryTaskTpl() + subtaskTpl();
}
/**
 * Toggles assigned users dropdown
 * @returns {void}
 */
function toggleAssignedDropdown() {
  const taskContainerRef = document.getElementById("task-container");
  const btn = document.getElementById("assaign-btn");
  const assignedDropdown = document.getElementById("assigned-dropdown");
  const overlay = document.getElementById("assigned-dropdown-overlay");
  loadUsers();
  taskContainerRef.classList.toggle("zindex-12");
  assignedDropdown.classList.toggle("d-none");
  overlay.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
}

/**
 * Toggles category dropdown
 * @returns {void}
 */
function toggleCategoryDropdown() {
  const categoryContainerRef = document.getElementById("category-container");
  const categoryDropdown = document.getElementById("category-dropdown");
  const btn = document.getElementById("category-btn");
  const overlay = document.getElementById("category-dropdown-overlay");
  categoryContainerRef.classList.toggle("zindex-12");
  categoryDropdown.classList.toggle("d-none");
  overlay.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
  categoryContainerRef.classList.toggle("boxshadow");
}
/**
 * Sets active priority button
 * @param {string} prio - Priority level
 * @returns {void}
 */
function activePriority(prio) {
  const priorities = ["urgent", "medium", "low"];
  selectedPriority = prio;
  priorities.forEach((priority) => {
    const btn = document.getElementById(priority);
    const icon = document.getElementById(`${priority}-btn-icon`);
    priority == selectedPriority ? prioBtnActive(btn, icon, priority) : prioBtnOff(btn, icon, priority);
  });
}
/**
 * Activates priority button visual state
 * @param {HTMLElement} btn - Button element
 * @param {HTMLElement} icon - Icon element
 * @param {string} priority - Priority level name
 * @returns {void}
 */
function prioBtnActive(btn, icon, priority) {
  btn.classList.add(`active-${priority}-btn`);
  icon.classList.add(`active-${priority}-icon`);
}
/**
 * Deactivates priority button visual state
 * @param {HTMLElement} btn - Button element
 * @param {HTMLElement} icon - Icon element
 * @param {string} priority - Priority level name
 * @returns {void}
 */
function prioBtnOff(btn, icon, priority) {
  btn.classList.remove(`active-${priority}-btn`);
  icon.classList.remove(`active-${priority}-icon`);
}
/**
 * Adds new subtask
 * @returns {void}
 */
function addSubtask() {
  const inputElement = document.getElementById("subtask-input");
  const subList = document.getElementById("sub-list");
  const value = inputElement.value.trim();
  if (value === "") {
    inputElement.focus();
    return;
  }
  let id = getNextFreeId();
  subtask.push(createSubObj(id, value));
  subList.innerHTML += subListItem(value, id);
  inputElement.value = "";
}
/**
 * Finds next available subtask ID
 * @returns {number} Next free ID
 */
function getNextFreeId() {
  let i = 0;
  while (subtask.some((item) => item.id === i)) i++;
  return i;
}
/**
 * Removes subtask by ID
 * @param {number} value - Subtask ID
 * @returns {void}
 */
function removeSubItem(value) {
  subtask = subtask.filter((element) => element.id != value);
  reloadSubTask();
}
/**
 * Reloads subtask list in UI
 * @returns {void}
 */
function reloadSubTask() {
  const subList = document.getElementById("sub-list");
  subList.innerHTML = "";
  subtask.forEach((element) => {
    element.edit == false 
      ? subList.innerHTML += subListItem(element.value, element.id)
      : subList.innerHTML += subListItemEdit(element.value, element.id);
  });
}
/**
 * Toggles subtask edit mode
 * @param {number} id - Subtask ID
 * @param {boolean} editMode - Edit mode flag
 * @returns {void}
 */
function editSubItem(id, editMode) {
  const input = document.getElementById(`sub-input-${id}`);
  for (let index = 0; index < subtask.length; index++) {
    if (subtask[index].id == id) {
      subtask[index].edit = editMode;
      if (input.value.length > 0) subtask[index].value = input.value;
      break;
    }
  }
  reloadSubTask();
}
/**
 * Selects category from dropdown
 * @param {Event} e - Click event
 * @returns {void}
 */
function selectCategory(e) {
  let value = e.target.innerHTML;
  document.getElementById("select-category").innerHTML = value;
  toggleCategoryDropdown();
}
/**
 * Loads users in assigned dropdown
 * @returns {void}
 */
function loadUsers() {
  const assignedDropdown = document.getElementById("assigned-dropdown");
  assignedDropdown.innerHTML = "";
  users.forEach((user) => {
    let initials = initialsFromName(user.name);
    let containerClass = user.assigned ? "single-user-container_select" : "single-user-container";
    assignedDropdown.innerHTML += singleUserContainer(containerClass, initials, user.name, user.color);
  });
}
/**
 * Extracts initials from name
 * @param {string} user - Full name
 * @returns {string} Initials in uppercase
 */
function initialsFromName(user) {
  let initials = "";
  user.split(" ").forEach((element) => initials += element.charAt(0));
  return initials;
}
/**
 * Toggles user assignment
 * @param {string} name - User name
 * @returns {void}
 */
function assignedUser(name) {
  if (!users || users.length === 0) return;
  let index = searchUserIndex(name);
  if (index === undefined || index === -1) return;
  if (users[index].assigned === true) {
    users[index].assigned = false;
    removeUserFromArray(name);
  } else {
    users[index].assigned = true;
    assignedUserArr.push(users[index]);
  }
  loadUsers();
  loadAssignedUserIcons();
}
/**
 * Searches for user index by name
 * @param {string} name - User name
 * @returns {number|undefined} User index
 */
function searchUserIndex(name) {
  if (!users || users.length === 0) return undefined;
  for (let index = 0; index < users.length; index++) {
    if (users[index] && users[index].name === name) return index;
  }
  return undefined;
}
/**
 * Loads assigned user icons
 * @returns {void}
 */
function loadAssignedUserIcons() {
  const container = document.getElementById("icons-container");
  container.innerHTML = "";
  const assignedUsers = users.filter(user => user.assigned);
  const maxIcons = 4;
  assignedUsers.forEach((user, index) => {
    if (index < maxIcons - 1) {
      let initials = initialsFromName(user.name);
      container.innerHTML += userIcon(user.color, initials, user.name);
    }
  });
  if (assignedUsers.length > maxIcons - 1) {
    const remaining = assignedUsers.length - (maxIcons - 1);
    container.innerHTML += `<div class="user-icon more">+${remaining}</div>`;
  }
}
/**
 * Removes user from assigned array
 * @param {string} name - User name
 * @returns {void}
 */
function removeUserFromArray(name) {
  assignedUserArr = assignedUserArr.filter(user => user.name != name);
}

/**
 * Creates task from form data
 * @async
 * @returns {Promise<void>}
 */
async function createTaskForm() {
  let validateTask = isTaskDataValid();
  if (!validateTask) return;
  let task = taskObjTemplate(selectedPriority, assignedUserArr, subtask, taskStatus);
  await postData("tasks", task);
  window.location.href = `./board.html`;
}

/**
 * Validates task form
 * @returns {void}
 */
function runInitIfValid() {
  let validateTask = isTaskDataValid();
  if (!validateTask) return;
  initAddTaskPage();
}

/**
 * Validates task form fields
 * @returns {boolean} Validation result
 */
function isTaskDataValid() {
  let isValid = true;
  const formIds = getFormElementsIds();
  if (formIds.title.value.trim().length <= 0) {
    showError(formIds.title, "title");
    isValid = false;
  }
  if (formIds.category.span.innerHTML == "Select Task category") {
    showError(formIds.category.dropdown, "category");
    isValid = false;
  }
  if (!formIds.date.value) {
    showError(formIds.date, "date");
    isValid = false;
  }
  return isValid;
}

/**
 * Gets form element references
 * @returns {Object} Form elements
 */
function getFormElementsIds() {
  return {
    title: document.getElementById("titleInput"),
    date: document.getElementById("date"),
    category: {
      span: document.getElementById("select-category"),
      dropdown: document.getElementById("open-category-dropdown"),
    },
    description: document.getElementById("description"),
  };
}

/**
 * Creates task object from form values
 * @param {string} priority - Task priority
 * @param {Array} users - Assigned users
 * @param {Array} subtask - Subtasks
 * @param {string} status - Task status
 * @returns {Object} Task object
 */
function taskObjTemplate(priority = "medium", users, subtask, status = "to-do") {
  return {
    title: document.getElementById("titleInput").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
    priority: priority,
    assigned: users,
    category: document.getElementById("select-category").innerHTML,
    subtask: subtask,
    status: status,
    order: 1000,
  };
}

/**
 * Clears input error styling
 * @param {HTMLElement} target - Input element
 * @param {HTMLElement} error - Error element
 * @returns {void}
 */
function clearInputError(target, error) {
  target.classList.remove("light-red-outline");
  target.classList.add("blue-outline");
  error.innerHTML = "";
}

/**
 * Adds error styling to input
 * @param {HTMLElement} target - Input element
 * @returns {void}
 */
function addErrorClasses(target) {
  target.classList.add("light-red-outline");
  target.classList.remove("blue-outline");
}

/**
 * Shows error message for field
 * @param {HTMLElement} target - Input element
 * @param {string} name - Field name
 * @returns {void}
 */
function showError(target, name) {
  let error = document.getElementById(`${name}Error`);
  addErrorClasses(target);
  error.innerHTML = "This field is required";
  target.addEventListener("click", () => clearInputError(target, error));
}

/**
 * Handles focus out event
 * @param {Event} e - Focus event
 * @returns {void}
 */
function onFocusOut(e) {
  let target = e.target;
  target.classList.remove("light-red-outline");
  target.classList.remove("blue-outline");
}