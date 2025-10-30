const themeFilters = {
  'none': 'none',
  'smart-dark': 'invert(1) hue-rotate(180deg)',
  'pure-invert': 'invert(1)',
  'sepia': 'sepia(1) contrast(0.9) brightness(0.9)',
  'desert': 'sepia(0.5) contrast(1.2) brightness(0.8) hue-rotate(-20deg)',
  'water': 'sepia(0.3) saturate(1.5) hue-rotate(-60deg) contrast(0.9) brightness(1.1)',
  'neodark': 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(0.9)',
  'cyberpunk': 'contrast(1.2) brightness(0.7) hue-rotate(60deg) saturate(2)'
};

// This function finds the PDF element and applies the filter
function applyTheme(themeName) {
    const filter = themeFilters[themeName] || 'none';
    
    // The PDF is inside an <embed> tag. Let's find it.
    // This is the FIX: We query for 'embed' instead of document.body
    const pdfEmbed = document.querySelector('embed'); 
    
    if (pdfEmbed) {
        // If we find it, apply the filter directly to it
        pdfEmbed.style.filter = filter;
    } else if (themeName !== 'none') {
        // If we can't find it yet, the page might still be loading.
        // Try again in 100 milliseconds.
        setTimeout(() => applyTheme(themeName), 100);
    }
}

// Listen for the message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyTheme") {
        if (request.enabled) {
            applyTheme(request.theme);
        } else {
            applyTheme('none'); // Revert to default
        }
    }
    // Return true to indicate we will send a response asynchronously
    // This can help prevent the "receiving end does not exist" error in some cases
    return true; 
});

// Apply theme on initial page load (based on saved settings)
chrome.storage.sync.get(['enabled', 'theme'], (result) => {
    if (result.enabled) {
        applyTheme(result.theme || 'none');
    }
});