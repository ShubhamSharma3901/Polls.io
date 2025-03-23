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