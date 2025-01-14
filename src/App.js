import { profile } from "./pages/ProfilePage.js";
import { loginCompenent } from "./utils/auth.js";
import { DOMAIN_NAME } from "./utils/helpers.js";

// let hasIntegrity = false;


const container = document.getElementById('containerID');


function checkIntgrity(tocken) {
    console.log("checker")
    let query = `
    {
  user {
    id
  }
}
    `
    fetch(DOMAIN_NAME + "/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tocken}`
        },
        body: JSON.stringify({ query })
    }).then(res => res.json())
        .then(data => {
            if (data.errors) throw data.errors[0]
            if ( data.data.user.length > 0 && data.data.user[0].id) {
                NavigateTo("Profile")
            }
        }).catch(err=>{
            NavigateTo("login")
            console.log(err.message)
        })
}

export function NavigateTo(page) {

    switch (page) {
        case "login":
            container.innerHTML = '';
            loginCompenent()
            break;
        case "Profile":
            container.innerHTML = '';
            profile()
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let tocken = localStorage.getItem("tocken")
    checkIntgrity(tocken); 
});
