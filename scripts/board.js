function renderBoardddd(tasks) {
  let column = document.querySelectorAll(".column");
  // column.forEach((x) => {
  //   if (x.classList.contains("to-do")) {
  //     console.log(x.classList.contains("to-do"));
  //   }
  // });

  // remove placeholde element if there is any
  let emptyPlaceholder = column[0].querySelectorAll(".empty");
  if (emptyPlaceholder.length > 0) {
    emptyPlaceholder[0].classList.add("hidden");
  }
  // add tasks to column
  column[0].appendChild;
}

//  ------------------------------------------
//  ------------------------------------------
//  ------------------------------------------

function renderBoard(tasks) {
  for (let task in tasks) {
    let column = document.querySelector(`.column[data-task="${tasks[task].status}"]`);
    if (column) {
      let taskTemplate = createTaskTemplate(task, tasks[task], tasks[task].substasks);
      column.innerHTML += taskTemplate;
    }
  }
}

function createCategoryClass(category) {
  // from e.g. "Technical Task" to "technical-class" for CSS class
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
      personHTML += createPersonTemplate(username);
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

function rederSelectedTask() {
  console.log("henlo");
}

async function initBoard() {
  let boardData = await loadData("tasks/");
  renderBoard(boardData);
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});
