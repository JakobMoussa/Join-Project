/**
 * Initializes the stakeholder request tracking logic once the DOM is fully loaded.
 * Handles the display and updating of the daily request limit badges.
 */
document.addEventListener("DOMContentLoaded", () => {
    /** @type {HTMLAnchorElement | null} */
    const btn = document.querySelector('.btn-create-email');
    
    /** @type {NodeListOf<HTMLElement>} */
    const badgeUsedElements = document.querySelectorAll('.requests-used');
    
    /** @type {NodeListOf<HTMLElement>} */
    const badgeElements = document.querySelectorAll('.request-limit-badge');
    
    /** @type {NodeListOf<HTMLElement>} */
    const msgElements = document.querySelectorAll('.limit-reached-msg');

    /** @const {string} STORAGE_KEY - The key used to store request data in localStorage. */
    const STORAGE_KEY = 'stakeholder_requests';

    /** @const {string} today - The current date in YYYY-MM-DD format based on local timezone. */
    const today = new Date().toISOString().split('T')[0];

    /**
     * @typedef {Object} RequestData
     * @property {string} date - The date the requests were tracked.
     * @property {number} count - The number of requests made on that date.
     */

    /** @type {RequestData} */
    let requestData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { date: today, count: 0 };

    // Reset the count if it's a new day
    if (requestData.date !== today) {
        requestData = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requestData));
    }

    // Initial display update
    updateBadges(requestData.count);

    if (btn) {
        /**
         * Event listener for the "Create Request" button.
         * Increments the request count, saves it to localStorage, and updates the UI.
         */
        btn.addEventListener('click', () => {
            requestData.count += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(requestData));
            updateBadges(requestData.count);
        });
    }

    /**
     * Updates the UI elements based on the current request count.
     * Toggles limit reached styling and messages if the count is 10 or more.
     * 
     * @param {number} count - The current number of requests made.
     */
    function updateBadges(count) {
        badgeUsedElements.forEach(el => {
            el.textContent = count;
        });

        if (count >= 10) {
            badgeElements.forEach(el => el.classList.add('limit-reached'));
            msgElements.forEach(el => el.classList.add('show'));
        } else {
            badgeElements.forEach(el => el.classList.remove('limit-reached'));
            msgElements.forEach(el => el.classList.remove('show'));
        }
    }
});
