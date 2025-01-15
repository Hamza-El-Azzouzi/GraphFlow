import { NavigateTo } from "../App.js";
import { DOMAIN_NAME } from "../utils/helpers.js";

export function loginCompenent() {
    const container = document.getElementById('containerID');
    container.innerHTML = ""
    const loginForm = document.createElement('div');
    loginForm.className = 'login-form';

    const heading = document.createElement('h2');
    heading.textContent = 'Login';
    loginForm.appendChild(heading);

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username or Email';
    loginForm.appendChild(usernameInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';
    loginForm.appendChild(passwordInput);

    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginForm.appendChild(loginButton);

    const loginError = document.createElement('p');
    loginError.id = 'login-error';
    loginError.textContent = 'Invalid credentials';
    loginForm.appendChild(loginError);

    container.appendChild(loginForm);
    loginButton.addEventListener("click", (event) => {
        event.preventDefault()
        const username = usernameInput.value;
        const password = passwordInput.value;
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
                  NavigateTo("Profile")
            })
            .catch(err => {
                console.log(err)
                document.getElementById('login-error').style.display = 'block';
                document.getElementById('login-error').textContent = err
            })
    })

}