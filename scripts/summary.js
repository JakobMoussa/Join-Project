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
  let urgentTask = Object.values(tasks).filter((task) => task.priority === "urgent");
  let sortedTaskObj = urgentTask.sort((a, b) => new Date(a.date) - new Date(b.date));
  let dateString = sortedTaskObj[0].date;
  let dateObj = new Date(dateString);
  let dateFormat = { year: "numeric", month: "long", day: "numeric" };

  taskRef.innerText = urgentTask.length;
  deadlineRef.innerText = dateObj.toLocaleDateString("en-US", dateFormat);
}

async function initSummary() {
  let taskObj = await loadData("tasks/");
  countTasks(taskObj);
}

document.addEventListener("DOMContentLoaded", () => {
  initSummary();
});
