document.getElementById('store-password').addEventListener('click', function() {
    const passwordInputs = document.getElementById('password-inputs');
    passwordInputs.style.display = passwordInputs.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('submit-password').addEventListener('click', function() {
    const serviceName = document.getElementById('service-name').value.trim();
    const servicePassword = document.getElementById('service-password').value.trim();
    const serviceEmail = document.getElementById('service-email').value.trim(); // Get the email

    if (!serviceName || !servicePassword || !serviceEmail) {
        alert("Please enter service name, password, and email.");
        return;
    }

    // Store the password and email in local storage
    const passwords = JSON.parse(localStorage.getItem('passwords')) || {};
    passwords[serviceName] = {
        password: servicePassword,
        email: serviceEmail // Store email along with password
    };
    localStorage.setItem('passwords', JSON.stringify(passwords));

    // Clear input fields
    document.getElementById('service-name').value = '';
    document.getElementById('service-password').value = '';
    document.getElementById('service-email').value = ''; // Clear email input

    alert("Password stored successfully!");

    // Reset to original format
    const passwordInputs = document.getElementById('password-inputs');
    passwordInputs.style.display = 'none'; // Hide the input fields again
});
