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
    let data = readRequestData();
    if (!data || data.date !== today) {
        data = { date: today, count: 0 };
        saveRequestData(data);
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
    const today = new Date().toISOString().split('T')[0];
    const data = readRequestData();

    if (data && data.date === today && data.count >= 10) {
        e.preventDefault();
        return;
    }

    checkMailAppFallback();
}

/**
 * Increments the request count and updates the UI.
 */
function incrementRequestCount() {
    const today = new Date().toISOString().split('T')[0];
    let data = readRequestData();
    if (!data || data.date !== today) data = { date: today, count: 0 };
    data.count += 1;
    saveRequestData(data);
    updateBadges(data.count);
}

/**
 * Checks if a mail client opens, else shows fallback modal.
 */
function checkMailAppFallback() {
    let blurred = false;
    const onBlur = () => {
        blurred = true;
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
    if (formSending || !ELEMENTS.form.reportValidity()) return;
    const btn = ELEMENTS.form.querySelector('.btn-submit, [type="submit"]');
    if (!btn) return;
    const originalText = btn.textContent;
    formSending = true;
    toggleButtonState(btn, true, 'Sending...');
    try {
        const data = buildJoinPayload(new FormData(ELEMENTS.form));
        await sendFormspreeRequest(data);
    } catch (error) {
        alert(error.message || 'Die Anfrage konnte nicht gesendet werden.');
    } finally {
        formSending = false;
        toggleButtonState(btn, false, originalText);
    }
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
    if (ELEMENTS.successMsg) ELEMENTS.successMsg.textContent = 'Anfrage versendet. Nach erfolgreicher Verarbeitung erhältst du eine Bestätigung per E-Mail.';
    if (ELEMENTS.successMsg) ELEMENTS.successMsg.classList.remove('d-none');
    setTimeout(() => {
        ELEMENTS.form.reset();
        if (ELEMENTS.successMsg) ELEMENTS.successMsg.classList.add('d-none');
        closeModal();
        window.location.href = '../index.html';
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


let formSending = false;

/**
 * Liest ein Textfeld aus dem Formular.
 */
function getFormText(formData, fieldName) {
    const value = formData.get(fieldName);

    if (typeof value === 'string') {
        return value;
    }

    return '';
}

/**
 * Prüft die Pflichtfelder und die erlaubte Textlänge.
 */
function validateJoinPayload(payload) {
    const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

    const fieldsAreValid =
        payload.name !== '' &&
        emailPattern.test(payload.email) &&
        payload.subject.trim() !== '' &&
        payload.message.trim() !== '';

    if (!fieldsAreValid) {
        throw new Error(
            'Bitte Name, gültige E-Mail, Betreff und Nachricht ausfüllen. Formular-Feldnamen prüfen.'
        );
    }

    if (payload.message.length > 50000 || payload.subject.length > 500) {
        throw new Error('Betreff oder Nachricht ist zu lang.');
    }
}

/**
 * Bereitet die Formulardaten für Formspree und n8n vor.
 */
function buildJoinPayload(formData) {
    const payload = {
        version: 1,
        name: getFormText(formData, 'name').trim(),
        email: getFormText(formData, 'email').trim(),
        subject: getFormText(formData, 'subject'),
        message: getFormText(formData, 'message')
    };

    validateJoinPayload(payload);

    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    const marker =
        'JOIN_REQUEST_V1_BEGIN' +
        encodedPayload +
        'JOIN_REQUEST_V1_END';

    const data = Object.fromEntries(formData.entries());

    data.name = payload.name;
    data.email = payload.email;
    data.subject = payload.subject;
    data.message = payload.message + '\n\n' + marker;

    return data;
}

/**
 * Liest den lokal gespeicherten Anfragezähler.
 */
function readRequestData() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(storedData);

        if (!data) {
            return null;
        }

        if (!Number.isSafeInteger(data.count) || data.count < 0) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
}

/**
 * Speichert den Anfragezähler, sofern der Browser es erlaubt.
 */
function saveRequestData(data) {
    try {
        const storedData = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, storedData);
    } catch {
    }
}

/**
 * Öffnet das Popup über einen zusätzlichen Formular-Button.
 */
function openRequestForm(event) {
    event.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const data = readRequestData();
    if (data && data.date === today && data.count >= 10) return;

    if (ELEMENTS.modal) {
        ELEMENTS.modal.classList.remove('d-none');
    }
}

/**
 * Verbindet zusätzliche Formular-Buttons mit dem Popup.
 */
function initRequestFormButtons() {
    const buttons = document.querySelectorAll('[data-open-request-form]');

    buttons.forEach(function (button) {
        button.addEventListener('click', openRequestForm);
    });
}

document.addEventListener('DOMContentLoaded', initRequestFormButtons);
