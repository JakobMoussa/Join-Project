/**
 * Checks if email already exists in database
 * @async
 * @param {HTMLInputElement} email - Email input element
 * @returns {Promise<boolean>} True if email exists
 */
async function userExists(email) {
    let users = await loadData("/users")
    let validate = Object.values(users || {}).some(user => user.email === email.value);
    if (validate) {
        const error = document.querySelector('[data-field="errorEmail"]');
        error.innerHTML = "email already exist";
        email.style.border = "1px solid #ff8190";
    } else {
        email.style.border = "1px solid #ccc";
    }
    return validate;
}

/**
 * Shows error message for form field
 * @param {string} fieldName - Field name
 * @param {string} message - Error message
 * @returns {void}
 */
function showError(fieldName, message) {
    const errorElement = document.querySelector(`p[data-field="error${fieldName}"]`);
    const inputElement = document.getElementById(`contact-${fieldName.toLowerCase()}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.color = "red";
        errorElement.style.display = "block";
        inputElement.style.border = "1px solid red";
    }
}

/**
 * Hides error message for form field
 * @param {string} fieldName - Field name
 * @returns {void}
 */
function hideError(fieldName) {
    const errorElement = document.querySelector(`p[data-field="error${fieldName}"]`);
    const inputElement = document.getElementById(`contact-${fieldName.toLowerCase()}`);
    
    if (errorElement && inputElement) {
        errorElement.textContent = "";
        inputElement.style.border = "1px solid #ccc";
    }
}

/**
 * Validates all contact form fields
 * @returns {boolean} True if valid
 */
function validateContactForm() {
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    let isValid = true;
    
    if (!name) {
        showError("Name", "This field is required");
        isValid = false;
    } else hideError("Name");
    
    if (!email) {
        showError("Email", "This field is required");
        isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
        showError("Email", "Please enter a valid email address");
        isValid = false;
    } else hideError("Email");

    if (!phone) {
        showError("Phone", "This field is required");
        isValid = false;
    } else if (!/^\d{9,}$/.test(phone)) {
        showError("Phone", "Enter the available number");
        isValid = false;
    } else hideError("Phone");
    
    return isValid;
}

/**
 * Checks if email duplicate check should be performed
 * @async
 * @param {boolean} isEdit - Edit mode flag
 * @param {Object} userObj - User object
 * @returns {Promise<boolean>} True if should check
 */
async function shouldCheckEmailDuplicate(isEdit, userObj) {
    if (!isEdit) return true;
    const currentEmail = document.getElementById("contact-email").value.trim();
    return currentEmail !== userObj?.email;
}

/**
 * Creates new contact from form data
 * @async
 * @returns {Promise<void>}
 */
async function createContact() {
    const newUser = createUser(
        document.getElementById("contact-name").value.trim(),
        document.getElementById("contact-email").value.trim(),
        document.getElementById("contact-phone").value.trim()
    );
    await postData(`users`, newUser);
}

/**
 * Updates existing contact
 * @async
 * @param {string} userId - User identifier
 * @param {Object} userObj - User object
 * @returns {Promise<void>}
 */
async function updateContact(userId, userObj) {
    const updateUser = createUser(
        document.getElementById("contact-name").value.trim(),
        document.getElementById("contact-email").value.trim(),
        document.getElementById("contact-phone").value.trim(),
        userObj.color,
        userObj.assigned,
        userObj.password
    );
    await putData(`users/${userId}`, updateUser);
    openUserInfos(userId);
}

/**
 * Initializes form validation and submit handling
 * @param {boolean} isEdit - Edit mode flag
 * @param {string} userId - User identifier
 * @param {Object} userObj - User object
 * @returns {void}
 */
function initContactFormValidation(isEdit = false, userId = null, userObj = null) {
    const form = document.querySelector("form.contact-container");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateContactForm()) return;
        
        const emailInput = document.getElementById("contact-email");
        const shouldCheck = await shouldCheckEmailDuplicate(isEdit, userObj);
        
        if (shouldCheck && await userExists(emailInput)) return;
        
        isEdit ? await updateContact(userId, userObj) : await createContact();
        loadContacts();
        closeOverlay();
    });
}

/**
 * Gets trimmed input value
 * @param {string} id - Input ID
 * @returns {string|undefined} Trimmed value
 */
function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

/**
 * Returns random color from predefined set
 * @returns {string} Hex color code
 */
function getRandomColor() {
    const colors = ["#f1c40f", "#1abc9c", "#3498db", "#e67e22", "#9b59b6"];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Extracts initials from name
 * @param {string} name - Full name
 * @returns {string} Initials in uppercase
 */
function getInitials(name) {
    const trimmed = name.trim();
    const parts = trimmed.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
}

/**
 * Finds or creates contact group
 * @param {HTMLElement} container - Container element
 * @param {string} letter - Group letter
 * @returns {HTMLElement} Group element
 */
function findOrCreateGroup(container, letter) {
    const allGroups = container.querySelectorAll(".contact-group");
    let group = Array.from(allGroups).find(g => 
        g.querySelector(".group-letter")?.textContent === letter
    );
    
    if (!group) {
        group = document.createElement("div");
        group.classList.add("contact-group");
        group.innerHTML = `<div class="group-letter">${letter}</div>`;
        container.appendChild(group);
    }
    return group;
}

/**
 * Deletes user from database
 * @async
 * @param {string} path - User path
 * @returns {Promise<void>}
 */
async function deleteUser(path) {
    const userDetails = document.querySelector(".user-details");
    try {
        await deleteData(path);
        closeOverlay();
        userDetails.innerHTML = "";
        loadContacts();
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
    }
}

/**
 * Removes user from HTML DOM
 * @param {string} path - User path
 * @returns {void}
 */
function removeUserFromHTML(path) {
    const userId = path.split("/")[1];
    const contactEl = document.querySelector(`[data-user-id="${userId}"]`);
    if (contactEl) contactEl.remove();
}

/**
 * Sets up edit form
 * @param {string} id - User identifier
 * @param {Object} user - User object
 * @returns {void}
 */
function editForm(id, user) {
    const form = document.querySelector("form.contact-container");
    editAvatar(user);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updateUser = createUser(
            document.getElementById("contact-name").value,
            document.getElementById("contact-email").value,
            document.getElementById("contact-phone").value,
            user.color,
            user.assigned,
            user.password
        );
        await putData(`users/${id}`, updateUser);
        openUserInfos(id);
        loadContacts();
        closeOverlay();
    });
}

/**
 * Updates avatar display
 * @param {Object} user - User object
 * @returns {void}
 */
function editAvatar(user) {
    const avatar = document.getElementById("avatar-edit");
    avatar.innerHTML = user.avatar;
    avatar.style.backgroundColor = user.color;
}

/**
 * Loads all contacts from database
 * @async
 * @returns {Promise<void>}
 */
async function loadContacts() {
    let users = await loadData("users");
    let initials = getUniqueInitials(users);
    importContactGroups(users, initials);
}
loadContacts();

/**
 * Extracts unique sorted initials from users
 * @param {Object} users - Users object
 * @returns {Array<string>} Sorted initials
 */
function getUniqueInitials(users) {
    let result = [];
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (!result.includes(initial)) result.push(initial);
    }
    return result.sort();
}

/**
 * Creates and renders contact groups
 * @param {Object} users - Users object
 * @param {Array<string>} initials - Sorted initials
 * @returns {void}
 */
function importContactGroups(users, initials) {
    let contactsContainer = document.getElementById("contacts-container");
    contactsContainer.innerHTML = "";
    initials.forEach(letter => {
        let contactGroup = document.createElement("div");
        contactGroup.classList.add("contact-group");
        contactGroup = buildLetterGroup(contactGroup, letter, users);
        contactsContainer.appendChild(contactGroup);
    });
}

/**
 * Builds contact group for specific letter
 * @param {HTMLElement} contactGroup - Group element
 * @param {string} letter - Group letter
 * @param {Object} users - Users object
 * @returns {HTMLElement} Populated group
 */
function buildLetterGroup(contactGroup, letter, users) {
    contactGroup.appendChild(createLetterBox(letter));
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (initial === letter) {
            contactGroup.appendChild(createContactElement(users[key], key));
        }
    }
    return contactGroup;
}

/**
 * Creates letter header box
 * @param {string} letter - Letter to display
 * @returns {HTMLElement} Letter box element
 */
function createLetterBox(letter) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.classList.add("group-letter");
    span.innerHTML = letter;
    div.appendChild(span);
    return div;
}

/**
 * Opens user details view
 * @async
 * @param {string} id - User identifier
 * @returns {Promise<void>}
 */
async function openUserInfos(id) {
    let user = await loadData(`users/${id}`);
    const contactField = document.querySelector(".contact-field");
    const usersInfo = document.querySelector(".info-container");
    contactField.style.display = "block";
    usersInfo.innerHTML = renderUserInfo(id, user);
    setTimeout(() => {
        document.querySelector(".user-details").classList.add("translatex-user");
    }, 100);
}

/**
 * Opens add contact overlay
 * @returns {void}
 */
function openAddContact() {
    const overlay = document.getElementById("overlay");
    openOverlay();
    overlay.innerHTML = getContactOverlayTemplate();
    initContactFormValidation(false);
}

/**
 * Opens edit contact overlay
 * @async
 * @param {string} id - User identifier
 * @returns {Promise<void>}
 */
async function editContactById(id) {
    const user = await loadData(`users/${id}`);
    openOverlay();
    editContactOverlay(user);
    editAvatar(user);
    initContactFormValidation(true, id, user);
}

/**
 * Hides contact details panel
 * @returns {void}
 */
function hideContacts() {
    const contactField = document.querySelector(".contact-field");
    const infoContainer = document.querySelector(".info-container");
    infoContainer.innerHTML = "";
    contactField.style.display = "none";
    toggleContactBg();
}

/**
 * Opens mobile edit menu
 * @returns {void}
 */
function opencEditMenu() {
    const container = document.querySelector(".mobile-edit-delete");
    container.style.display = "block";
    setTimeout(() => toggleEditMenu(), 100);
}

/**
 * Toggles mobile edit menu visibility
 * @returns {void}
 */
function toggleEditMenu() {
    document.querySelector(".user-edit-container").classList.toggle("edit-translateX");
}

/**
 * Closes mobile edit menu
 * @returns {void}
 */
function closeEditMenu() {
    const container = document.querySelector(".mobile-edit-delete");
    toggleEditMenu();
    setTimeout(() => container.style.display = "none", 100);
}

/**
 * Toggles contact background highlight
 * @param {Event} e - Click event
 * @returns {void}
 */
function toggleContactBg(e) {
    document.querySelectorAll(".contact").forEach(contact => {
        contact.classList.remove("contact-dark-blue");
    });
    if (e) e.target.classList.add("contact-dark-blue");    
}

/**
 * Handles responsive contact field behavior
 */
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", () => {
        const contactField = document.querySelector(".contact-field");
        contactField.style.display = window.innerWidth > 860 ? "block" : "none";
    });
});
