document.getElementById('generate-password').addEventListener('click', function() {
    const generatedPassword = generateRandomPassword(12); // Generate a random password
    showPopup(generatedPassword);
});

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

function showPopup(generatedPassword) {
    const popup = document.getElementById('popup');
    const passwordSpan = document.getElementById('generated-password');
    passwordSpan.textContent = generatedPassword; // Set the generated password
    popup.style.display = 'block'; // Show the popup

    // Close the popup
    document.getElementById('close-popup').addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    // Copy the password
    document.getElementById('copy-button').addEventListener('click', function() {
        navigator.clipboard.writeText(generatedPassword).then(() => {
            alert('Password copied to clipboard!');
        });
    });
}
