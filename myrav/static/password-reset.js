// Password Reset JavaScript for Ravenshaw Alumni System

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const elements = {
        sendOtpBtn: document.getElementById('send-otp-btn'),
        verifyResetBtn: document.getElementById('verify-reset-btn'),
        emailInput: document.getElementById('email'),
        otpField: document.getElementById('otp-field'),
        newPassword: document.getElementById('new-password'),
        confirmPassword: document.getElementById('confirm-password'),
        messageContainer: document.getElementById('message-container'),
        timer: document.getElementById('timer')
    };

    // Initialize timer variables
    let otpTimer;
    let timeLeft;

    // Add event listeners
    elements.sendOtpBtn.addEventListener('click', handleSendOtp);
    elements.verifyResetBtn.addEventListener('click', handleVerifyReset);

    // Handle sending OTP
    function handleSendOtp() {
        const email = elements.emailInput.value;
        
        // Validate email
        if (!isValidEmail(email)) {
            showMessage('error', 'Please enter a valid email address');
            return;
        }
        
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Update button state
        updateButtonState(elements.sendOtpBtn, 'Sending...', true);
        
        // Send API request
        fetchData('/forgot-password/', {
            'f-email': email,
            'action': 'send_otp'
        }, csrfToken)
        .then(data => {
            // Reset button state
            updateButtonState(elements.sendOtpBtn, 'Send OTP', false);
            
            if (data.success) {
                startOtpTimer();
                enablePasswordFields();
                showMessage('success', 'OTP sent to your email');
            } else {
                showMessage('error', data.error || 'Failed to send OTP');
            }
        })
        .catch(error => {
            updateButtonState(elements.sendOtpBtn, 'Send OTP', false);
            showMessage('error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        });
    }

    // Handle OTP verification and password reset
    function handleVerifyReset() {
        const email = elements.emailInput.value;
        const otpCode = elements.otpField.value;
        const newPassword = elements.newPassword.value;
        const confirmPassword = elements.confirmPassword.value;
        
        // Validate inputs
        if (!otpCode) {
            showMessage('error', 'Please enter the OTP code');
            return;
        }
        
        if (!newPassword) {
            showMessage('error', 'Please enter a new password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showMessage('error', 'Passwords do not match');
            return;
        }
        
        if (newPassword.length < 8) {
            showMessage('error', 'Password must be at least 8 characters long');
            return;
        }
        
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Update button state
        updateButtonState(elements.verifyResetBtn, 'Processing...', true);
        
        // Send API request
        fetchData('/forgot-password/', {
            'f-email': email,
            'f-otp_code': otpCode,
            'f-new_password': newPassword,
            'f-confirm_password': confirmPassword,
            'action': 'verify_reset'
        }, csrfToken)
        .then(data => {
            // Reset button state
            updateButtonState(elements.verifyResetBtn, 'Verify OTP & Reset Password', false);
            
            if (data.success) {
                showMessage('success', data.message || 'Password reset successful');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = data.redirect_url || '/login';
                }, 2000);
            } else {
                showMessage('error', data.error || 'Failed to reset password');
            }
        })
        .catch(error => {
            updateButtonState(elements.verifyResetBtn, 'Verify OTP & Reset Password', false);
            showMessage('error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        });
    }

    // Helper function to fetch data
    function fetchData(url, params, csrfToken) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams(params)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
    }

    // Start OTP timer
    function startOtpTimer() {
        // Clear any existing timer
        if (otpTimer) {
            clearInterval(otpTimer);
        }
        
        // Initialize timer
        timeLeft = 60;
        elements.timer.textContent = `(Wait ${timeLeft}s)`;
        elements.sendOtpBtn.disabled = true;
        
        // Start countdown
        otpTimer = setInterval(() => {
            timeLeft--;
            elements.timer.textContent = `(Wait ${timeLeft}s)`;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                elements.timer.textContent = '';
                elements.sendOtpBtn.disabled = false;
            }
        }, 1000);
    }

    // Enable password reset fields
    function enablePasswordFields() {
        elements.otpField.disabled = false;
        elements.newPassword.disabled = false;
        elements.confirmPassword.disabled = false;
        elements.verifyResetBtn.disabled = false;
    }

    // Update button state
    function updateButtonState(button, text, disabled) {
        button.innerHTML = text;
        button.disabled = disabled;
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Display message
    function showMessage(type, message) {
        elements.messageContainer.innerHTML = message;
        elements.messageContainer.className = type === 'success' ? 'success-message' : 'error-message';
        elements.messageContainer.style.display = 'block';
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            elements.messageContainer.style.display = 'none';
        }, 5000);
    }
});