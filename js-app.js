/* ══════════════════════════════════════════════
   APP STATE
══════════════════════════════════════════════ */
const state = {
  currentScreen: 'screenSplash'
};

/* ══════════════════════════════════════════════
   SCREEN NAVIGATION
══════════════════════════════════════════════ */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => {
    s.hidden = true;
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.hidden = false;
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
function initApp() {
  // Start at splash
  showScreen('screenSplash');

  // Bind Continue button
  const btnContinue = document.getElementById('btnSplashContinue');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      // NEXT: → Screen 2 — Device Setup
      // Uncomment when Screen 2 is built:
      // showScreen('screenSetup');
      console.log('Continue tapped — next screen pending');
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);