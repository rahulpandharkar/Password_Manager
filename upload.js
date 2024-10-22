let statusDiv = null;

function updateStatus(message) {
    console.log(message);
    if (statusDiv) {
        statusDiv.textContent = message;
    }
}

function handleUpload(token) {
    updateStatus("Preparing data for upload...");
    
    try {
        const storedPasswords = JSON.parse(localStorage.getItem('passwords')) || {};
        
        const dataToUpload = {
            services: Object.entries(storedPasswords).map(([service, data]) => ({
                serviceName: service,
                password: data.password,
                email: data.email
            }))
        };

        const metadata = {
            name: 'passwords.json',
            mimeType: 'application/json'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([JSON.stringify(dataToUpload)], { type: 'application/json' }));

        updateStatus("Uploading to Google Drive...");

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        })
        .then(response => response.json())
        .then(data => {
            console.log("Upload successful:", data);
            window.alert("upload successful!");
            updateStatus("Upload successful!");

        })
        .catch(error => {
            console.error("Upload failed:", error);
            updateStatus("Upload failed: " + error.message);
        });
    } catch (error) {
        console.error("Error processing data:", error);
        updateStatus("Error preparing data: " + error.message);
    }
}

function initializePopup() {
    // Get status div reference
    statusDiv = document.getElementById('status');
    const uploadButton = document.getElementById('upload-drive');
    
    if (!uploadButton) {
        console.error("Upload button not found!");
        return;
    }

    // Add click handler
    uploadButton.addEventListener('click', () => {
        updateStatus("Starting authentication...");
        
        chrome.runtime.sendMessage({ action: 'getAccessToken' }, (response) => {
            console.log("Got response:", response);
            
            if (response && response.token) {
                handleUpload(response.token);
            } else {
                updateStatus("Failed to get authentication token");
                console.error("Failed to get token:", response);
            }
        });
    });

    updateStatus("Ready to upload...");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);