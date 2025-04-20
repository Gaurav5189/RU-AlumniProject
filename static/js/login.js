document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const container = document.getElementById('container');
    const overlayCon = document.getElementById('overlayCon');
    const overlayBtn = document.getElementById('overlayBtn');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signUpForm = document.getElementById('signUpForm');
    const signupEmail = document.getElementById('signupEmail');
    const continueBtn = document.getElementById('continueBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const otpContainer = document.getElementById('otp-container');
    const otpInput = document.getElementById('otpInput');
    const resendBtn = document.getElementById('resend-btn');
    const resendTimer = document.getElementById('resend-timer');
    const countdownEl = document.getElementById('countdown');
    const signupInstruction = document.getElementById('signup-instruction');
    
    // Get the verify URL from the data attribute
    const verifyOtpAjaxUrl = signUpForm.getAttribute('data-verify-url');
    console.log("Verify OTP URL:", verifyOtpAjaxUrl); // Debug: log the URL

    // Toggle between sign in and sign up panels
    signUpBtn.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });
    signInBtn.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });
    if (overlayBtn) {
        overlayBtn.addEventListener('click', () => {
            container.classList.toggle('right-panel-active');
        });
    }

    // Function to get CSRF token - UPDATED to be more reliable
    function getCSRFToken() {
        // First try to get token from the cookie
        let cookieValue = null;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('csrftoken=')) {
                cookieValue = cookie.split('=')[1];
                break;
            }
        }
        
        // If no cookie found, try to get from the form's CSRF input
        if (!cookieValue) {
            const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
            if (csrfInput) {
                cookieValue = csrfInput.value;
            }
        }
        
        console.log("CSRF Token:", cookieValue ? "Found" : "Not found"); // Debug: check if token exists
        return cookieValue;
    }

    // Handle "Continue" button click (Request OTP)
    continueBtn.addEventListener('click', function() {
        const email = signupEmail.value.trim();
        console.log("Continue clicked with email:", email); // Debug
        
        if (email && validateEmail(email)) {
            // Show OTP fields and hide continue button for better UX
            otpContainer.style.display = 'block';
            continueBtn.style.display = 'none';
            verifyBtn.style.display = 'block';
            signupInstruction.textContent = 'Enter the OTP sent to your email';
            startCountdown();
            
            // Set focus to OTP input field
            setTimeout(() => {
                otpInput.focus();
            }, 100);
            
            const csrfToken = getCSRFToken();
            console.log("Form action URL:", signUpForm.action); // Debug: log the form action URL

            // Extract and use the CSRF token from the form itself for more reliability
            const formData = new FormData(signUpForm);
            formData.append('email', email);
            
            // Call backend to send OTP with proper headers
            fetch(signUpForm.action, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                    "X-Requested-With": "XMLHttpRequest"  // Add this to indicate AJAX request
                },
                body: formData
            })
            .then(response => {
                console.log("OTP Request Status:", response.status); // Debug
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        // Try to parse as JSON
                        return JSON.parse(text);
                    } catch (e) {
                        // If it's not JSON, show a part of the text for debugging
                        console.error("Not valid JSON response:", text.substring(0, 100));
                        throw new Error("Invalid JSON response from server");
                    }
                });
            })
            .then(data => {
                console.log("OTP Request Response:", data); // Debug
                if (!data.success) {
                    // If there was an error, revert UI changes
                    otpContainer.style.display = 'none';
                    continueBtn.style.display = 'block';
                    verifyBtn.style.display = 'none';
                    signupInstruction.textContent = 'Enter your email to continue';
                    alert("Error: " + data.error);
                } 
                // If success, do nothing special. OTP is sent, user sees OTP field.
            })
            .catch(error => {
                console.error("Error sending OTP:", error);
                // Revert UI changes on error
                otpContainer.style.display = 'none';
                continueBtn.style.display = 'block';
                verifyBtn.style.display = 'none';
                signupInstruction.textContent = 'Enter your email to continue';
                alert("An error occurred while sending the OTP. Please try again.");
            });
        } else {
            alert('Please enter a valid email address');
        }
    });

    // Handle "Verify" button click (Submit OTP)
    verifyBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default form submission
        const email = signupEmail.value.trim();
        const otp = otpInput.value.trim();
        console.log("Verify clicked with email:", email, "and OTP:", otp); // Debug

        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            // Clear the OTP input
            otpInput.value = "";
            // Use a slightly longer timeout to ensure the alert is fully dismissed
            setTimeout(() => {
                otpInput.focus();
            }, 300);
            return;
        }

        const csrfToken = getCSRFToken();
        console.log("Verify OTP URL:", verifyOtpAjaxUrl); // Debug

        // Create FormData object for more reliable data submission
        const formData = new FormData();
        formData.append('email', email);
        formData.append('otp_code', otp);
        formData.append('csrfmiddlewaretoken', csrfToken);

        // Call the verify-otp-ajax endpoint using the URL from data attribute
        fetch(verifyOtpAjaxUrl, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "X-Requested-With": "XMLHttpRequest"  // Add this to indicate AJAX request
            },
            body: formData
        })
        .then(response => {
            console.log("Verify OTP Status:", response.status); // Debug
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text().then(text => {
                try {
                    // Try to parse as JSON
                    return JSON.parse(text);
                } catch (e) {
                    // If it's not JSON, show a part of the text for debugging
                    console.error("Not valid JSON response:", text.substring(0, 100));
                    throw new Error("Invalid JSON response from server");
                }
            });
        })
        .then(data => {
            console.log("Verify OTP Response:", data); // Debug
            if (!data.success) {
                alert("Error: " + data.error);
                // Clear the OTP input
                otpInput.value = "";
                // Use a slightly longer timeout to ensure the alert is fully dismissed
                setTimeout(() => {
                    otpInput.focus();
                    // Enable the input field explicitly
                    otpInput.disabled = false;
                    otpInput.readOnly = false;
                }, 300);
            } else {
                // On success, redirect to the alumni-registration page
                window.location.href = data.redirect_url;
            }
        })
        .catch(error => {
            console.error("Error verifying OTP:", error);
            alert("An error occurred while verifying the OTP. Please try again.");
            // Clear the OTP input
            otpInput.value = "";
            // Use a slightly longer timeout
            setTimeout(() => {
                otpInput.focus();
                // Enable the input field explicitly
                otpInput.disabled = false;
                otpInput.readOnly = false;
            }, 300);
        });
    });

    // Handle "Resend OTP" button click
    resendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = signupEmail.value.trim();
        console.log("Resend OTP clicked for email:", email); // Debug

        // Hide resend button and show timer again for better UX
        resendBtn.style.display = 'none';
        resendTimer.style.display = 'inline';
        startCountdown();
        
        // Clear the OTP input field and focus it
        otpInput.value = "";
        setTimeout(() => {
            otpInput.focus();
        }, 100);

        const csrfToken = getCSRFToken();

        // Create FormData object for more reliable submission
        const formData = new FormData();
        formData.append('email', email);
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('resend', 'true');

        // Call the same /register/ or a separate /resend-otp/ if you have one
        fetch(signUpForm.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "X-Requested-With": "XMLHttpRequest"  // Add this to indicate AJAX request
            },
            body: formData
        })
        .then(response => {
            console.log("Resend OTP Status:", response.status); // Debug
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text().then(text => {
                try {
                    // Try to parse as JSON
                    return JSON.parse(text);
                } catch (e) {
                    // If it's not JSON, show a part of the text for debugging
                    console.error("Not valid JSON response:", text.substring(0, 100));
                    throw new Error("Invalid JSON response from server");
                }
            });
        })
        .then(data => {
            console.log("Resend OTP Response:", data); // Debug
            if (!data.success) {
                // If resend fails, revert UI
                resendBtn.style.display = 'inline';
                resendTimer.style.display = 'none';
                alert("Error: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error resending OTP:", error);
            resendBtn.style.display = 'inline';
            resendTimer.style.display = 'none';
            alert("An error occurred while resending the OTP. Please try again.");
        });
    });

    // Function to start countdown timer
    function startCountdown() {
        let seconds = 40;
        countdownEl.textContent = seconds;
        const interval = setInterval(() => {
            seconds--;
            countdownEl.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                resendTimer.style.display = 'none';
                resendBtn.style.display = 'inline';
            }
        }, 1000);
    }

    // Function to validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Restrict OTP field to digits only
    otpInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Add click event listener to the document to help with focus issues
    document.addEventListener('click', function(e) {
        // If we click anywhere but we're in OTP mode, refocus on OTP input
        if (otpContainer.style.display === 'block' && 
            e.target !== otpInput && 
            e.target !== verifyBtn && 
            e.target !== resendBtn) {
            // Don't refocus immediately during alert dialogs
            if (!document.querySelector('.alert-dialog')) {
                setTimeout(() => {
                    otpInput.focus();
                }, 100);
            }
        }
    });
    
    // Ensure OTP input can get focus
    otpInput.addEventListener('blur', function() {
        // Prevent immediate blur in some cases
        if (otpContainer.style.display === 'block') {
            setTimeout(() => {
                // Only refocus if another element hasn't received focus
                if (document.activeElement.tagName.toLowerCase() === 'body') {
                    otpInput.focus();
                }
            }, 10);
        }
    });
});