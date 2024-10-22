let downloadPopup = null;
let downloadPopupMessage = null;
let closeDownloadPopupButton = null;
let okDownloadPopupButton = null;

function showPopupMessage(message) {
    if (downloadPopup && downloadPopupMessage) {
        downloadPopupMessage.textContent = message;
        downloadPopup.style.display = 'block';
    }
}

function hidePopupMessage() {
    if (downloadPopup) {
        downloadPopup.style.display = 'none';
        downloadPopupMessage.textContent = ''; // Clear the message
    }
}

async function findMostRecentPasswordFile(token) {
    try {
        const response = await fetch(
            'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
                q: "name='passwords.json'",
                orderBy: 'modifiedTime desc',
                pageSize: 1,
                fields: 'files(id, name, modifiedTime)'
            }), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();
        
        if (!data.files || data.files.length === 0) {
            throw new Error('No password files found in Drive');
        }

        return data.files[0];
    } catch (error) {
        console.error('Error finding password file:', error);
        throw error;
    }
}

async function downloadFile(fileId, token) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        return await response.json();
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}

async function handleDownload(token) {
    try {
        showPopupMessage("Searching for password file...");
        
        const file = await findMostRecentPasswordFile(token);
        
        showPopupMessage("Downloading password file...");
        
        const fileData = await downloadFile(file.id, token);
        
        if (!fileData || !fileData.services) {
            throw new Error('Invalid file format');
        }

        const passwords = {};
        fileData.services.forEach(service => {
            passwords[service.serviceName] = {
                password: service.password,
                email: service.email
            };
        });

        localStorage.setItem('passwords', JSON.stringify(passwords));
        
        const summary = `Synchronized ${fileData.services.length} password(s)\nLast modified: ${new Date(file.modifiedTime).toLocaleString()}`;
        showPopupMessage(summary);

    } catch (error) {
        console.error('Download failed:', error);
        showPopupMessage(`Failed to download passwords: ${error.message}`);
    }
}

function initializeDownload() {
    downloadPopup = document.getElementById('download-popup');
    downloadPopupMessage = document.getElementById('download-popup-message');
    closeDownloadPopupButton = document.getElementById('close-download-popup');
    okDownloadPopupButton = document.getElementById('ok-download-popup');

    const downloadButton = document.getElementById('download-drive');
    
    if (!downloadButton) {
        console.error("Download button not found!");
        return;
    }

    // Hide popup initially
    hidePopupMessage();

    downloadButton.addEventListener('click', () => {
        showPopupMessage("Starting authentication...");
        
        chrome.runtime.sendMessage({ action: 'getAccessToken' }, (response) => {
            if (response && response.token) {
                handleDownload(response.token);
            } else {
                showPopupMessage("Failed to get authentication token");
                console.error("Failed to get token:", response);
            }
        });
    });

    // Close popup when 'X' or 'OK' is clicked
    closeDownloadPopupButton.addEventListener('click', hidePopupMessage);
    okDownloadPopupButton.addEventListener('click', hidePopupMessage);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDownload);
