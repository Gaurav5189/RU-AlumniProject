// JavaScript for the profile page
document.addEventListener('DOMContentLoaded', function() {
    // Navigation and sidebar functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const toggleEditBtn = document.getElementById('toggleEditBtn');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profileForm = document.getElementById('profileForm');
    const submitBtn = document.getElementById('submitBtn');
    let isEditing = false;
    
    // Maximum file size (1MB in bytes)
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    
    // Toggle active class in menu
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // This will be handled by the links, no need for additional logic
        });
    });
    
    // Edit Profile Functionality
    toggleEditBtn.addEventListener('click', function() {
        toggleEditMode();
    });
    
    // Change Photo Functionality
    changePhotoBtn.addEventListener('click', function() {
        profilePhotoInput.click();
    });
    
    // Handle file selection with size validation
    profilePhotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                alert('File size exceeds 1MB. Please choose a smaller image.');
                // Reset the input
                profilePhotoInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Update both profile images
                const avatarImg = document.querySelector('.avatar');
                if (avatarImg) {
                    avatarImg.src = event.target.result;
                }
                
                // Update or create the large profile image
                const largeProfilePic = document.querySelector('.large-profile-pic');
                
                // Check if the large profile pic contains an image already
                let profileImage = largeProfilePic.querySelector('img');
                
                if (!profileImage) {
                    // Remove the text node (initials)
                    largeProfilePic.innerHTML = '';
                    
                    // Create a new image element
                    profileImage = document.createElement('img');
                    profileImage.className = 'large-avatar';
                    largeProfilePic.appendChild(profileImage);
                }
                
                profileImage.src = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Profile editing functionality
    function toggleEditMode() {
        const infoValues = document.querySelectorAll('.info-value');
        const editInputs = document.querySelectorAll('.edit-input');
        
        isEditing = !isEditing;
        
        if (isEditing) {
            // Switch to edit mode
            toggleEditBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            
            // Show the change photo button
            changePhotoBtn.style.display = 'block';
            
            infoValues.forEach(infoValue => {
                infoValue.style.display = 'none';
                
                // Find the matching input field
                const fieldName = infoValue.getAttribute('data-field');
                const input = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
                
                if (input) {
                    input.style.display = 'block';
                    input.value = infoValue.textContent.trim();
                }
            });
        } else {
            // Save changes and exit edit mode
            toggleEditBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            
            // Hide the change photo button
            changePhotoBtn.style.display = 'none';
            
            // Submit the form to save changes
            saveProfileChanges();
            
            infoValues.forEach(infoValue => {
                const fieldName = infoValue.getAttribute('data-field');
                const input = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
                
                if (input) {
                    infoValue.textContent = input.value;
                    input.style.display = 'none';
                    infoValue.style.display = 'block';
                }
            });
        }
    }
    
    // Save profile changes to backend
    function saveProfileChanges() {
        // Submit the form
        profileForm.submit();
    }
});