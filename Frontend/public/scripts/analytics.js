import "../output.css";
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
    window.location.href = "/";
});
document.addEventListener("DOMContentLoaded", async () => {
    const baseURL = "http://localhost:3000";

    // Fetch and display Top Polls
    const topPollsData = await fetch(`${baseURL}/top-polls`).then(res => res.json());
    document.getElementById("top-polls").innerHTML = topPollsData
        .map(poll => `<li class="p-2 bg-gray-200 rounded">${poll.question} - ${poll.totalVotes} votes</li>`)
        .join("");

    // Fetch and display User Engagement
    const userEngagementData = await fetch(`${baseURL}/user-engagement`).then(res => res.json());
    document.getElementById("user-engagement").innerHTML = userEngagementData
        .map(user => `<li class="p-2 bg-gray-200 rounded">${user.username} - ${user.pollsCreated} polls, ${user.totalVotesCast} votes</li>`)
        .join("");

    // Fetch and display Popular Options
    const popularOptionsData = await fetch(`${baseURL}/popular-options`).then(res => res.json());
    document.getElementById("popular-options").innerHTML = popularOptionsData
        .map(option => `<li class="p-2 bg-gray-200 rounded">${option._id} - ${option.totalVotes} votes</li>`)
        .join("");

    // Fetch and display Vote Trends in Chart.js
    const voteTrendsData = await fetch(`${baseURL}/vote-trends`).then(res => res.json());
    const ctx = document.getElementById("voteChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: voteTrendsData.map(d => d._id),
            datasets: [{
                label: "Votes Per Day",
                data: voteTrendsData.map(d => d.votesOnDay),
                borderColor: "#3182ce",
                backgroundColor: "rgba(49, 130, 206, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: { responsive: true }
    });
});

//Dark and Light Mode Theme Toggling
document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeToggleLogo = document.getElementById("themeBtnLogo");
    const rootElement = document.documentElement;

    // Check localStorage for theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
        rootElement.classList.toggle("dark", storedTheme === "dark");
    } else {
        // Default to system preference if no stored theme
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        rootElement.classList.toggle("dark", prefersDark);
    }

    // Update button text based on the current theme

    themeToggleBtn.innerHTML = rootElement.classList.contains("dark")
        ? `<svg class="w-6 h-6 text-gray-800 dark:group-hover:text-gray-900 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                    </svg>`
        : `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"/>
</svg>
`;

    // Toggle theme on button click
    themeToggleBtn.addEventListener("click", function () {
        const isDark = rootElement.classList.toggle("dark");

        // Store user preference in localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Update button text
        themeToggleBtn.innerHTML = isDark
            ? `<svg class="w-6 h-6 text-gray-800 dark:group-hover:text-gray-900 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                    </svg>`
            : `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"/>
</svg>
`;
    });
});