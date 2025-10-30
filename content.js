// This object maps your theme names to actual CSS filter values
const themeFilters = {
  'none': 'none',
  'dark': 'invert(1)',
  'dark-smart': 'invert(1) hue-rotate(180deg)',
  'sepia': 'sepia(1) contrast(0.9) brightness(0.9)',
  'desert': 'sepia(0.5) contrast(1.2) brightness(0.8) hue-rotate(-20deg)',
  'cyberpunk': 'contrast(1.2) brightness(0.7) hue-rotate(60deg) saturate(2)'
  // Add your Neodark, Water, etc. values here
};

// Listen for the message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyTheme") {
    if (request.enabled) {
      applyTheme(request.theme);
    } else {
      applyTheme('none'); // Revert to default
    }
  }
});

// Function to apply the CSS filter
function applyTheme(themeName) {
  const filter = themeFilters[themeName] || 'none';
  
  // The PDF is rendered inside an <embed> tag, which is in the <body>
  // Applying the filter to the body works.
  document.body.style.filter = filter;
}

// Apply theme on initial page load (based on saved settings)
chrome.storage.sync.get(['enabled', 'theme'], (result) => {
  if (result.enabled) {
    applyTheme(result.theme || 'none');
  }
});