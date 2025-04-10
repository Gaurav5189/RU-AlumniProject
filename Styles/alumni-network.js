// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sample alumni data
    const alumniData = [
        {
            name: "Sarah Johnson",
            initials: "SJ",
            title: "Software Engineer at Google",
            gradYear: "2022",
            major: "Computer Science",
            location: "San Francisco, CA",
            industry: "Technology",
            skills: ["JavaScript", "React", "Python", "Machine Learning"]
        },
        {
            name: "Michael Chen",
            initials: "MC",
            title: "Product Manager at Amazon",
            gradYear: "2020",
            major: "Business Administration",
            location: "Seattle, WA",
            industry: "Technology",
            skills: ["Product Strategy", "Team Leadership", "UX Design"]
        },
        {
            name: "Jessica Williams",
            initials: "JW",
            title: "Marketing Director at Nike",
            gradYear: "2021",
            major: "Marketing",
            location: "Portland, OR",
            industry: "Retail",
            skills: ["Social Media Marketing", "Content Strategy", "Brand Development"]
        },
        {
            name: "David Patel",
            initials: "DP",
            title: "Financial Analyst at JP Morgan",
            gradYear: "2023",
            major: "Finance",
            location: "New York, NY",
            industry: "Finance",
            skills: ["Financial Modeling", "Data Analysis", "Investment Strategies"]
        },
        {
            name: "Emily Rodriguez",
            initials: "ER",
            title: "UX Designer at Apple",
            gradYear: "2022",
            major: "Design",
            location: "Cupertino, CA",
            industry: "Technology", 
            skills: ["User Research", "Wireframing", "Prototyping", "UI Design"]
        },
        {
            name: "Robert Kim",
            initials: "RK",
            title: "Medical Resident at Mayo Clinic",
            gradYear: "2020",
            major: "Medicine",
            location: "Rochester, MN",
            industry: "Healthcare",
            skills: ["Patient Care", "Medical Research", "Clinical Documentation"]
        }
    ];

    // Reference to elements
    const alumniGrid = createAlumniGrid();
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    const gradYearFilter = document.querySelector('.filter-group:first-child select');
    const industryFilter = document.querySelector('.filter-group:last-child select');
    
    // Add event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', filterAlumni);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterAlumni();
            }
        });
    }
    
    if (gradYearFilter) {
        gradYearFilter.addEventListener('change', filterAlumni);
    }
    
    if (industryFilter) {
        industryFilter.addEventListener('change', filterAlumni);
    }
    
    // Menu item click handlers
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // You could add page navigation here
            const menuText = this.textContent.trim();
            if (menuText) {
                document.querySelector('.page-title').textContent = menuText;
            }
        });
    });
    
    // Initial render
    renderAlumni(alumniData);

    // Function to create alumni grid if it doesn't exist
    function createAlumniGrid() {
        const recentSection = document.querySelector('.recent-section');
        let grid = document.querySelector('.alumni-grid');
        
        if (!grid && recentSection) {
            grid = document.createElement('div');
            grid.className = 'alumni-grid';
            recentSection.appendChild(grid);
        }
        
        return grid;
    }

    // Filter alumni based on search and filters
    function filterAlumni() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedYear = gradYearFilter ? gradYearFilter.value : 'All Years';
        const selectedIndustry = industryFilter ? industryFilter.value : 'All Industries';
        
        const filteredAlumni = alumniData.filter(alumni => {
            // Search term filter
            const matchesSearch = 
                alumni.name.toLowerCase().includes(searchTerm) || 
                alumni.title.toLowerCase().includes(searchTerm) || 
                alumni.skills.some(skill => skill.toLowerCase().includes(searchTerm));
            
            // Year filter
            const matchesYear = selectedYear === 'All Years' || alumni.gradYear === selectedYear;
            
            // Industry filter
            const matchesIndustry = selectedIndustry === 'All Industries' || alumni.industry === selectedIndustry;
            
            return matchesSearch && matchesYear && matchesIndustry;
        });
        
        renderAlumni(filteredAlumni);
    }

    // Render alumni cards
    function renderAlumni(alumniList) {
        if (!alumniGrid) return;
        
        // Clear current alumni
        alumniGrid.innerHTML = '';
        
        if (alumniList.length === 0) {
            alumniGrid.innerHTML = '<div class="no-results">No alumni match your search criteria</div>';
            return;
        }
        
        // Create alumni cards
        alumniList.forEach(alumni => {
            const card = document.createElement('div');
            card.className = 'alumni-card';
            
            // Create random color for avatar
            const colors = ['#4a6cf7', '#f7634a', '#4af763', '#f74adc', '#f7c84a', '#4af7f7'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            card.innerHTML = `
                <div class="alumni-header">
                    <div class="alumni-avatar" style="background-color: ${randomColor}">
                        ${alumni.initials}
                    </div>
                    <div class="alumni-name">${alumni.name}</div>
                    <div class="alumni-title">${alumni.title}</div>
                </div>
                <div class="alumni-body">
                    <div class="alumni-info">
                        <div class="info-item">
                            <div class="info-label">Class Year:</div>
                            <div class="info-value">${alumni.gradYear}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Major:</div>
                            <div class="info-value">${alumni.major}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Location:</div>
                            <div class="info-value">${alumni.location}</div>
                        </div>
                    </div>
                    <div class="alumni-tags">
                        ${alumni.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="alumni-footer">
                    <button class="connect-btn">
                        <i class="fas fa-user-plus"></i>
                        Connect
                    </button>
                    <button class="connect-btn">
                        <i class="fas fa-envelope"></i>
                        Message
                    </button>
                </div>
            `;
            
            alumniGrid.appendChild(card);
        });
    }

    // Filter button handler
    const filterBtn = document.querySelector('.btn-outline');
    const filterOptions = document.querySelector('.filter-options');
    
    if (filterBtn && filterOptions) {
        filterBtn.addEventListener('click', function() {
            filterOptions.style.display = filterOptions.style.display === 'none' ? 'flex' : 'none';
        });
    }

    // Connect and message button handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.connect-btn')) {
            const btn = e.target.closest('.connect-btn');
            const isConnect = btn.innerHTML.includes('fa-user-plus');
            const alumniName = btn.closest('.alumni-card').querySelector('.alumni-name').textContent;
            
            if (isConnect) {
                alert(`Connection request sent to ${alumniName}`);
            } else {
                alert(`Message box opened for ${alumniName}`);
            }
        }
    });
});
