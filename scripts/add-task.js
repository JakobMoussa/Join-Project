let subtask = [];
let users = [];
let selectedPriority = "medium";
let assignedUserArr = [];
let taskStatus = "to-do";

async function initAddTaskPage() {
  await loadUsersTask();
  loadTaskFormTemplate("firstTaskContainer", "secondTaskContainer");
  activePriority("medium");
}

async function loadUsersTask() {
  let usersObj = await loadData("users");
  for (const key in usersObj) {
    users.push(usersObj[key]);
  }
}

function createSubObj(id, value) {
  return {
    id: id,
    value: value,
    edit: false,
  };
}

function preventFromSubmit(event) {
  event.preventDefault();
}

function loadTaskFormTemplate(firstTarget, secondTarget) {
  let firstContainer = document.getElementById(firstTarget);
  let secondContainer = document.getElementById(secondTarget);
  firstContainer.innerHTML = "";
  secondContainer.innerHTML = "";
  firstContainer.innerHTML += titleTaskTpl();
  firstContainer.innerHTML += descriptionTaskTpl();
  firstContainer.innerHTML += dateTaskTpl();
  secondContainer.innerHTML += prioTaskTpl();
  secondContainer.innerHTML += assignedTaskTpl();
  secondContainer.innerHTML += categoryTaskTpl();
  secondContainer.innerHTML += subtaskTpl();
}

function toggleAssignedDropdown() {
  const taskContainerRef = document.getElementById("task-container");
  const btn = document.getElementById("assaign-btn");
  const assignedDropdown = document.getElementById("assigned-dropdown");
  const assignedDropdownOverlay = document.getElementById("assigned-dropdown-overlay");

  loadUsers();
  taskContainerRef.classList.toggle("zindex-12");
  assignedDropdown.classList.toggle("d-none");
  assignedDropdownOverlay.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
}

function toggleCategoryDropdown() {
  const categoryContainerRef = document.getElementById("category-container");
  const categoryDropdown = document.getElementById("category-dropdown");
  const btn = document.getElementById("category-btn");
  const categoryContainer = document.getElementById("category-container");
  const assignedDropdownOverlay = document.getElementById("category-dropdown-overlay");

  categoryContainerRef.classList.toggle("zindex-12");
  categoryDropdown.classList.toggle("d-none");
  assignedDropdownOverlay.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
  categoryContainer.classList.toggle("boxshadow");
}

function activePriority(prio) {
  const priorities = ["urgent", "medium", "low"];
  selectedPriority = prio;
  priorities.forEach((priority) => {
    const btn = document.getElementById(priority);
    const icon = document.getElementById(`${priority}-btn-icon`);
    priority == selectedPriority ? prioBtnActive(btn, icon, priority) : prioBtnOff(btn, icon, priority);
  });
}

function prioBtnActive(btn, icon, priority) {
  btn.classList.add(`active-${priority}-btn`);
  icon.classList.add(`active-${priority}-icon`);
  selectedPriority = priority;
}

function prioBtnOff(btn, icon, priority) {
  btn.classList.remove(`active-${priority}-btn`);
  icon.classList.remove(`active-${priority}-icon`);
}

function addSubtask() {
  const inputElement = document.getElementById("subtask-input");
  const subList = document.getElementById("sub-list");

  const value = inputElement.value.trim();

  if (value === "") {
    inputElement.focus();
    return;
  }
 if (value === "") return;
 if (inputElement.value.length == 0) return;
  let id = getNextFreeId();
  subtask.push(createSubObj(id, value));
  subList.innerHTML += subListItem(value, id);
  inputElement.value = "";
}

function getNextFreeId() {
  let i = 0;
  while (subtask.some((item) => item.id === i)) {
    i++;
  }
  return i;
}

function removeSubItem(value) {
  const newArr = subtask.filter((element) => element.id != value);
  subtask = newArr;
  reloadSubTask();
}

function reloadSubTask() {
  const subList = document.getElementById("sub-list");
  subList.innerHTML = "";
  subtask.forEach((element) => {
    if (element.edit == false) {
      subList.innerHTML += subListItem(element.value, element.id);
    } else {
      subList.innerHTML += subListItemEdit(element.value, element.id);
    }
  });
}

function editSubItem(id, editMode) {
  const input = document.getElementById(`sub-input-${id}`);
  for (let index = 0; index < subtask.length; index++) {
    if (subtask[index].id == id) {
      subtask[index].edit = editMode;
      if (input.value.length > 0) {
        subtask[index].value = input.value;
      }
      break;
    }
  }
  reloadSubTask();
}

function selectCategory(e) {
  let value = e.target.innerHTML;
  const selectCategory = document.getElementById("select-category");
  selectCategory.innerHTML = value;
  toggleCategoryDropdown();
}

function loadUsers() {
  const assignedDropdown = document.getElementById("assigned-dropdown");
  assignedDropdown.innerHTML = "";
  users.forEach((user) => {
    let initials = initialsFromName(user.name);
    if (user.assigned) {
      assignedDropdown.innerHTML += singleUserContainer("single-user-container_select", initials, user.name, user.color);
    } else {
      assignedDropdown.innerHTML += singleUserContainer("single-user-container", initials, user.name, user.color);
    }
  });
}

function initialsFromName(user) {
  let initials = "";
  const array = user.split(" ");
  array.forEach((element) => {
    initials += element.charAt(0);
  });
  return initials;
}

function assignedUser(name) {
  let index = searchUserIndex(name);
  if (users[index].assigned === false) {
    users[index].assigned = true;
    loadUsers();
    loadAssignedUserIcons();
    assignedUserArr.push(users[index]);
  } else {
    users[index].assigned = false;
    loadUsers();
    loadAssignedUserIcons();
    removeUserFromArray(name);
  }
}

function searchUserIndex(name) {
  for (let index = 0; index < users.length; index++) {
    if (users[index].name == name) {
      return index;
    }
  }
}

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

function removeUserFromArray(name) {
  let arr = [];
  assignedUserArr.forEach((user) => {
    if (user.name != name) {
      arr.push(user);
    }
  });
  assignedUserArr = arr;
}

async function createTaskForm() {
  let validateTask = isTaskDataValid();
  if (!validateTask) return;
  let task = taskObjTemplate(selectedPriority, assignedUserArr, subtask, taskStatus);
  await postData("tasks", task);
}

function runInitIfValid() {
  let validateTask = isTaskDataValid();
  if (!validateTask) return;
  initAddTaskPage();
}

function isTaskDataValid() {
  let isValid = true;
  const formIds = getFormElementsIds();
  const subtaskID = document.getElementById("subtask-id");
  
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

  if (subtask.length === 0) {
  showError(subtaskID, "subtask");
  isValid = false;
  }
  return isValid;
}

function getFormElementsIds() {
  const titelId = document.getElementById("titleInput");
  const dateId = document.getElementById("date");
  const categoryId = document.getElementById("select-category");
  const descriptionId = document.getElementById("description");
  const categoryDropdown = document.getElementById("open-category-dropdown");
  let formIds = {
    title: titelId,
    date: dateId,
    category: {
      span: categoryId,
      dropdown: categoryDropdown,
    },
    description: descriptionId,
  };
  return formIds;
}

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

function clearInputError(target, error) {
  target.classList.remove("light-red-outline");
  target.classList.add("blue-outline");
  error.innerHTML = "";
}

function addErrorClasses(target) {
  target.classList.add("light-red-outline");
  target.classList.remove("blue-outline");
}

function showError(target, name) {
  let error = document.getElementById(`${name}Error`);
  addErrorClasses(target);
  error.innerHTML = "This field is required";
  target.addEventListener("click", () => {
    clearInputError(target, error);
  });
}

function onFocusOut(e) {
  let target = e.target;
  target.classList.remove("light-red-outline");
  target.classList.remove("blue-outline");
}



