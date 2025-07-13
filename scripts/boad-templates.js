function createTaskTemplate(key, values) {
  return `
    <div class="task" onclick="openOverlay('${key}')">
        <span class="tag ${createCategoryClass(values.category)}">${values.category}</span>
        <h4>${values.title}</h4>
        <p class="task-descr">${values.description}</p>
        ${checkForSubtask(values.subtask)}
        <div class="task-footer">
            <div>
              ${checkForAssignment(values.assigned)}
            </div>
            <img src="../assets/icons/prio-mid.svg" alt="Prio medium">
        </div>
    </div>
  `;
}

function createProgressTemplate(subtasks, numerus, subtaskDone) {
  return `
    <div class="progress-wrapper">
        <div class="progress-bar">
            <div class="progress" style="width: ${Math.round((subtaskDone.length / subtasks.length) * 100)}%;"></div>
        </div>
        <span class="subtask">${subtaskDone.length}/${subtasks.length} ${numerus}</span>
    </div>
  `;
}

<<<<<<< HEAD
function createPersonTemplate(username) {
  return `<span class="avatar">${username}</span>`;
}
=======
function createPersonTemplate(userObj, username) {
  return `<span class="avatar" style="background: ${userObj.color};">${username}</span>`;
}
>>>>>>> c8caca961755ab40cfd200d93b89f57c13db19fa
