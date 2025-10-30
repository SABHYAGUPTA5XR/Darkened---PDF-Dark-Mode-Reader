const enableToggle = document.getElementById('enableToggle');
const themeSelect = document.getElementById('themeSelect');

// Load saved settings when popup opens
chrome.storage.sync.get(['enabled', 'theme'], (result) => {
  enableToggle.checked = !!result.enabled;
  themeSelect.value = result.theme || 'none';
});

// Save settings and send message when toggle is clicked
enableToggle.addEventListener('change', () => {
  const enabled = enableToggle.checked;
  chrome.storage.sync.set({ enabled: enabled });
  sendMessage(enabled, themeSelect.value);
});

// Save settings and send message when theme is changed
themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value;
  chrome.storage.sync.set({ theme: theme });
  if (enableToggle.checked) {
    sendMessage(true, theme);
  }
});

// Helper function to send the command to the content script
function sendMessage(enabled, theme) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "applyTheme",
      enabled: enabled,
      theme: theme
    });
  });
}