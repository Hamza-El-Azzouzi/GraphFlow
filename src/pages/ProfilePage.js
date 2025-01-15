// import { NavigateTo } from "../App.js";
import { DOMAIN_NAME } from "../utils/helpers.js";
import { extractSkills, overTimeXp} from "../utils/chart.js";
import { loginCompenent } from "./LoginPage.js";
let xpData = {}
let totatXpAmount = 0
let ratioUp = 0
let ratioDown = 0
let projectDone = 0
let xpOverTime = {}

export function profile(userID) {
    let tocken = localStorage.getItem("tocken")
    const container = document.getElementById('containerID');
    const login = document.querySelector(".login-form")
    if (login) container.removeChild(login)
    const header = document.createElement('h1');
    header.textContent = 'GraphQL Profile Dashboard';
    container.appendChild(header);

    const profileSection = document.createElement('div');
    profileSection.className = 'profile-section';
    const profileHeader = document.createElement('h2');
    profileHeader.textContent = 'Welcome, ';
    const profileName = document.createElement('span');
    profileName.id = 'profile-name';
    profileName.textContent = 'John Doe';
    profileHeader.appendChild(profileName);
    profileSection.appendChild(profileHeader);
    let query = `
    {
   user{
    lastName
    firstName
  }
}`
    fetch(DOMAIN_NAME + "/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tocken}`
        },
        body: JSON.stringify({ query })
    }).then(res => {
        return res.json()
    })
        .then(data => {

            if (data.error) throw data.error
            profileName.textContent = data.data.user[0].lastName + " " + data.data.user[0].firstName
        })
        .catch(err => {
            console.error(err)
        })


    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';

    const totalXP = document.createElement('div');
    totalXP.innerHTML = '<strong>Total XP</strong> <span id="total-xp"></span>';
    profileInfo.appendChild(totalXP);

    const auditRatio = document.createElement('div');
    auditRatio.innerHTML = '<strong>Audit Ratio</strong> <span id="audit-ratio"></span>';
    profileInfo.appendChild(auditRatio);

    const projectsCompleted = document.createElement('div');
    projectsCompleted.innerHTML = '<strong>Projects Completed</strong> <span id="projects-completed"></span>';
    profileInfo.appendChild(projectsCompleted);

    const skills = document.createElement('div');
    skills.innerHTML = '<strong>Skills</strong> <span id="skills">JavaScript, GraphQL, SVG</span>';
    profileInfo.appendChild(skills);
    let xpQuery = `
    {
        transaction{
            createdAt
            amount
            type
            event{
                object{
      	            name
                    type
                }
            }
        }
    }    
    `

    fetch(DOMAIN_NAME + "/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tocken}`
        },
        body: JSON.stringify({ query: xpQuery })
    }).then(res => {
        return res.json()
    })
        .then(data => {
            if (data.error) throw data.error
            xpData = data.data
            xpData.transaction.forEach(tr => {
                if (tr.type === "xp" && tr.event.object.type === "module") { totatXpAmount += Number(tr.amount); projectDone++; xpOverTime[tr.createdAt] = tr.amount }
                if (tr.type === "down" && tr.event.object.type === "module") ratioDown += Number(tr.amount)
                if (tr.type === "up" && tr.event.object.type === "module") ratioUp += Number(tr.amount)
            })
            overTimeXp(xpOverTime)
            extractSkills(data)
            document.getElementById("total-xp").textContent = totatXpAmount / 1000 + (totatXpAmount / 1000 > 1000 ? " MB" : " KB")
            document.getElementById("audit-ratio").textContent = Math.ceil((ratioUp / ratioDown) * 10) / 10
            document.getElementById("projects-completed").textContent = projectDone

        })
        .catch(err => {
            console.error(err)
        })
    profileSection.appendChild(profileInfo);
    container.appendChild(profileSection);

    const statsSection = document.createElement('div');
    statsSection.className = 'stats-section';
    statsSection.innerHTML = `
        <h2>Your Statistics</h2>
    `;
    container.appendChild(statsSection);

    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-btn';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener("click", logout)
    profileHeader.appendChild(logoutButton);


}
function logout() {
    localStorage.removeItem("tocken")
    loginCompenent()
    xpData = {}
    totatXpAmount = 0
    ratioUp = 0
    ratioDown = 0
    projectDone = 0
}
