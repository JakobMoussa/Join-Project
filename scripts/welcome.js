/**
 * Welcome page splash animation handler
 */
function revealWelcomeContent() {
  const overlay = document.querySelector('.logo-overlay');
  const content = document.querySelector('.welcome-content');

  if (overlay) {
    overlay.classList.add('hidden');
  }
  if (content) {
    content.classList.add('visible');
  }
}

window.addEventListener('load', () => {
  setTimeout(revealWelcomeContent, 1800);
});

// Fallback in case load takes longer or fails
setTimeout(revealWelcomeContent, 3000);
