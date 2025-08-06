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
            <div class="input-container">
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
            <div class="input-container" onclick="toggleCategoryDropdown()"
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
            <div class="input-container">
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

function editTaskTpl() {
    return `
        <div class="close-edit-conatiner">
            <button class="close-task" onclick="closeOverlay(); resetTaskData()"></button>
        </div>
        <div class="editTask-container"></div>        
    `;
}

function okBtn(taskId) {
    return `
        <button class="btn-create" onclick="saveEditedTask('${taskId}'); resetTaskData()">
            Ok
            <img src="../assets/icons/check.svg" alt="">
        </button>
    `;
}

function createTaskTemplate(id, task) {
    return `
    <div class="task draggable" data-id="${id}" id="${id}" draggable="true" 
     ondragstart="dragstartHandler(event, '${id}')" 
     ondragend="dragendHandler(event)" 
     onclick="renderSelectedTask('${id}')">
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

function createProgressWrapper(subtasks, numerus, subtaskDone) {
    return `
    <div class="progress-wrapper">
      ${progessTemplate(subtasks, numerus, subtaskDone)}
    </div>
  `;
}

function progessTemplate(subtasks, numerus, subtaskDone) {
    return `
    <div class="progress-bar">
        <div class="progress" style="width: ${Math.round((subtaskDone.length / subtasks.length) * 100)}%;"></div>
    </div>
    <span class="subtask">${subtaskDone.length}/${subtasks.length} ${numerus}</span>
  `;
}

function createPersonTemplate(userObj, username) {
    return `<span class="avatar" style="background: ${userObj.color};" > ${username}</span>`;
}

function createTaskPlaceholder() {
    return `<div class="empty">No tasks To do</div>`;
}

function createTaskPlaceholderDone() {
    return `<div class="empty">No tasks done</div>`;
}

// --------------------- Task-Overlay ---------------------------------------

function createDetailedTaskTemplate(taskId, task) {
    return `
    <div id="overlay-wrapper" class="overlay-wrapper overlay-content transit" onclick="onclickProtection(event)">
        <div class="overlay-header mb-20">
            <span class="tag-overlay ${createCategoryClass(task.category)}">${task.category}</span>
            <button class="btn-transparent" onclick="closeOverlay()">
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
                <div class="overlay-prio">
                    <span class="capitalize">${task.priority}</span>
                    <img src="../assets/icons/prio-${task.priority}.svg" alt="Prio ${task.priority}">
                </div>
            </div>
        </div>

        ${checkForAssignmentDetailView(task.assigned)}

        ${checkForSubtasksDetailView(taskId, task.subtask)}

        <div class="overlay-footer">
            <button class="overlay-delete btn-transparent" onclick="deleteTask('tasks/${taskId}')">
                <img src="../assets/icons/delete.svg" alt="Delete">
                <span>Delete</span>
            </button>
            <span class="overlay-devider"></span>
            <button class="overlay-edit btn-transparent" onclick="editTask('${taskId}')">
                <img src="../assets/icons/edit.svg" alt="Edit">
                <span>Edit</span>
            </button>
        </div>
    </div>
  `;
}

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
      <button class="btn-subtask btn-transparent ${checkedClass}" data-id="${subtaskObj.id}" onclick="checkInOutSubtask('${taskId}', '${subtaskObj.id}')"></button>
      <label>${subtaskObj.value}</label>
    </li>
  `;
}

// --------------------- Contact-Overlay ---------------------------------------

function getContactOverlayTemplate() {
  return `
    <div id="overlay-wrapper" class="overlay overlay-wrapper transit" onclick="onclickProtection(event)">
        <div class="modal"> 
            <div class="modal-left">
                <img class="contact-logo" src="../assets/icons/join-dark.svg" alt="join-logo">
                <h2>Add contact</h2>
                <p>Tasks are better with a team!</p>
                <div class="underline"></div>
            </div>
            <div class="modal-right">
                <button onclick="closeOverlay()" class="close-btn">&times;</button>
                <img class="avatar-placeholder" src="../assets/icons/Group 13.svg">
                <form class="contact-form">
                    <div class="input-group">
                        <input type="text" id="contact-name" placeholder="Name" required />
                        <img class="person-icon" src="../assets/icons/person.svg">
                    </div>
                    <div class="input-group">
                        <input type="email" id="contact-email" placeholder="Email" required />
                        <img class="email-icon" src="../assets/icons/mail.svg">
                    </div>
                    <div class="input-group">
                        <input type="tel" id="contact-phone" placeholder="Phone" required />
                        <img class="phone-icon" src="../assets/icons/call.svg">
                    </div>
                    <div class="buttons">
                        <button type="button" class="cancel" onclick="closeOverlay()">Cancel X</button>
                        <button type="submit" class="create">Create contact
                            <img src="/assets/icons/check.svg" alt="check-icon" class="check-icon" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `;
}

function renderUserInfo(id, user) {
    return `
        <div class="user-details" onclick="event.stopPropagation()">
            <div class="user-name-container">
                <div class="avatar-circle" style="background-color: ${user.color};">${user.avatar}
                </div>
                <div class="user-name">
                    <h3>${user.name}</h3>
                    <div class="edit-delete-buttons">
                        <button class="edit-field" id="">
                            <img src="/assets/icons/edit.svg" alt="Edit icon" class="edit-icon">Edit
                        </button>
                        <button class="edit-field" onclick="">
                            <img src="/assets/icons/delete.svg" alt="Delete icon" class="delete-icon">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            <p class="information-field">Contact Information</p>
            <div class="users-field">
                <p class="ptage">Email</p>
                <p class="user-email">${user.email}</p>
                <p class="ptage">Phone</p>
                <p>${user.phone}</p>
            </div>
        </div>
    `;
}

function createContactElement(user, id) {
    const div = document.createElement("div");
    div.classList.add("contact");
    div.addEventListener("click", () => {
        openUserInfos(`${id}`);
    });
    div.innerHTML = `
        <div class="avatar" style="background-color: ${user.color};">${user.avatar || user.Avatar}</div>
        <div class="info">
            <div class="name">${user.name}</div>
            <div class="email">${user.email}</div>
        </div>
    `;
    return div;
}

function navLink(icon, link, section) {
    return `
        <li class="nav-link">
            <div class="img-wrapper">
                <img src="../assets/icons/${icon}.svg" alt="">
            </div>
            <a href="${link}" data-task="navLink">${section}</a>
        </li>
    `;
}

function editContactOverlay(user) {
  const overlay = document.getElementById("edit-overlay");

  overlay.innerHTML = `
    <div id="overlay-wrapper" class="overlay-wrapper transit" onclick="onclickProtection(event)">
        <div class="modal"> 
            <div class="modal-left">
                <img class="contact-logo" src="../assets/icons/join-dark.svg" alt="join-logo">
                <h2>Edit contact</h2>
                <div class="underline"></div>
            </div>
            <div class="modal-right">
                <button onclick="closeOverlay()" class="close-btn">&times;</button>
                <img class="avatar-placeholder" src="../assets/icons/Group 13.svg">
                <form class="contact-form">
                    <div class="input-group">
                        <input type="text" id="contact-name" placeholder="Name" value="${user.name}" required />
                        <img class="person-icon" src="../assets/icons/person.svg">
                    </div>
                    <div class="input-group">
                        <input type="email" id="contact-email" placeholder="Email" value="${user.email}" required />
                        <img class="email-icon" src="../assets/icons/mail.svg">
                    </div>
                    <div class="input-group">
                        <input type="tel" id="contact-phone" placeholder="Phone" value="${user.phone}" required />
                        <img class="phone-icon" src="../assets/icons/call.svg">
                    </div>
                    <div class="buttons">
                        <button type="button" class="cancel" onclick="closeOverlay()">Cancel</button>
                        <button type="submit" class="create">Save changes
                            <img src="/assets/icons/check.svg" alt="check-icon" class="check-icon" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `;

  openOverlay();
  initEditForm(user);
}


