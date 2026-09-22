document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-create-email');
    const badgeUsedElements = document.querySelectorAll('.requests-used');
    const badgeElements = document.querySelectorAll('.request-limit-badge');
    const msgElements = document.querySelectorAll('.limit-reached-msg');

    const STORAGE_KEY = 'stakeholder_requests';
    
    // Get current date (local timezone)
    const today = new Date().toISOString().split('T')[0];
    
    // Load data from localStorage
    let requestData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { date: today, count: 0 };
    
    // Reset if it's a new day
    if (requestData.date !== today) {
        requestData = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requestData));
    }
    
    // Initial display
    updateBadges(requestData.count);

    if (btn) {
        btn.addEventListener('click', () => {
            requestData.count += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(requestData));
            updateBadges(requestData.count);
        });
    }

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
