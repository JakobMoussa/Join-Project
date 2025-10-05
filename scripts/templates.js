/**
 * Creates HTML template for a subtask list item in view mode
 * @param {string} task - The subtask text content
 * @param {string|number} id - The unique identifier for the subtask
 * @returns {string} HTML string for the subtask list item
 */
function subListItem(task, id) {
    return `
          <li class="sub-item">
              <span>•</span>
              <input type="text" value="${task}" id="sub-input-${id}" disabled>
              <div class="sub-btn-container">
                  <button type="button" class="sub-btn-edit" onclick="editSubItem(${id}, true)"></button>
                  <div class="divider-vertical"></div>
                  <button type="button" class="sub-btn-delete" onclick="removeSubItem(${id})"></button>
              </div>
          </li>
      `;
  }
  
  /**
   * Creates HTML template for a subtask list item in edit mode
   * @param {string} task - The subtask text content
   * @param {string|number} id - The unique identifier for the subtask
   * @returns {string} HTML string for the editable subtask list item
   */
  function subListItemEdit(task, id) {
    return `
          <li class="sub-item-editing">
              <input type="text" id="sub-input-${id}" value="${task}">
              <div class="sub-btn-container">
                  <button type="button" class="sub-btn-editing-delete" onclick="removeSubItem(${id})"></button>
                  <div class="divider-vertical"></div>
                  <button type="button" class="sub-btn-conf" onclick="editSubItem(${id}, false)"></button>
              </div>
          </li>
      `;
  }
  
  /**
   * Creates HTML template for a user assignment container
   * @param {string} style - CSS class for styling
   * @param {string} initials - User initials for avatar
   * @param {string} [name="XX"] - User name
   * @param {string} [color="red"] - Background color for avatar
   * @returns {string} HTML string for user container
   */
  function singleUserContainer(style, initials, name = "XX", color = "red") {
    return `
          <div class="${style}" onclick="assignedUser('${name}')">
              <div class="user-icon" style="background-color: ${color};">${initials}</div>
              <span class="user-name">${name}</span>
              <button type="button" type="button" class="btn-check"></button>
          </div>
      `;
  }
  
  /**
   * Creates HTML template for a user icon/avatar
   * @param {string} [color="red"] - Background color for avatar
   * @param {string} [initials="xx"] - User initials
   * @param {string} [name="xx"] - User name
   * @returns {string} HTML string for user icon
   */
  function userIcon(color = "red", initials = "xx", name = "xx") {
    return `
          <div class="user-icon" onclick="assignedUser('${name}')" style="background-color: ${color}">${initials}</div>
      `;
  }
  
  /**
   * Creates HTML template for task title input field
   * @param {string} [title=""] - Pre-filled title value
   * @returns {string} HTML string for title input container
   */
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
  
  /**
   * Creates HTML template for task description textarea
   * @param {string} [description=""] - Pre-filled description value
   * @returns {string} HTML string for description container
   */
  function descriptionTaskTpl(description = "") {
    return `
          <div class="task-container">
              <label for="description-input" class="task-name">Description</label>
              <textarea name="" id="description" class="textarea-description">${description}</textarea>
          </div>
      `;
  }
  
  /**
   * Creates HTML template for task due date input field
   * @param {string} [date=""] - Pre-filled date value
   * @returns {string} HTML string for date input container
   */
  function dateTaskTpl(date = "") {
    return `
          <div class="task-container">
              <label for="date" class="task-name">
                  Due date<span class="red-font">*</span>
              </label>
              <input type="date" class="input-task date-field" id="date" value="${date}">
              <span id="dateError" class="error-message"></span>
          </div>
      `;
  }
  
  /**
   * Creates HTML template for task priority selection buttons
   * @returns {string} HTML string for priority selection container
   */
  function prioTaskTpl() {
    return `
          <div class="task-container">
              <span class="task-name">Priority</span>
              <div class="priority-btn-container">
                  <button type="button" class="btn-priority" onclick="activePriority('urgent')" id="urgent">
                      Urgent
                      <div class="urgent-priority-icon" id="urgent-btn-icon"></div>
                  </button>
                  <button type="button" class="btn-priority" onclick="activePriority('medium')" id="medium">
                      Medium
                      <div class="medium-priority-icon" id="medium-btn-icon"></div>
                  </button>
                  <button type="button" class="btn-priority" onclick="activePriority('low')" id="low">
                      Low
                      <div class="low-priority-icon" id="low-btn-icon"></div>
                  </button>
              </div>
          </div>
      `;
  }
  
  /**
   * Creates HTML template for task assignment section
   * @returns {string} HTML string for assignment container
   */
  function assignedTaskTpl() {
    return `
          <div class="task-container" id="task-container">
              <span class="task-name">Assigned to:</span>
              <div class="input-container">
                  <input type="text" id="assignedInputSearch" placeholder="Select contacts to assign"
                      class="input-assaign" onclick="toggleAssignedDropdown()" readonly>
                  <button type="button" class="btn-dropdown" id="assaign-btn" onclick="toggleAssignedDropdown()">
                      <img src="../assets/icons/arrow_drop_down.svg" alt="">
                  </button>
              </div>
              <div class="dropdown">
                  <div class="assigned-dropdown d-none" id="assigned-dropdown" onclick="onclickProtection(event)"></div>
              </div>
              <div class="assigned-icons-container" id="icons-container">
              </div>
          </div>
          <div class="dropdown-overlay d-none" id="assigned-dropdown-overlay" onclick="toggleAssignedDropdown()"></div>
      `;
  }
  
  /**
   * Creates HTML template for task category selection
   * @returns {string} HTML string for category selection container
   */
  function categoryTaskTpl() {
    return `
          <div class="task-container" id="category-container">
              <span class="task-name">
                  Category<span class="red-font">*</span>
              </span>
              <div class="input-container" id="open-category-dropdown" onclick="toggleCategoryDropdown()">
                  <span id="select-category">Select Task category</span>
                  <button type="button" class="btn-dropdown" id="category-btn" onclick="toggleCategoryDropdown()">
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
          <div class="dropdown-overlay d-none" id="category-dropdown-overlay" onclick="toggleCategoryDropdown()"></div>
      `;
  }
  
  /**
   * Creates HTML template for subtasks section
   * @returns {string} HTML string for subtasks container
   */
  function subtaskTpl() {
    return `
          <div class="task-container">
              <span class="task-name">Subtask</span>
              <div class="input-container" id="subtask-id">
                  <input type="text" id="subtask-input" placeholder="Add new subtask" maxlength="25" onkeydown="if(event.key==='Enter'){addSubtask()}">  
                  <button type="button" class="btn-dropdown" id="subtask-btn" onclick="addSubtask()">
                      <img src="../assets/icons/add_blue.svg" alt="">
                  </button>
              </div>
              <span id="subtaskError" class="error-message"></span>
              <div class="sub-container">
                  <ul class="sub-list" id="sub-list"></ul>
              </div>
          </div>
      `;
  }
  
  /**
   * Creates HTML template for task edit overlay
   * @returns {string} HTML string for edit task container
   */
  function editTaskTpl() {
    return `
          <div class="close-edit-conatiner">
              <button class="close-task" onclick="closeOverlay(); resetTaskData()"></button>
          </div>
          <div class="editTask-container"></div>        
      `;
  }
  
  /**
   * Creates HTML template for OK button in edit mode
   * @param {string} taskId - The task identifier
   * @returns {string} HTML string for OK button
   */
  function okBtn(taskId) {
    return `
          <button class="btn-create ok-btn" onclick="saveEditedTask('${taskId}'); resetTaskData()">
              Ok
              <img src="../assets/icons/check.svg" alt="">
          </button>
      `;
  }
  
  /**
   * Creates HTML template for a task card
   * @param {string} id - The task identifier
   * @param {Object} task - The task object containing task data
   * @returns {string} HTML string for task card
   */
  function createTaskTemplate(id, task) {
      const assignedLimited = (task.assigned || []).slice(0, 3);
    return `
      <div class="task draggable" data-id="${id}" id="${id}" draggable="true" 
       ondragstart="dragstartHandler(event, '${id}')" 
       ondragend="dragendHandler(event)" 
       onclick="renderSelectedTask('${id}')">
          <span class="tag ${createCategoryClass(task.category)}">${task.category}</span>
          <h4>${task.title}</h4>
          <p class="task-descr">${task.description}</p>
          ${checkForSubtask(task.subtask)}
          <div class="task-footer" id="task-footer">
              <div>
                ${checkForAssignment(assignedLimited)}
              </div>
              <img src="../assets/icons/prio-${task.priority}.svg" alt="Prio ${task.priority}">
          </div>
      </div>
    `;
  }
  
  /**
   * Creates HTML template for progress wrapper around subtasks
   * @param {Array} subtasks - Array of subtask objects
   * @param {string} numerus - Text label for subtask count
   * @param {Array} subtaskDone - Array of completed subtasks
   * @returns {string} HTML string for progress wrapper
   */
  function createProgressWrapper(subtasks, numerus, subtaskDone) {
    return `
      <div class="progress-wrapper">
        ${progessTemplate(subtasks, numerus, subtaskDone)}
      </div>
    `;
  }
  
  /**
   * Creates HTML template for progress bar and subtask counter
   * @param {Array} subtasks - Array of subtask objects
   * @param {string} numerus - Text label for subtask count
   * @param {Array} subtaskDone - Array of completed subtasks
   * @returns {string} HTML string for progress display
   */
  function progessTemplate(subtasks, numerus, subtaskDone) {
    return `
      <div class="progress-bar">
          <div class="progress" style="width: ${Math.round((subtaskDone.length / subtasks.length) * 100)}%;"></div>
      </div>
      <span class="subtask">${subtaskDone.length}/${subtasks.length} ${numerus}</span>
    `;
  }
  
  /**
   * Creates HTML template for a user avatar
   * @param {Object} userObj - User object containing color and other data
   * @param {string} username - User name for display
   * @returns {string} HTML string for user avatar
   */
  function createPersonTemplate(userObj, username) {
    return `<span class="avatar" style="background: ${userObj.color};" > ${username}</span>`;
  }
  
  /**
   * Creates HTML template for empty task list placeholder
   * @returns {string} HTML string for empty state
   */
  function createTaskPlaceholder() {
    return `<div class="empty">No tasks To do</div>`;
  }
  
  /**
   * Creates HTML template for empty done tasks placeholder
   * @returns {string} HTML string for empty done state
   */
  function createTaskPlaceholderDone() {
    return `<div class="empty">No tasks done</div>`;
  }
  
  // --------------------- Task-Overlay ---------------------------------------
  
  /**
   * Creates HTML template for detailed task view overlay
   * @param {string} taskId - The task identifier
   * @param {Object} task - The task object containing task data
   * @returns {string} HTML string for detailed task overlay
   */
  function createDetailedTaskTemplate(taskId, task) {
    return `
      <div id="overlay-wrapper" class="overlay-wrapper overlay-content transit task-view" onclick="onclickProtection(event)">
          <div class="overlay-header mb-20">
              <span class="tag-overlay ${createCategoryClass(task.category)}">${task.category}</span>
              <button class="btn-transparent" onclick="closeOverlay()">
                  <img src="../assets/icons/close.svg" alt="Close">
              </button>
          </div>
  
          <h1 class="task-title mb-21">${task.title}</h1>
          <p class="task-description mb-25">${task.description}</p>
  
          <div class="flex mb-20">
              <div>
                  <div class="section-title mb-22">Due date:</div>
                  <div class="section-title">Priority:</div>
              </div>
              <div>
                  <div class="mb-23">${task.date}</div>
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
  
  /**
   * Creates HTML template for assigned users section in detail view
   * @param {Object} userObj - User object containing user data
   * @returns {string} HTML string for assigned users section
   */
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
  
  /**
   * Creates HTML template for a single assigned user list item
   * @param {Object} userObj - User object containing user data
   * @param {string} username - User name for display
   * @returns {string} HTML string for assigned user list item
   */
  function createPersonListItem(userObj, username) {
    return `
      <li class="assigned-person mb-14">
          <span class="avatar" style="background: ${userObj.color};">${username}</span>
          <span>${userObj.name}</span>
      </li>
    `;
  }
  
  /**
   * Creates HTML template for subtasks section in detail view
   * @param {string} taskId - The task identifier
   * @param {Array} subtaskArr - Array of subtask objects
   * @returns {string} HTML string for subtasks section
   */
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
  
  /**
   * Creates HTML template for a single subtask list item
   * @param {string} taskId - The task identifier
   * @param {Object} subtaskObj - Subtask object containing subtask data
   * @returns {string} HTML string for subtask list item
   */
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
  
  /**
   * Creates HTML template for user information display in contact overlay
   * @param {string} id - The user identifier
   * @param {Object} user - The user object containing user data
   * @returns {string} HTML string for user information display
   */
  function renderUserInfo(id, user) {
      const editContainer = document.querySelector(".edit-delete-container");
      editContainer.innerHTML = responsiveEditMenu(id);
      return `
          <div class="user-details" onclick="event.stopPropagation()">
              <div class="user-name-container">
                  <div class="avatar-circle" style="background-color: ${user.color};">${user.avatar}
                  </div>
                  <div class="user-name">
                      <h3>${user.name}</h3>
                      <div class="edit-delete-buttons">
                          <button class="edit-field" id="" onclick="editContactById('${id}')">
                              <img src="../assets/icons/edit.svg" alt="Edit icon" class="edit-icon">Edit
                          </button>
                          <button class="edit-field" onclick="deleteUser('users/${id}')">
                              <img src="../assets/icons/delete.svg" alt="Delete icon" class="delete-icon">
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
  
  /**
   * Creates HTML template for responsive edit menu (mobile)
   * @param {string} id - The user identifier
   * @returns {string} HTML string for responsive edit menu
   */
  function responsiveEditMenu(id) {
      return `
          <button class="open-edit-delete" onclick="opencEditMenu()"></button>
          <div class="mobile-edit-delete" hidden onclick="closeEditMenu()">
              <div class="user-edit-container">
                  <button id="" onclick="editContactById('${id}')">
                      <img src="../assets/icons/edit.svg" alt="Edit icon">Edit
                  </button>
                  <button onclick="deleteUser('users/${id}'); closeEditMenu(); hideContacts()">
                      <img src="../assets/icons/delete.svg" alt="Delete icon">
                      Delete
                  </button>
              </div>
          </div>
      `
  }
  
  /**
   * Creates a contact element DOM node
   * @param {Object} user - The user object containing user data
   * @param {string} id - The user identifier
   * @returns {HTMLElement} DOM element for contact
   */
  function createContactElement(user, id) {
      const div = document.createElement("div");
      div.classList.add("contact");
      div.addEventListener("click", (event) => {
          openUserInfos(id);
          toggleContactBg(event);      
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
  
  /**
   * Creates HTML template for navigation link
   * @param {string} icon - Icon name for the navigation link
   * @param {string} link - URL for the navigation link
   * @param {string} section - Display text for the navigation section
   * @returns {string} HTML string for navigation link
   */
  function navLink(icon, link, section) {
      return `
            <li class="nav-link">
                <div class="img-wrapper">
                    <img src="../assets/icons/${icon}.svg" alt="">
                </div>
              
                <a href="signup.html" data-task="navLink">${section}</a>
            </li>
             <div class="wrapper-link-bottom">
                      <a href="../html-templates/privacy-policy.html?msg=privacy">
                          <span class="wrapper-link-one">Privacy Policy</span>
                      </a>
                      <a href="../html-templates/privacy-policy.html?msg=privacy">
                          <span class="wrapper-link-two">Legal Notice</span>
                      </a> 
              </div>
        `;
    }
  
  /**
   * Creates HTML template for contact edit overlay
   * @param {Object} user - The user object containing user data
   * @returns {void}
   */
  function editContactOverlay(user) {
    const overlay = document.getElementById("overlay");
    overlay.innerHTML = `
      <div id="overlay-wrapper" class="overlay-wrapper transit" onclick="onclickProtection(event)">
          <div class="modal"> 
              <div class="modal-left">
                  <div class="modal-left-close">
                      <button onclick="closeOverlay()" class="close-task-white"></button>
                  </div>
                  <img class="contact-logo" src="../assets/icons/join-dark.svg" alt="join-logo">
                  <h2>Edit contact</h2>
                  <div class="underline"></div>
              </div>
              <div class="modal-right">
                  <button onclick="closeOverlay()" class="close-task"></button>
                  <form class="contact-container" novalidate>
                      <div class="avatar-container">
                          <div class="avatar-circle" id="avatar-edit" style="background-color: #9327FF;">AM</div>
                      </div>
                      <div class="contact-form">
                          <div class="input-group">
                              <input type="text" id="contact-name" placeholder="Name" value="${user.name}" required >
                              <img class="person-icon" src="../assets/icons/person.svg">
                              <p class="error-signup" data-field="errorName"></p>
                          </div>
                          <div class="input-group">
                              <input type="email" id="contact-email" placeholder="Email" value="${user.email}" required >
                              <img class="email-icon" src="../assets/icons/mail.svg">
                              <p class="error-signup" data-field="errorEmail"></p>
                          </div>
                          <div class="input-group">
                              <input type="tel" id="contact-phone" placeholder="Phone" value="${user.phone}" required >
                              <img class="phone-icon" src="../assets/icons/call.svg">
                              <p class="error-signup" data-field="errorEmail"></p>
                          </div>
                          <div class="buttons">
                              <button type="button" class="cancel" onclick="closeOverlay()">Delete</button>
                              <button type="submit" class="create">Save
                                  <img src="../assets/icons/check.svg" alt="check-icon" class="check-icon" />
                              </button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    `;
  }
  
  /**
   * Creates HTML template for add contact overlay
   * @returns {string} HTML string for add contact overlay
   */
  function getContactOverlayTemplate() {
      return `
        <div id="overlay-wrapper" class="overlay-wrapper transit" onclick="onclickProtection(event)">
            <div class="modal"> 
                <div class="modal-left">
                     <div class="modal-left-close">
                        <button onclick="closeOverlay()" class="close-task-white"></button>
                    </div>
                    <img class="contact-logo" src="../assets/icons/join-dark.svg" alt="join-logo">
                    <h2>Add contact</h2>
                    <div class="underline"></div>
                </div>
                <div class="modal-right">
                    <button onclick="closeOverlay()" class="close-task"></button>
                    <form class="contact-container" novalidate>
                        <div class="avatar-container">
                            <img src="../assets/icons/Group 13.svg">
                        </div>
                        <div class="contact-form">
                            <div class="input-group">
                                <input type="text" id="contact-name" placeholder="Name" maxlength="15" required />
                                <img class="person-icon" src="../assets/icons/person.svg">
                                <p class="error-signup" data-field="errorName"></p>
                            </div>
                            <div class="input-group">
                                <input type="email" id="contact-email" placeholder="Email" maxlength="23" required />
                                <img class="email-icon" src="../assets/icons/mail.svg">
                                <p class="error-signup" data-field="errorEmail"></p>
                            </div>
                            <!-- Phone -->
                            <div class="input-group">
                                <input type="tel" id="contact-phone" placeholder="Phone" maxlength="12" pattern="[0-9]*" oninput="this.value = this.value.replace(/\D/g, '')" required />
                                <img class="phone-icon" src="../assets/icons/call.svg">
                                 <p class="error-signup" data-field="errorPhone"></p>
                            </div>
                            <div class="buttons">
                                <button type="button" class="cancel" onclick="closeOverlay()">Cancel</button>
                                <button type="submit" class="create">Create contact
                                    <img src="../assets/icons/check.svg" alt="check-icon" class="check-icon" />
                                </button>
                            </div>
                         </div>
                    </form>
                </div>
            </div>
        </div>
      `;
    }
