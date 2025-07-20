function subListItem(task, id) {
  return `
        <li class="sub-item">
            <span>•</span>
            <input type="text" value="${task}" id="sub-input-${id}" disabled>
            <div class="sub-btn-container">
                <button class="sub-btn-edit" onclick="editSubItem(${id}, true)"></button>
                <div class="divider-vertical"></div>
                <button class="sub-btn-delete" onclick="removeSubItem(${id})"></button>
            </div>
        </li>
    `;
}

function subListItemEdit(task, id) {
  return `
        <li class="sub-item-editing">
            <input type="text" id="sub-input-${id}" value="${task}">
            <div class="sub-btn-container">
                <button class="sub-btn-editing-delete" onclick="removeSubItem(${id})"></button>
                <div class="divider-vertical"></div>
                <button class="sub-btn-conf" onclick="editSubItem(${id}, false)"></button>
            </div>
        </li>
    `;
}

function singleUserContainer(style, initials, name = "XX", color = "red") {
  return `
        <div class="${style}" onclick="assignedUser('${name}')">
            <div class="user-icon" style="background-color: ${color};">${initials}</div>
            <span class="user-name">${name}</span>
            <button class="btn-check"></button>
        </div>
    `;
}

function userIcon(color = "red", initials = "xx", name = "xx") {
  return `
        <div class="user-icon" onclick="assignedUser('${name}')" style="background-color: ${color}">${initials}</div>
    `;
}

function titleTaskTpl(title = "") {
  return `
        <div class="task-container">
            <label for="titleInput" class="task-name">
                Title<span class="red-font">*</span>
            </label>
            <input type="text" class="input-task" id="titleInput" placeholder="Enter a title" value="${title}">
            <span id="titleError" class="error-message"></span>
        </div>
    `;
}

function descriptionTaskTpl(description = "") {
  return `
        <div class="task-container">
            <label for="description-input" class="task-name">Description</label>
            <textarea name="" id="description" class="textarea-description">${description}</textarea>
        </div>
    `;
}

function dateTaskTpl(date = "") {
  return `
        <div class="task-container">
            <label for="date" class="task-name">
                Due date<span class="red-font">*</span>
            </label>
            <input type="date" class="input-task" id="date" value="${date}">
            <span id="dateError" class="error-message"></span>
        </div>
    `;
}

function prioTaskTpl() {
  return `
        <div class="task-container">
            <span class="task-name">Priority</span>
            <div class="priority-btn-container">
                <button class="btn-priority" onclick="activePriority('urgent')" id="urgent">
                    Urgent
                    <div class="urgent-priority-icon" id="urgent-btn-icon"></div>
                </button>
                <button class="btn-priority" onclick="activePriority('medium')" id="medium">
                    Medium
                    <div class="medium-priority-icon" id="medium-btn-icon"></div>
                </button>
                <button class="btn-priority" onclick="activePriority('low')" id="low">
                    Low
                    <div class="low-priority-icon" id="low-btn-icon"></div>
                </button>
            </div>
        </div>
    `;
}

function assignedTaskTpl() {
  return `
        <div class="task-container">
            <span class="task-name">Assigned to:</span>
            <div class="dropdown-container">
                <input type="text" id="assignedInputSearch" placeholder="Select contacts to assign"
                    class="input-assaign">
                <button class="btn-dropdown" id="assaign-btn" onclick="toggleAssignedDropdown()">
                    <img src="../assets/icons/arrow_drop_down.svg" alt="">
                </button>
            </div>
            <div class="dropdown">
                <div class="assigned-dropdown d-none" id="assigned-dropdown">
                </div>
            </div>
            <div class="assigned-icons-container" id="icons-container">
            </div>
        </div>
    `;
}

function categoryTaskTpl() {
  return `
        <div class="task-container" id = "category-container">
            <span class="task-name">
                Category<span class="red-font">*</span>
            </span>
            <div class="dropdown-container" onclick="toggleCategoryDropdown()"
                id="open-category-dropdown">
                <span id="select-category">Select Task category</span>
                <button class="btn-dropdown" id="category-btn">
                    <img src="../assets/icons/arrow_drop_down.svg" alt="">
                </button>
            </div>
            <div class="dropdown">
                <div class="category-dropdown d-none" id="category-dropdown">
                    <div class="single-user-container" onclick="selectCategory(event)">
                        <span class="user-name">Technical Task</span>
                    </div>
                    <div class="single-user-container" onclick="selectCategory(event)">
                        <span class="user-name">User Story</span>
                    </div>
                </div>
            </div>
            <span id="categoryError" class="error-message"></span>
        </div>
        `;
}

function subtaskTpl() {
  return `
        <div class="task-container">
            <span class="task-name">Subtask</span>
            <div class="dropdown-container">
                <input type="text" id="subtask-input" placeholder="Add new subtask" maxlength="32">
                <button class="btn-dropdown" id="subtask-btn" onclick="addSubtask()">
                    <img src="../assets/icons/add_blue.svg" alt="">
                </button>
            </div>
            <div class="sub-container">
                <ul class="sub-list" id="sub-list">
                </ul>
            </div>
        </div>
        `;
}

function createTaskTemplate(id, task) {
  return `
    <div class="task" onclick="renderSelectedTask('${id}')">
        <span class="tag ${createCategoryClass(task.category)}">${task.category}</span>
        <h4>${task.title}</h4>
        <p class="task-descr">${task.description}</p>
        ${checkForSubtask(task.subtask)}
        <div class="task-footer">
            <div>
              ${checkForAssignment(task.assigned)}
            </div>
            <img src="../assets/icons/prio-${task.priority}.svg" alt="Prio ${task.priority}">
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

function createPersonTemplate(userObj, username) {
  return `<span class="avatar" style = "background: ${userObj.color};" > ${username}</span> `;
}

function createTaskPlaceholder() {
  return `<div class="empty" > No tasks To do</div> `;
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

function createDetailedTaskTemplate(taskId, task) {
  return `
    <div id="overlay-wrapper" class="overlay-wrapper transit" onclick="onclickProtection(event)">
        <div class="overlay-header mb-20">
            <span class="tag-overlay ${createCategoryClass(task.category)}">${task.category}</span>
            <button onclick="closeOverlay()">
                <img src="../assets/icons/close.svg" alt="Close">
            </button>
        </div>

        <h1 class="mb-20">${task.title}</h1>
        <p class="mb-20">${task.description}</p>

        <div class="flex mb-20">
            <div>
                <div class="section-title mb-20">Due date:</div>
                <div class="section-title">Priority:</div>
            </div>
            <div>
                <div class="mb-20">${task.date}</div>
                <div class="overlay-prio"><span>${task.priority}</span><img src="../assets/icons/prio-${task.priority}.svg"
                        alt="Prio ${task.priority}">
                </div>
            </div>
        </div>

        ${checkForAssignmentDetailView(task.assigned)}

        ${checkForSubtasksDetailView(taskId, task.subtask)}

        <div class="overlay-footer">
            <button class="overlay-delete" onclick="deleteTask('tasks/${taskId}')">
                <img src="../assets/icons/delete.svg" alt="Delete">
                <span>Delete</span>
            </button>
            <span class="overlay-devider"></span>
            <button class="overlay-edit">
                <img src="../assets/icons/edit.svg" alt="Edit">
                <span>Edit</span>
            </button>
        </div>
    </div>
  `;
}

// -----------------------------------------------------------------------

function createPersonTemplateDetailView(userObj) {
  return `
    <div>
        <div class="section-title mb-14">Assigned to:</div>
        <ul class="assigned-list mb-20">
            ${createPersonList(userObj)}
        </ul>
    </div>
  `;
}

function createPersonListItem(userObj, username) {
  return `
    <li class="assigned-person mb-14">
        <span class="avatar" style="background: ${userObj.color};">${username}</span>
        <span>${userObj.name}</span>
    </li>
  `;
}

// -----------------------------------------------------------------------

function createSubtaskTemplate(taskId, subtaskArr) {
  return `
    <div>
        <div class="section-title mb-14">Subtasks</div>
        <ul class="subtasks mb-20">
            ${createSubtaskList(taskId, subtaskArr)}
        </ul>
    </div>
  `;
}

function createSubtaskListItem(taskId, subtaskObj) {
  const checkedClass = subtaskObj.edit ? " checked" : "";
  return `
    <li class="subtask-item mb-14" data-id="${subtaskObj.id}">
      <button class="btn-subtask ${checkedClass}" data-id="${subtaskObj.id}" onclick="checkInOutSubtask('${taskId}', '${subtaskObj.id}')"></button>
      <label>${subtaskObj.value}</label>
    </li>
  `;
}
