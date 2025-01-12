import { DOMAIN_NAME } from "./helpers.js";
export function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username.length === 0 || password.length === 0) {
        document.getElementById('login-error').style.display = 'block';
        return
    }
    fetch(DOMAIN_NAME + "/api/auth/signin", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
    }).then(res => {
        return res.json()
    })
        .then(data => {
            if (data.error) throw data.error
            localStorage.setItem("tocken", data)
            document.getElementById('login-error').style.display = 'none';
            document.querySelector('.login-form').style.display = 'none';
            document.querySelector('.profile-section').style.display = 'block';
            document.querySelector('.stats-section').style.display = 'block';
            document.querySelector('.logout-btn').style.display = 'block';
        })
        .catch(err => {
            document.getElementById('login-error').style.display = 'block';
            document.getElementById('login-error').textContent = err
        })

    if ((username === 'user' || username === 'user@example.com') && password === 'password') {

    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}
export function logout() {
    document.querySelector('.logout-btn').addEventListener("click", () => {
        localStorage.removeItem("tocken")
        console.log(document.querySelector('.logout-btn'))
        document.querySelector('.login-form').style.display = 'block';
        document.querySelector('.profile-section').style.display = 'none';
        document.querySelector('.stats-section').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    })

}

// function loginCompenent() {
//     const container = document.querySelector('.container');
//     const loginForm = document.createElement('div');
//     loginForm.className = 'login-form';

//     const heading = document.createElement('h2');
//     heading.textContent = 'Login';
//     loginForm.appendChild(heading);

//     const usernameInput = document.createElement('input');
//     usernameInput.type = 'text';
//     usernameInput.id = 'username';
//     usernameInput.placeholder = 'Username or Email';
//     loginForm.appendChild(usernameInput);

//     const passwordInput = document.createElement('input');
//     passwordInput.type = 'password';
//     passwordInput.id = 'password';
//     passwordInput.placeholder = 'Password';
//     loginForm.appendChild(passwordInput);

//     const loginButton = document.createElement('button');
//     loginButton.id = 'login-button';
//     loginButton.textContent = 'Login';
//     loginForm.appendChild(loginButton);

//     const loginError = document.createElement('p');
//     loginError.id = 'login-error';
//     loginError.textContent = 'Invalid credentials';
//     loginForm.appendChild(loginError);

//     container.appendChild(loginForm);
// }