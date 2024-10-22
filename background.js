// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Function to get access token
function getAccessToken() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError) {
                console.error('Auth error:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else if (token) {
                console.log('Token obtained successfully');
                resolve(token);
            } else {
                console.error('No token received');
                reject(new Error('No token received'));
            }
        });
    });
}

// Function to verify token
async function verifyToken(token) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );
        const data = await response.json();
        return !data.error;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}

// Function to revoke token
function revokeToken(token) {
    return new Promise((resolve) => {
        chrome.identity.removeCachedAuthToken({ token }, () => {
            console.log('Token revoked');
            resolve();
        });
    });
}

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAccessToken') {
        handleTokenRequest(sendResponse);
        return true; // Keep message channel open
    }
    if (request.action === 'getCredentials') {
        const serviceName = request.serviceName;  // The service name is passed from the content script

        // Retrieve passwords from local storage
        const storedPasswords = JSON.parse(localStorage.getItem('passwords')) || {};

        if (storedPasswords[serviceName]) {
            // Send the username and password back to the content script
            sendResponse({
                email: storedPasswords[serviceName].email,
                password: storedPasswords[serviceName].password
            });
        } else {
            sendResponse({ error: 'No credentials found for this service.' });
        }
    }
});

// Handle token request
async function handleTokenRequest(sendResponse) {
    try {
        // Get token
        const token = await getAccessToken();
        
        // Verify token
        const isValid = await verifyToken(token);
        
        if (isValid) {
            console.log('Token is valid');
            sendResponse({ token });
        } else {
            console.log('Token is invalid, revoking...');
            await revokeToken(token);
            sendResponse({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Error in token request:', error);
        sendResponse({ error: error.message });
    }
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    // Clear any existing tokens
    chrome.identity.getAuthToken({ interactive: false }, function(token) {
        if (token) {
            chrome.identity.removeCachedAuthToken({ token: token });
        }
    });
});