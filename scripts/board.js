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

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

async function renderSelectedTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);

  overlayRef.innerHTML = "";
  overlayRef.innerHTML += createDetailedTaskTemplate(taskId, task);
  openOverlay();
}

// -----------------------------------------------------------------------

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

// -----------------------------------------------------------------------

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

// -----------------------------------------------------------------------

async function deleteTask(path) {
  await deleteData(path);
  closeOverlay();
  initBoard();
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

async function initBoard() {
  let boardData = await loadData("tasks/");
  renderBoard(boardData);
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});
