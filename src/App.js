import { DOMAIN_NAME } from "./utils/helpers.js";
let isLogged = false

export function init() {
    let tocken = localStorage.getItem("tocken")
    checkIntgrity(tocken)
}
function checkIntgrity(tocken) {
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
            console.log(data)
            if ( data.data.user.length > 0 && data.data.user[0].id) {
                document.getElementById('login-error').style.display = 'none';
                document.querySelector('.login-form').style.display = 'none';
                document.querySelector('.profile-section').style.display = 'block';
                document.querySelector('.stats-section').style.display = 'block';
                document.querySelector('.logout-btn').style.display = 'block'
            }

        }).catch(err=>{
            console.log(err.message)
        })
}