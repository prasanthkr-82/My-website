// Simple function for the Join button
function showAlert() {
    alert("Thank you for your interest! We will contact you soon.");
}

// Console log to verify the script is running
console.log("My Website Loaded Successfully!");

document.getElementById('contactForm').addEventListener('submit', function(event) {
    // 1. Prevent the page from automatically refreshing on form submit
    event.preventDefault();

    // 2. Get form fields and reset any previous error states
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const messageInput = document.getElementById('userMessage');
    const formStatus = document.getElementById('formStatus');
    
    let isFormValid = true;

    // Hide all errors initially
    document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
    formStatus.className = 'form-status';
    formStatus.innerText = '';

    // 3. Validation Logic
    // Validate Name
    if (nameInput.value.trim() === "") {
        document.getElementById('nameError').style.display = 'block';
        isFormValid = false;
    }

    // Validate Email using standard Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        document.getElementById('emailError').style.display = 'block';
        isFormValid = false;
    }

    // Validate Phone (If provided, ensure it is numbers only and at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (phoneInput.value.trim() !== "" && !phoneRegex.test(phoneInput.value.trim())) {
        document.getElementById('phoneError').style.display = 'block';
        isFormValid = false;
    }

    // Validate Message
    if (messageInput.value.trim() === "") {
        document.getElementById('messageError').style.display = 'block';
        isFormValid = false;
    }

    // 4. Processing Valid Data
    if (isFormValid) {
        // Change button state to simulate a loading server request
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        // Simulate an API network request delay (2 seconds)
        setTimeout(() => {
            // Success response simulation
            formStatus.innerText = "Thank you! Your message has been sent successfully.";
            formStatus.classList.add('success');
            
            // Clear out form inputs completely
            document.getElementById('contactForm').reset();
            
            // Reset button state
            submitBtn.innerText = "Send Message";
            submitBtn.disabled = false;
        }, 2000);
    }
});