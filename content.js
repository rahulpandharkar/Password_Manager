// Function to autofill credentials into login form
function autofillCredentials(email, password) {
    // Attempt to find and fill the username/email field
    const emailField = document.querySelector('input[type="email"], input[type="text"], input[name="username"]');
    if (emailField) {
        emailField.value = email;
    }

    // Attempt to find and fill the password field
    const passwordField = document.querySelector('input[type="password"]');
    if (passwordField) {
        passwordField.value = password;
    }
}

// Get the current domain or service name
const serviceName = window.location.hostname;

// Send a message to the background script to request credentials
chrome.runtime.sendMessage({ action: 'getCredentials', serviceName: serviceName }, (response) => {
    if (response && response.email && response.password) {
        // Autofill the form with the retrieved credentials
        autofillCredentials(response.email, response.password);
    } else {
        console.error(response.error || 'No credentials found.');
    }
});
