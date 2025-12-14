document.addEventListener('DOMContentLoaded', function () {
    const toggleEditBtn = document.getElementById('toggleEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveContainer = document.getElementById('saveContainer');
    const profileForm = document.getElementById('profileForm');

    // Toggle Edit Mode
    toggleEditBtn.addEventListener('click', function () {
        enableEditMode();
    });

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function () {
            disableEditMode();
        });
    }

    function enableEditMode() {
        // Show inputs, hide static values
        document.querySelectorAll('.form-group .value').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-group .edit-input').forEach(el => el.style.display = 'block');

        // Show image upload
        document.querySelectorAll('.image-upload-group').forEach(el => el.style.display = 'block');

        // Show save buttons, hide edit button
        saveContainer.style.display = 'flex';
        toggleEditBtn.style.display = 'none';

        // Scroll to top of form
        profileForm.scrollIntoView({ behavior: 'smooth' });
    }

    function disableEditMode() {
        // Hide inputs, show static values
        document.querySelectorAll('.form-group .value').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.form-group .edit-input').forEach(el => el.style.display = 'none');

        // Hide image upload
        document.querySelectorAll('.image-upload-group').forEach(el => el.style.display = 'none');

        // Hide save buttons, show edit button
        saveContainer.style.display = 'none';
        toggleEditBtn.style.display = 'inline-block';

        // Optional: Reset form values to original static values if cancelled?
        // For now, simpler to just hide.
    }
});