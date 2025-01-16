export function overTimeXp(data) {
    const graphContainer = document.createElement('div');
    graphContainer.className = 'graph';
    let accumulatedXP = 0;
    const sectionStat = document.querySelector(".stats-section");
    const processedData = Object.entries(data)
        .map(([timestamp, xp]) => {
            accumulatedXP += xp;
            return {
                date: new Date(timestamp),
                xp: accumulatedXP / 1000,
            };
        })
        .sort((a, b) => a.date - b.date);

    const svgWidth = 800;
    const svgHeight = 400;
    const padding = 90;

    const minDate = processedData[0].date;
    const maxDate = processedData[processedData.length - 1].date;
    const minXP =  processedData[0].xp;
    const maxXP = processedData[processedData.length - 1].xp;

    const totalWidth = svgWidth - 2 * padding;
    const normalizedData = processedData.map((d) => ({
        x: ((d.date - minDate) / (maxDate - minDate)) * (totalWidth) + padding,
        y: svgHeight - ((d.xp - minXP) / (maxXP - minXP)) * (svgHeight - 2 * padding) - padding,
    }));

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "xp-graph";
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("width", "100%");


    const points = normalizedData.map((d) => `${d.x},${d.y}`).join(" ");
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", points);
    polyline.setAttribute("stroke", "#3498db");
    polyline.setAttribute("stroke-width", "3");
    polyline.setAttribute("fill", "none");
    svg.appendChild(polyline);

    normalizedData.forEach((d, i) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", d.x);
        circle.setAttribute("cy", d.y);
        circle.setAttribute("r", "10");
        circle.setAttribute("fill", "#3498db");
        const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "title");
        tooltip.textContent = `Date: ${formatDate(processedData[i].date)}, XP: ${processedData[i].xp.toFixed(1)}`;
        circle.appendChild(tooltip);
        svg.appendChild(circle);
    });

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", svgHeight - padding);
    xAxis.setAttribute("x2", svgWidth - padding);
    xAxis.setAttribute("y2", svgHeight - padding);
    xAxis.setAttribute("stroke", "#000");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", svgHeight - padding);
    yAxis.setAttribute("stroke", "#000");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const y = svgHeight - padding - (i * (svgHeight - 2 * padding)) / yTicks;
        const xpValue = minXP + (i * (maxXP - minXP)) / yTicks;

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", padding - 40);
        label.setAttribute("y", y + 5);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("font-size", "12");
        label.textContent = `${xpValue.toFixed(1)}kb`;
        svg.appendChild(label);

        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", padding);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("x2", svgWidth - padding);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("stroke", "#ccc");
        gridLine.setAttribute("stroke-width", "0.5");
        svg.appendChild(gridLine);
    }

    graphContainer.appendChild(svg);
    sectionStat.appendChild(graphContainer);
}

const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
};
export function logout() {
    localStorage.removeItem("tocken")
    NavigateTo("login")
}

export function extractSkills(data) {
    const maxAmounPerSkill = {};
    const sectionStat = document.querySelector(".stats-section");

    data.data.transaction.forEach((transaction) => {
        if (transaction.type.startsWith("skill_")) {
            const skillName = transaction.type;
            const Amount = transaction.amount; 

            if (maxAmounPerSkill[skillName]) {
                if (Amount > maxAmounPerSkill[skillName]) {
                    maxAmounPerSkill[skillName] = Amount;
                }
            } else {
                maxAmounPerSkill[skillName] = Amount;
            }
        }
    });


    if (Object.keys(maxAmounPerSkill).length === 0) {
        console.error("No skills found in the data.");
        return;
    }

    const { technologies, technicalSkills } = categorizeSkills(maxAmounPerSkill);


    const techContainer = document.createElement("div");
    techContainer.className = "graph";
    const skillContainer = document.createElement("div");
    skillContainer.className = "graph";

    generateBarChart(technologies, techContainer, "Technologies");
    generateBarChart(technicalSkills, skillContainer, "Technical Skills");

    sectionStat.appendChild(techContainer);
    sectionStat.appendChild(skillContainer);
}

export function generateBarChart(data, container, title) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "500");
    svg.setAttribute("height", "500");
    svg.setAttribute("viewBox", "0 0 500 500");

    const margin = { top: 50, right: 10, bottom: 50, left: 10 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        "#E7E9ED", "#8C564B", "#17BECF", "#BCBD22", "#7F7F7F", "#1F77B4",
        "#FF7F0E", "#2CA02C"
    ];

    const titleText = document.createElementNS(svgNS, "text");
    titleText.setAttribute("x", width / 2 + margin.left);
    titleText.setAttribute("y", margin.top / 2);
    titleText.setAttribute("class", "chart-title");
    titleText.setAttribute("text-anchor", "middle");
    titleText.textContent = title;
    svg.appendChild(titleText);
    const tooltip = document.createElementNS(svgNS, "text");
    tooltip.setAttribute("class", "tooltip");
    tooltip.setAttribute("visibility", "hidden");
    tooltip.setAttribute("text-anchor", "middle");
    svg.appendChild(tooltip);
    const maxAmount = Math.max(...Object.values(data));

    const barWidth = width / Object.keys(data).length;
    const barHeightScale = height / maxAmount;

    Object.entries(data).forEach(([skill, amount], index) => {
        const barX = margin.left + index * barWidth;
        const barY = height + margin.top - amount * barHeightScale;
        const barHeight = amount * barHeightScale;

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", barX);
        rect.setAttribute("y", barY);
        rect.setAttribute("width", barWidth - 10)
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", colors[index % colors.length]);
        rect.addEventListener("mouseenter", () => {
            tooltip.setAttribute("x", barX + (barWidth - 5) / 2);
            tooltip.setAttribute("y", barY - 10);
            tooltip.setAttribute("visibility", "visible");
            tooltip.textContent = `${amount} %`;
        });
        svg.appendChild(rect);

        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", barX + (barWidth - 5) / 2);
        label.setAttribute("y", height + margin.top + 20);
        label.setAttribute("class", "skill-label");
        label.setAttribute("text-anchor", "middle");
        label.textContent = skill.replace("skill_", "");
        svg.appendChild(label);
    });

    container.appendChild(svg);
}

function categorizeSkills(skills) {
    const technologies = {};
    const technicalSkills = {};

    const techKeywords = [
        "go", "js", "python", "java", "docker", "c",
        "unix", "html", "css", "sql", "git", "graphql", "cpp"
    ];
    for (const [skill, xp] of Object.entries(skills)) {
        const skillName = skill.replace("skill_", "").toLowerCase();
        if (techKeywords.some(keyword => skillName === keyword)) {
            technologies[skill] = xp;
        } else {
            technicalSkills[skill] = xp;
        }
    }

    return { technologies, technicalSkills };
}

