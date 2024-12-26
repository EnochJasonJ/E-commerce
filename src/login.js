document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form");
    const welcomeMessage = document.getElementById("welcome-message");
    const welcomeName = document.getElementById("welcome-name");
    const logoutButton = document.getElementById("logout");
    const loggedInUser = localStorage.getItem("username");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("Name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (username.length == 0 || email.length == 0 || password.length == 0) {
            alert("Please fill in all the fields");
            return;
        }
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        alert("Login successful!");
        form.classList.add("hidden");
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = username;
    });

    if (loggedInUser) {
        console.log("User is logged in:", loggedInUser);
        welcomeMessage.classList.remove("hidden");
        welcomeName.textContent = loggedInUser;
        form.classList.add("hidden");
    } else {
        console.log("No user logged in");
        form.classList.remove("hidden");
        welcomeMessage.classList.add("hidden");
    }
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        alert("Logged out successfully!");
        location.reload();
    });
});
