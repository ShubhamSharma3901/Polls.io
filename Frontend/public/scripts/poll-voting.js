let userId;
const params = new URLSearchParams(window.location.search);
const pollId = params.get("id");

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
	window.location.href = "http://localhost:8080/public";
});

//Fetch UserID to know what option is selected previously and set the checked attribute of the radio input
fetch(`http://localhost:3000/auth/user`, {
	credentials: "include",
	headers: myHeaders,
})
	.then((response) => response.json())
	.then((user) => {
		// console.log(user);
		userId = user.user._id;
	})
	.catch((err) => {
		alert("You Need to Login First");
		window.location.href = "http://localhost:8080/public/auth/login";
		console.log("Cannot get User: ", err);
	});

// Initialize WebSocket connection
const socket = io("http://localhost:3000");

// Fetch poll data and display the question and options

fetch(`http://localhost:3000/polls/${pollId}`, {
	credentials: "include",
	headers: myHeaders,
})
	.then((response) => response.json())
	.then((poll) => {
		// Display poll question
		document.getElementById("pollQuestion").textContent = poll.question;

		// Display poll options as radio buttons
		const pollOptionsContainer = document.getElementById("pollOptions");
		poll.options.forEach((option) => {
			const optionElement = document.createElement("div");
			optionElement.classList.add("custom-radio-option"); // Add class for styling
			optionElement.innerHTML = `
            <input 
              type="radio" 
              id="${option.name}" 
              name="pollOption" 
              value="${option.name}" 
              ${
								option.users.find((usr) => usr._id === userId) ? "checked" : ""
							} 
              required 
              aria-checked="${
								option.users.find((usr) => usr._id === userId)
									? "true"
									: "false"
							}"
              aria-labelledby="label-${option.name}"
            >
            <label 
              for="${option.name}" 
              id="label-${option.name}" 
              class="radio-label"
              tabindex="0"
              role="radio"
              aria-label="${option.name}"
            >
              ${option.name}
            </label>
          `;
			const labelElement = optionElement.querySelector("label");
			labelElement.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault(); // Prevent default spacebar scrolling behavior
					const radioInput = optionElement.querySelector('input[type="radio"]');
					radioInput.checked = true;
					radioInput.dispatchEvent(new Event("change")); // Trigger any change event listeners if needed
				}
			});
			pollOptionsContainer.appendChild(optionElement);
		});

		// Initially load the real-time results
		updatePollResults(poll);
		updateVoterList(poll);
	})
	.catch((err) => {
		console.log("Cannot get Poll: ", err);
	});

// Event listener for vote submission
document
	.getElementById("voteForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault();

		const selectedOption = document.querySelector(
			'input[name="pollOption"]:checked'
		).value;
		if (
			selectedOption === "" ||
			!selectedOption ||
			selectedOption === undefined
		) {
			alert("Select One Option to Proceed");
		}
		try {
			const resposne = await fetch(
				`http://localhost:3000/polls/vote/${pollId}`,
				{
					method: "POST",
					headers: myHeaders,
					credentials: "include",
					body: JSON.stringify({ option: selectedOption }),
				}
			);
			const data = await resposne.json();

			if (data && resposne.status === 200) {
				// WebSocket will handle updating the UI dynamically
				console.log("Vote cast successfully");
			} else {
				if (data.error) {
					alert(data.error);
				} else alert("Error casting vote.");
			}
		} catch (err) {
			console.log("Error casting vote: ", err);
		}
	});

// Function to dynamically update the results section
function updatePollResults(poll) {
	const resultsContainer = document.getElementById("results");
	const totalVotesContainer = document.getElementById("totalVotes");
	resultsContainer.innerHTML = ""; // Clear previous results

	const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

	totalVotesContainer.textContent = `${totalVotes}`;

	poll.options.forEach((option) => {
		const votePercentage =
			totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) : 0;

		const resultElement = document.createElement("div");
		resultElement.classList.add(
			"border",
			"border-gray-300", // Default border for light mode
			"dark:border-gray-700", // Dark mode border
			"rounded-md",
			"p-4",
			"space-y-4",
			"bg-white", // Default background for light mode
			"dark:bg-gray-800" // Dark mode background
		);

		resultElement.innerHTML = `
          <h3 class="text-lg font-semibold text-primary dark:text-blue-300">${option.name}</h3>
          <div class="flex items-center">
            <div class="w-full bg-gray-200 h-4 rounded-full overflow-hidden dark:bg-gray-700"> 
              <div class="bg-primary h-full dark:bg-blue-300" style="width: ${votePercentage}%"></div>
            </div>
            <span class="ml-4 text-sm text-gray-600 dark:text-gray-200">${votePercentage}%</span> 
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">Votes: ${option.votes}</p> 
        `;

		resultsContainer.appendChild(resultElement);
	});
}

//Function to update voters table
function updateVoterList(poll) {
	const voterListContainer = document.getElementById("voterList");
	voterListContainer.innerHTML = ""; // Clear previous voter list

	poll.options.forEach((option) => {
		option.users.forEach((user) => {
			const rowElement = document.createElement("tr");
			rowElement.classList.add("border-t");

			rowElement.innerHTML = `
          <td class="py-2 px-4  text-center">${user.name}</td>
          <td class="py-2 px-4  text-center">${option.name}</td>
        `;
			voterListContainer.appendChild(rowElement);
		});
	});
}

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
			"(prefers-color-scheme: dark)"
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
// WebSocket event to handle real-time vote updates

socket.on("pollUpdated", function (pollData) {
	if (pollData._id === pollId) {
		// Update poll data with new vote information
		updatePollResults(pollData);
		updateVoterList(pollData);
	}
});
