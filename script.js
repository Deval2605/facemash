document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const profilesGrid = document.getElementById('profiles-grid');
    const imageInput = document.getElementById('image');
    const customFileBtn = document.getElementById('custom-file-btn');
    const fileChosen = document.getElementById('file-chosen');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');

    // Load profiles on startup
    loadProfiles();

    // Custom file input trigger
    customFileBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // Image preview logic
    imageInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileChosen.textContent = file.name;

            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        } else {
            fileChosen.textContent = "No file chosen";
            imagePreviewContainer.classList.add('hidden');
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const description = document.getElementById('description').value;
        const imageFile = imageInput.files[0];

        if (!imageFile) return;

        // Convert image to base64
        const imageData = await toBase64(imageFile);

        const newProfile = {
            id: Date.now(),
            name,
            age,
            description,
            image: imageData,
            timestamp: new Date().toISOString()
        };

        saveProfile(newProfile);
        profileForm.reset();
        fileChosen.textContent = "No file chosen";
        imagePreviewContainer.classList.add('hidden');

        // Refresh display
        loadProfiles();

        // Smooth scroll to profiles
        document.querySelector('.profiles-section').scrollIntoView({ behavior: 'smooth' });
    });

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function saveProfile(profile) {
        const profiles = JSON.parse(localStorage.getItem('facemash_profiles') || '[]');
        // Add to the beginning
        profiles.unshift(profile);

        try {
            localStorage.setItem('facemash_profiles', JSON.stringify(profiles));
        } catch (e) {
            alert('Storage limit reached! Local storage can only hold a few profiles with images.');
            console.error('LocalStorage error:', e);
        }
    }

    function loadProfiles() {
        const profiles = JSON.parse(localStorage.getItem('facemash_profiles') || '[]');

        if (profiles.length === 0) {
            profilesGrid.innerHTML = `
                <div class="empty-state">
                    <p>No profiles yet. Be the first to upload one!</p>
                </div>
            `;
            return;
        }

        profilesGrid.innerHTML = profiles.map(profile => `
            <div class="profile-card">
                <div class="card-image-wrapper">
                    <img src="${profile.image}" alt="${profile.name}">
                </div>
                <div class="profile-header">
                    <h3 class="profile-name">${profile.name}</h3>
                    <span class="profile-age">${profile.age} yrs</span>
                </div>
                <p class="profile-desc">${profile.description}</p>
            </div>
        `).join('');
    }
});
