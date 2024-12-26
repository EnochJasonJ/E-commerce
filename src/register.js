const form = document.getElementById("form");

form.addEventListener("submit",function(event){
    event.preventDefault();
    const username = document.getElementById("Name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(username.length == 0){
        alert("Name Required");
    }
    if(email.length == 0){
        alert("Email Required");
    }
    if(password.length == 0){
        alert("Password Required");
    }
    else {
        console.log("Registered");
        localStorage.setItem('username',username);
        localStorage.setItem('email',email);
        localStorage.setItem('password',password);
        window.location.href = "login.html";
    }
});