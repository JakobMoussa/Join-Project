function countTasks(tasks) {
  const taskTodoRef = document.querySelector("[data-task='to-do']");
  const taskDoneRef = document.querySelector("[data-task='done']");
  const taskUrgentRef = document.querySelector("[data-task='urgent']");
  const taskDeadlineRef = document.querySelector("[data-task='task-deadline']");
  const totalTasksRef = document.querySelector("[data-task='total-tasks']");
  const taskProgressRef = document.querySelector("[data-task='in-progress']");
  const taskFeddbackRef = document.querySelector("[data-task='await-feedback']");

  taskTodoRef.innerText = Object.values(tasks).filter((task) => task.status === taskTodoRef.dataset.task).length;
  taskDoneRef.innerText = Object.values(tasks).filter((task) => task.status === taskDoneRef.dataset.task).length;
  checkForUrgentTasks(tasks, taskUrgentRef, taskDeadlineRef);
  totalTasksRef.innerText = Object.values(tasks).length;
  taskProgressRef.innerText = Object.values(tasks).filter((task) => task.status === taskProgressRef.dataset.task).length;
  taskFeddbackRef.innerText = Object.values(tasks).filter((task) => task.status === taskFeddbackRef.dataset.task).length;
}

function checkForUrgentTasks(tasks, taskRef, deadlineRef) {
  let urgentTask = Object.values(tasks).filter((task) => task.priority === "urgent" && task.status !== "done");
  let sortedTaskObj = urgentTask.sort((a, b) => new Date(a.date) - new Date(b.date));
  let dateFormat = { year: "numeric", month: "long", day: "numeric" };

  taskRef.innerText = urgentTask.length;

  if (sortedTaskObj.length > 0 && sortedTaskObj[0].date) {
    let dateObj = new Date(sortedTaskObj[0].date);
    deadlineRef.innerText = dateObj.toLocaleDateString("en-US", dateFormat);
  } else {
    deadlineRef.innerText = "-";
  }
}

async function initSummary() {
  let taskObj = await loadData("tasks/");
  countTasks(taskObj);
  renderGreeting();
}

function renderGreeting() {
  const name = loadUrlParams();
  if (name == "Guest") return
  const container = document.querySelector(".greeting")
  let greetings = document.createElement("h2");
  let nameTag = document.createElement("p");
  greetings.innerHTML = "Good morning," 
  nameTag.innerHTML = name;  
  container.innerHTML = "";
  container.appendChild(greetings);
  container.appendChild(nameTag);
}

document.addEventListener("DOMContentLoaded", () => {
  initSummary();
});
