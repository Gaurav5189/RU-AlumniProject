// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation and sidebar functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const editProfileBtn = document.querySelector('.btn');
    const changePhotoBtn = document.querySelector('.btn-sm');
    
    // Toggle active class in menu
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
    
    // Edit Profile Functionality
    editProfileBtn.addEventListener('click', function() {
        toggleEditMode();
    });
    
    // Change Photo Functionality
    changePhotoBtn.addEventListener('click', function() {
        openPhotoUploadDialog();
    });
    
    // Profile editing functionality
    function toggleEditMode() {
        const infoValues = document.querySelectorAll('.info-value');
        const profileInfo = document.querySelector('.profile-info');
        const isEditing = profileInfo.classList.contains('editing');
        
        if (!isEditing) {
            // Switch to edit mode
            profileInfo.classList.add('editing');
            editProfileBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            
            infoValues.forEach(infoValue => {
                const currentValue = infoValue.textContent.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'edit-input';
                input.value = currentValue;
                infoValue.innerHTML = '';
                infoValue.appendChild(input);
            });
        } else {
            // Save changes and exit edit mode
            profileInfo.classList.remove('editing');
            editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            
            infoValues.forEach(infoValue => {
                const input = infoValue.querySelector('input');
                if (input) {
                    const newValue = input.value;
                    infoValue.innerHTML = newValue;
                }
            });
            
            saveProfileChanges();
        }
    }
    
    // Photo upload functionality
    function openPhotoUploadDialog() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Update both profile images
                    document.querySelector('.avatar').src = event.target.result;
                    
                    // If using initials in large profile pic, replace with image
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
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        fileInput.click();
    }
    
    // Add experience functionality
    function addExperienceListeners() {
        const addExperienceBtn = document.createElement('button');
        addExperienceBtn.className = 'btn btn-sm';
        addExperienceBtn.innerHTML = '<i class="fas fa-plus"></i> Add Experience';
        
        const workExperience = document.querySelector('.work-experience');
        const professionalSection = document.querySelector('.professional');
        
        professionalSection.querySelector('.section-header').appendChild(addExperienceBtn);
        
        addExperienceBtn.addEventListener('click', function() {
            showAddExperienceModal();
        });
    }
    
    // Create and display add experience modal
    function showAddExperienceModal() {
        // Show the modal that's already in the HTML
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            // Create modal if it doesn't exist in HTML
            const newModal = document.createElement('div');
            newModal.className = 'modal';
            
            // newModal.innerHTML = `
            //     <div class="modal-content">
            //         <span class="close-modal">&times;</span>
            //         <h3>Add New Experience</h3>
            //         <form id="add-experience-form">
            //             <div class="form-group">
            //                 <label>Job Title</label>
            //                 <input type="text" name="title" required>
            //             </div>
            //             <div class="form-group">
            //                 <label>Company Name</label>
            //                 <input type="text" name="company" required>
            //             </div>
            //             <div class="form-group">
            //                 <label>Start Date</label>
            //                 <input type="month" name="startDate" required>
            //             </div>
            //             <div class="form-group">
            //                 <label>End Date</label>
            //                 <input type="month" name="endDate">
            //                 <div class="checkbox-group">
            //                     <input type="checkbox" id="current-position">
            //                     <label for="current-position">I currently work here</label>
            //                 </div>
            //             </div>
            //             <div class="form-group">
            //                 <label>Description</label>
            //                 <textarea name="description" rows="4"></textarea>
            //             </div>
            //             <button type="submit" class="btn">Save Experience</button>
            //         </form>
            //     </div>
            // `;
            
            document.body.appendChild(newModal);
            modal = newModal;
        }
        
        // Add event listeners for modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Handle checkbox for current position
        const currentPositionCheckbox = document.getElementById('current-position');
        const endDateInput = modal.querySelector('input[name="endDate"]');
        
        currentPositionCheckbox.addEventListener('change', function() {
            endDateInput.disabled = this.checked;
            if (this.checked) {
                endDateInput.value = '';
            }
        });
        
        // Handle form submission
        const form = document.getElementById('add-experience-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const newExperience = {
                title: formData.get('title'),
                company: formData.get('company'),
                startDate: formData.get('startDate'),
                endDate: currentPositionCheckbox.checked ? 'Present' : formData.get('endDate'),
                description: formData.get('description')
            };
            
            addNewExperience(newExperience);
            modal.style.display = 'none';
            form.reset();
        });
    }
    
    // Add new experience to the DOM
    function addNewExperience(experience) {
        const workExperience = document.querySelector('.work-experience');
        
        // Format dates
        const startDate = new Date(experience.startDate);
        const startMonth = startDate.toLocaleString('default', { month: 'short' });
        const startYear = startDate.getFullYear();
        
        let dateText;
        if (experience.endDate === 'Present') {
            dateText = `${startMonth} ${startYear} - Present`;
        } else {
            const endDate = new Date(experience.endDate);
            const endMonth = endDate.toLocaleString('default', { month: 'short' });
            const endYear = endDate.getFullYear();
            dateText = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        }
        
        const newExperienceHTML = `
            <div class="experience-item">
                <div class="experience-logo">
                    <i class="fas fa-building"></i>
                </div>
                <div class="experience-details">
                    <div class="experience-title">${experience.title}</div>
                    <div class="experience-company">${experience.company}</div>
                    <div class="experience-date">${dateText}</div>
                    <div class="experience-description">
                        ${experience.description}
                    </div>
                </div>
            </div>
        `;
        
        workExperience.insertAdjacentHTML('afterbegin', newExperienceHTML);
    }
    
    // Save profile changes to backend (mock function)
    function saveProfileChanges() {
        // In a real application, this would send the data to a server
        console.log('Profile changes saved!');
        
        // Show success message to user
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = 'Profile updated successfully!';
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // Initialize experience functionality
    addExperienceListeners();
});