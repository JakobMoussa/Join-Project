function renderBoard(tasks) {
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

function checkForAssignment(assigned) {
  if (assigned) {
    let personHTML = "";
    assigned.forEach((userObj) => {
      let username = createUsernameAbbreviation(userObj);
      personHTML += createPersonTemplate(userObj, username);
    });
    return personHTML;
  } else {
    return "";
  }
}

function createUsernameAbbreviation(user) {
  let usernameArr = user.name.split(" ");
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

function rederSelectedTask() {
  return;
}

async function initBoard() {
  let boardData = await loadData("tasks/");
  console.log(boardData);
  
  renderBoard(boardData);
  addPlaceholdersToEmptyColumns();
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});
