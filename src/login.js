document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form");
    const welcomeMessage = document.getElementById("welcome-message");
    const welcomeName = document.getElementById("welcome-name");
    const logoutButton = document.getElementById("logout");

    // Check if user is logged in
    const loggedInUser = localStorage.getItem("username");

    

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("Name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (username.length == 0 || email.length == 0 || password.length == 0) {
            alert("Please fill in all the fields");
            return;
        }

        // Save user details in localStorage for simplicity
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        alert("Login successful!");

        // Show welcome message
        form.classList.add("hidden");
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = username;
    });

    if (loggedInUser) {
        // If user is already logged in, show the welcome message
        console.log("User is logged in:", loggedInUser);
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = loggedInUser;
        form.classList.add("hidden"); // Hide the login form
    } else {
        // If no user is logged in, show the login form
        console.log("No user logged in");
        form.classList.remove("hidden");
        welcomeMessage.classList.add("hidden");
    }

    // Handle logout
    logoutButton.addEventListener("click", () => {
        // Clear localStorage and reload page
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        alert("Logged out successfully!");
        location.reload();
    });
});
