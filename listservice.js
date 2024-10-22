function listServices() {
    // Get the stored data from local storage
    const storedData = JSON.parse(localStorage.getItem('passwords')) || {};

    // Prompt the user for their email
    const emailInput = prompt("Please enter your email address:");
    if (!emailInput) {
        alert("Email cannot be empty.");
        return;
    }

    // Create a message to display the services for the entered email
    let serviceList = '';

    // Build the service list for the corresponding email
    for (const service in storedData) {
        if (storedData[service].email === emailInput) {
            serviceList += `${service}\n`; // Only show services associated with this email
        }
    }

    // If no services are found for the email
    if (!serviceList) {
        alert("No services found for this email.");
        return;
    }

    // Create a popup window to display the services
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.id = 'list-popup'; // Unique ID for this popup

    const popupContent = `
        <div class="popup-content">
            <h2>Stored Services</h2>
            <pre>${serviceList}</pre>
            <button id="close-list-popup">Close</button>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // Close popup event
    document.getElementById('close-list-popup').addEventListener('click', function () {
        document.body.removeChild(popup);
    });
}

// Add event listener for the list services button
document.getElementById('list-services').addEventListener('click', listServices);
