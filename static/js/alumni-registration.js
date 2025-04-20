// Get the email parameter from URL and set it in the email field
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
        document.getElementById('email-field').value = emailParam;
    }
    
    // Real-time password match validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const matchIndicator = document.getElementById('password-match-indicator');
    const form = document.querySelector('form');
    
    // Check passwords on input
    confirmPassword.addEventListener('input', function() {
        if(password.value === "") {
            matchIndicator.textContent = "";
            matchIndicator.className = "password-match-indicator";
        } else if(password.value === confirmPassword.value) {
            matchIndicator.textContent = "Passwords match ✓";
            matchIndicator.className = "password-match-indicator valid";
        } else {
            matchIndicator.textContent = "Passwords don't match ✗";
            matchIndicator.className = "password-match-indicator";
        }
    });
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
        if (password.value !== confirmPassword.value) {
            alert("Passwords don't match!");
            event.preventDefault();
        }
    });
};