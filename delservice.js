function deleteService() {
    // Ask for the email before displaying services
    const email = prompt("Please enter your email to confirm deletion:");
    const storedPasswords = JSON.parse(localStorage.getItem('passwords')) || {};

    // Create a message to display the services with checkboxes
    let serviceList = '';
    for (const service in storedPasswords) {
        // Check if the stored email matches
        if (storedPasswords[service].email === email) {
            serviceList += `
                <div>
                    <input type="checkbox" class="service-checkbox" id="${service}">
                    <label for="${service}">${service}</label>
                </div>
            `;
        }
    }

    // If no services are found for the email
    if (serviceList === '') {
        alert("No services found for the provided email.");
        return;
    }

    // Create a popup window to select services for deletion
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.id = 'delete-popup'; // Unique ID for this popup

    const popupContent = `
        <div class="popup-content">
            <h2>Select Services to Delete</h2>
            ${serviceList}
            <button id="delete-selected">Delete Selected</button>
            <button id="close-delete-popup">Close</button>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // Close popup event
    document.getElementById('close-delete-popup').addEventListener('click', function () {
        document.body.removeChild(popup);
    });

    // Delete selected services event
    document.getElementById('delete-selected').addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.service-checkbox:checked');
        checkboxes.forEach(checkbox => {
            const serviceName = checkbox.id; // Get the id (service name) of the checked box
            delete storedPasswords[serviceName]; // Remove the password from the object
        });
        
        // Update local storage
        localStorage.setItem('passwords', JSON.stringify(storedPasswords));
        
        alert("Selected services and their passwords deleted successfully!");
        document.body.removeChild(popup); // Close popup after deletion
    });
}

// Add event listener for the delete button
document.getElementById('delete-services').addEventListener('click', deleteService);
