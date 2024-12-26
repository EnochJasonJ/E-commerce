document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form");
    const welcomeMessage = document.getElementById("welcome-message");
    const welcomeName = document.getElementById("welcome-name");
    const logoutButton = document.getElementById("logout");
<<<<<<< HEAD
    const loggedInUser = localStorage.getItem("username");
=======

    // Check if user is logged in
    const loggedInUser = localStorage.getItem("username");

    

    // Handle form submission
>>>>>>> 6bb132984b4c8e255f24e31c56b631d54c5ad312
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("Name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (username.length == 0 || email.length == 0 || password.length == 0) {
            alert("Please fill in all the fields");
            return;
        }
<<<<<<< HEAD
=======

        // Save user details in localStorage for simplicity
>>>>>>> 6bb132984b4c8e255f24e31c56b631d54c5ad312
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        alert("Login successful!");
<<<<<<< HEAD
=======

        // Show welcome message
>>>>>>> 6bb132984b4c8e255f24e31c56b631d54c5ad312
        form.classList.add("hidden");
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = username;
    });

    if (loggedInUser) {
<<<<<<< HEAD
        console.log("User is logged in:", loggedInUser);
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = loggedInUser;
        form.classList.add("hidden");
    } else {
=======
        // If user is already logged in, show the welcome message
        console.log("User is logged in:", loggedInUser);
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = loggedInUser;
        form.classList.add("hidden"); // Hide the login form
    } else {
        // If no user is logged in, show the login form
>>>>>>> 6bb132984b4c8e255f24e31c56b631d54c5ad312
        console.log("No user logged in");
        form.classList.remove("hidden");
        welcomeMessage.classList.add("hidden");
    }
<<<<<<< HEAD
    logoutButton.addEventListener("click", () => {
=======

    // Handle logout
    logoutButton.addEventListener("click", () => {
        // Clear localStorage and reload page
>>>>>>> 6bb132984b4c8e255f24e31c56b631d54c5ad312
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        alert("Logged out successfully!");
        location.reload();
    });
});
