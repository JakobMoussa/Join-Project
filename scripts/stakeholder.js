/** @const {string} STORAGE_KEY */
const STORAGE_KEY = 'stakeholder_requests';

/** @type {Object} ELEMENTS */
const ELEMENTS = {
    btn: null,
    badgeUsed: null,
    badgeLimits: null,
    msgLimits: null,
    modal: null,
    closeBtn: null,
    form: null,
    successMsg: null,
};

/**
 * Initializes the stakeholder page on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    initElements();
    initRequestData();
    initEventListeners();
});

/**
 * Caches all required DOM elements.
 */
function initElements() {
    ELEMENTS.btn = document.querySelector('.btn-create-email');
    ELEMENTS.badgeUsed = document.querySelectorAll('.requests-used');
    ELEMENTS.badgeLimits = document.querySelectorAll('.request-limit-badge');
    ELEMENTS.msgLimits = document.querySelectorAll('.limit-reached-msg');
    ELEMENTS.modal = document.getElementById('fallback-modal');
    ELEMENTS.closeBtn = document.getElementById('close-modal-btn');
    ELEMENTS.form = document.getElementById('fallback-form');
    ELEMENTS.successMsg = document.getElementById('success-msg');
}

/**
 * Initializes and validates daily request data from localStorage.
 */
function initRequestData() {
    const today = new Date().toISOString().split('T')[0];
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || data.date !== today) {
        data = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    updateBadges(data.count);
}

/**
 * Registers all event listeners.
 */
function initEventListeners() {
    if (ELEMENTS.btn) ELEMENTS.btn.addEventListener('click', handleCreateRequestClick);
    if (ELEMENTS.closeBtn) ELEMENTS.closeBtn.addEventListener('click', closeModal);
    if (ELEMENTS.form) ELEMENTS.form.addEventListener('submit', handleFormSubmit);
}

/**
 * Handles the "Create Request" button click.
 * @param {Event} e - The click event.
 */
function handleCreateRequestClick(e) {
    checkMailAppFallback();
}

/**
 * Increments the request count and updates the UI.
 */
function incrementRequestCount() {
    const today = new Date().toISOString().split('T')[0];
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { date: today, count: 0 };
    data.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateBadges(data.count);
}

/**
 * Checks if a mail client opens, else shows fallback modal.
 */
function checkMailAppFallback() {
    let blurred = false;
    const onBlur = () => { 
        blurred = true; 
        incrementRequestCount(); // Assumes mail app opened
        window.removeEventListener('blur', onBlur);
    };
    window.addEventListener('blur', onBlur);
    
    setTimeout(() => {
        window.removeEventListener('blur', onBlur);
        if (!blurred && ELEMENTS.modal) {
            ELEMENTS.modal.classList.remove('d-none');
        }
    }, 1000);
}

/**
 * Closes the fallback modal.
 */
function closeModal() {
    if (ELEMENTS.modal) ELEMENTS.modal.classList.add('d-none');
}

/**
 * Handles the submission of the fallback form.
 * @param {Event} e - The submit event.
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const btn = ELEMENTS.form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    toggleButtonState(btn, true, 'Sending...');
    
    const formData = new FormData(ELEMENTS.form);
    const data = Object.fromEntries(formData.entries());
    
    await sendFormspreeRequest(data);
    toggleButtonState(btn, false, originalText);
}

/**
 * Toggles the button state during submission.
 * @param {HTMLButtonElement} btn - The submit button.
 * @param {boolean} disabled - Whether it should be disabled.
 * @param {string} text - The text to display.
 */
function toggleButtonState(btn, disabled, text) {
    btn.disabled = disabled;
    btn.textContent = text;
}

/**
 * Sends data to Formspree API.
 * @param {Object} data - The form data object.
 */
async function sendFormspreeRequest(data) {
    try {
        const response = await fetch("https://formspree.io/f/mnpndwze", {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        handleFormspreeResponse(response);
    } catch (error) {
        alert('Netzwerkfehler. Bitte versuche es später noch einmal.');
    }
}

/**
 * Handles the response from Formspree API.
 * @param {Response} response - The fetch response.
 */
function handleFormspreeResponse(response) {
    if (response.ok) {
        showSuccessMessage();
    } else {
        alert('Es gab ein Problem beim Senden der Anfrage. Bitte überprüfe die Formspree-URL.');
    }
}

/**
 * Shows the success message, resets the form, and increments the counter.
 */
function showSuccessMessage() {
    incrementRequestCount();
    if (ELEMENTS.successMsg) ELEMENTS.successMsg.classList.remove('d-none');
    setTimeout(() => {
        ELEMENTS.form.reset();
        if (ELEMENTS.successMsg) ELEMENTS.successMsg.classList.add('d-none');
        closeModal();
    }, 2500);
}

/**
 * Updates the UI elements based on the current request count.
 * @param {number} count - The current number of requests.
 */
function updateBadges(count) {
    ELEMENTS.badgeUsed.forEach(el => el.textContent = count);
    const isLimit = count >= 10;
    toggleLimitClasses(ELEMENTS.badgeLimits, 'limit-reached', isLimit);
    toggleLimitClasses(ELEMENTS.msgLimits, 'show', isLimit);
}

/**
 * Toggles CSS classes on a NodeList.
 * @param {NodeListOf<HTMLElement>} elements - The elements.
 * @param {string} className - The class to toggle.
 * @param {boolean} add - Whether to add or remove the class.
 */
function toggleLimitClasses(elements, className, add) {
    elements.forEach(el => {
        if (add) el.classList.add(className);
        else el.classList.remove(className);
    });
}
