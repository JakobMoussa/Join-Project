let subtask = [];

let users = [
  {
    "name": "Anton Mayer",
    "email": "antom@gmail.com",
    "color": "#FF7A00",
    "assigned": false
  },
  {
    "name": "Anja Schulz",
    "email": "schulz@hotmail.com",
    "color": "#9327FF",
    "assigned": false
  },
  {
    "name": "Benedikt Ziegler",
    "email": "benedikt@gmail.com",
    "color": "#6E52FF",
    "assigned": false
  },
  {
    "name": "David Eisenberg",
    "email": "davidberg@gmail.com",
    "color": "#FC71FF",
    "assigned": false
  },
  {
    "name": "Eva Fischer",
    "email": "eva@gmail.com",
    "color": "#FFBB2B",
    "assigned": false
  },
  {
    "name": "Emmanuel Mauer",
    "email": "emmanuelma@gmail.com",
    "color": "#1FD7C1",
    "assigned": false
  }
];

let test = [];

async function init() {
  let usersObj = await loadData("users");
  for (const key in usersObj) {
    test.push(usersObj[key]);   
  }
}

function createSubObj(id, value) {
  return {
    "id": id,
    "value": value,
    "edit": false
  };
}

function preventFromSubmit(event) {
  event.preventDefault();
}

function toggleCategoryDropdown() {
  const categoryDropdown = document.getElementById('category-dropdown');
  const btn = document.getElementById('category-btn');
  const categoryContainer = document.getElementById('category-container');
  categoryDropdown.classList.toggle('d-none');
  btn.classList.toggle('rotate-180deg');
  categoryContainer.classList.toggle('boxshadow');
}

function activePriority(index) {
  const priorities = ["urgent", "medium", "low"];
  priorities.forEach((priority) => {
    const btn = document.getElementById(priority);
    const icon = document.getElementById(`${priority}-btn-icon`);
    priority == priorities[index] ? prioBtnActive(btn, icon, priority) : prioBtnOff(btn, icon, priority);
  });
}

function prioBtnActive(btn, icon, priority) {
  btn.classList.add(`active-${priority}-btn`);
  icon.classList.add(`active-${priority}-icon`);
}

function prioBtnOff(btn, icon, priority) {
  btn.classList.remove(`active-${priority}-btn`);
  icon.classList.remove(`active-${priority}-icon`);
}

function addSubtask() {
  const inputElement = document.getElementById('subtask-input');
  const subList = document.getElementById('sub-list');
  if (inputElement.value.length == 0) return;
  let id = getNextFreeId();
  subtask.push(createSubObj(id, inputElement.value));
  subList.innerHTML += subListItem(inputElement.value, id);
  inputElement.value = "";
}

function getNextFreeId() {
  let i = 0;
  while (subtask.some(item => item.id === i)) {
    i++;
  }
  return i;
}

function removeSubItem(value) {
  const newArr = subtask.filter(element => element.id != value);
  subtask = newArr;
  reloadSubTask();
}

function reloadSubTask() {
  const subList = document.getElementById('sub-list');
  subList.innerHTML = "";
  subtask.forEach((element) => {
    if (element.edit == false) {
      subList.innerHTML += subListItem(element.value, element.id);
    } else {
      subList.innerHTML += subListItemEdit(element.value, element.id);
    };
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
      break
    }
  }
  reloadSubTask();
}

function selectCategory(e) {
  const selectCategory = document.getElementById('select-category');
  selectCategory.innerHTML = e.target.innerHTML;
  toggleCategoryDropdown()
}

function toggleAssignedDropdown() {
  const assignedDropdown = document.getElementById('assigned-dropdown');
  const btn = document.getElementById('assaign-btn');
  loadUsers();
  assignedDropdown.classList.toggle('d-none');
  btn.classList.toggle('rotate-180deg');
}

function loadUsers() {
  const assignedDropdown = document.getElementById('assigned-dropdown');
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
  initials += array[0].charAt(0) + array[1].charAt(0);
  return initials
}

function assignedUser(name) {
  let index = searchUserIndex(name);
  if (users[index].assigned === false) {
    users[index].assigned = true;
    loadUsers();
    loadAssignedUserIcons();
  } else {
    users[index].assigned = false;
    loadUsers();
    loadAssignedUserIcons();
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
  const container = document.getElementById('icons-container');
  container.innerHTML = "";
  users.forEach((user) => {
    if (user.assigned) {
      let initials = initialsFromName(user.name);
      container.innerHTML += userIcon(user.color, initials, user.name);
    }
  })
}

function createTask(titel, description, date, priority, category, status) {
  return {
    "title": titel,
    "description": description,
    "date": date,
    "priority": priority,
    "assigned": [],
    "category": category,
    "status": status
  }
}