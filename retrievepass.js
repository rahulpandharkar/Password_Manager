function retrievePasswords() {
    // Prompt the user for the email
    const emailInput = prompt("Please enter your email address:");
    if (!emailInput) {
        alert("Email cannot be empty.");
        return;
    }

    // Get the stored passwords from local storage
    const storedPasswords = JSON.parse(localStorage.getItem('passwords')) || {};

    // Create a message to display the passwords
    let passwordList = '';

    // Check through the stored passwords to find services associated with the given email
    let found = false; // To track if any services were found

    for (const service in storedPasswords) {
        // Check if the service's email matches the entered email
        if (storedPasswords[service].email === emailInput) {
            found = true; // We found at least one service
            passwordList += `${service}: ${storedPasswords[service].password} \n`;
        }
    }

    // If no services are found for the email
    if (!found) {
        alert("No passwords found for this email.");
        return;
    }

    // Create a popup window to display the passwords
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.id = 'retrieve-popup'; // Unique ID for this popup

    const popupContent = `
        <div class="popup-content">
            <h2>Stored Passwords</h2>
            <pre>${passwordList}</pre>
            <button id="close-retrieve-popup">Close</button>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // Close popup event
    document.getElementById('close-retrieve-popup').addEventListener('click', function () {
        document.body.removeChild(popup);
    });
}

// Add event listener for the retrieve button
document.getElementById('retrieve-password').addEventListener('click', retrievePasswords);
