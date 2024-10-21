//Check if user is already logged in
window.onload = async () => {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "*");

	//Fetch UserID to know what option is selected previously and set the checked attribute of the radio input
	fetch(`http://localhost:3000/auth/user`, {
		credentials: "include",
		headers: myHeaders,
	})
		.then((response) => response.json())
		.then((user) => {
			//if already logged in the redirect to dashboard
			if (user.user._id) {
				window.location.href = "../index.html";
			}
		})
		.catch((err) => {
			console.log("Cannot get User: ", err);
		});
};

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

const registrationForm = document.getElementById("registrationForm");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");
const messageContainer = document.getElementById("messageContainer");
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
	window.location.href = "http://localhost:8080/public";
});

function validateEmail() {
	const email = emailInput.value.trim();
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
	if (!email) {
		document.getElementById("emailError").textContent = "Email is required.";
		return false;
	} else if (!emailPattern.test(email)) {
		document.getElementById("emailError").textContent = "Invalid email format.";
		return false;
	}
	document.getElementById("emailError").textContent = ""; // Clear error
	return true;
}

function validateUsername() {
	const username = usernameInput.value.trim();
	if (!username) {
		document.getElementById("usernameError").textContent =
			"Username is required.";
		return false;
	} else if (username.length < 3) {
		document.getElementById("usernameError").textContent =
			"Username must be at least 3 characters long.";
		return false;
	}
	document.getElementById("usernameError").textContent = ""; // Clear error
	return true;
}

function validatePassword() {
	const password = passwordInput.value;
	const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Password requirements
	if (!password) {
		document.getElementById("passwordError").textContent =
			"Password is required.";
		return false;
	} else if (!passwordPattern.test(password)) {
		document.getElementById("passwordError").textContent =
			"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
		return false;
	}
	document.getElementById("passwordError").textContent = ""; // Clear error
	return true;
}

function validateConfirmPassword() {
	const password = passwordInput.value;
	const confirmPassword = confirmPasswordInput.value;
	if (!confirmPassword) {
		document.getElementById("confirmPasswordError").textContent =
			"Please confirm your password.";
		return false;
	} else if (password !== confirmPassword) {
		document.getElementById("confirmPasswordError").textContent =
			"Passwords do not match.";
		return false;
	}
	document.getElementById("confirmPasswordError").textContent = ""; // Clear error
	return true;
}

function checkFormValidity() {
	const isEmailValid = validateEmail();
	const isUsernameValid = validateUsername();
	const isPasswordValid = validatePassword();
	const isConfirmPasswordValid = validateConfirmPassword();

	// Enable or disable submit button based on validations
	submitBtn.disabled = !(
		isEmailValid &&
		isUsernameValid &&
		isPasswordValid &&
		isConfirmPasswordValid
	);
	if (submitBtn.disabled) {
		submitBtn.classList.add(
			"opacity-50",
			"cursor-not-allowed",
			"text-white",
			"dark:text-white",
			"dark:bg-blue-200"
		);
		submitBtn.classList.remove("opacity-100", "cursor-pointer");
	} else {
		submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
		submitBtn.classList.add(
			"opacity-100",
			"cursor-pointer",
			"text-white",
			"dark:text-blue-700",
			"dark:bg-blue-200"
		);
	}

	return (
		isConfirmPasswordValid && isUsernameValid && isPasswordValid && isEmailValid
	);
}

// Add event listeners for input fields
emailInput.addEventListener("input", checkFormValidity);
usernameInput.addEventListener("input", checkFormValidity);
passwordInput.addEventListener("input", checkFormValidity);
confirmPasswordInput.addEventListener("input", checkFormValidity);

// Disable form fields and show loading message
function disableForm() {
	emailInput.disabled = true;
	usernameInput.disabled = true;
	passwordInput.disabled = true;
	confirmPasswordInput.disabled = true;
	submitBtn.disabled = true;
	submitBtn.classList.remove("dark:text-blue-700");
	submitBtn.classList.add("opacity-50", "cursor-not-allowed", "text-white");

	messageContainer.textContent = "Submitting your registration...";
	messageContainer.classList.remove("hidden");
}

// Enable form fields and hide loading message
function enableForm() {
	emailInput.disabled = false;
	usernameInput.disabled = false;
	passwordInput.disabled = false;
	confirmPasswordInput.disabled = false;
	submitBtn.disabled = false;
	submitBtn.classList.remove("opacity-50", "cursor-not-allowed", "text-white");
	submitBtn.classList.add("dark:text-blue-700");

	messageContainer.classList.add("hidden");
}

// Handle form submission
registrationForm.addEventListener("submit", async (event) => {
	event.preventDefault(); // Prevent the default form submission

	if (!checkFormValidity()) {
		messageContainer.textContent = "Please fill in all fields correctly.";
		messageContainer.classList.remove("hidden");
		return;
	}

	disableForm(); // Disable form fields while submitting

	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "*");

	try {
		const data = await fetch("http://localhost:3000/auth/register", {
			method: "POST",
			body: JSON.stringify({
				email: emailInput.value,
				username: usernameInput.value,
				password: passwordInput.value,
			}),
			headers: myHeaders,
			credentials: "include",
		});

		// Simulate a delay after the fetch request
		setTimeout(async () => {
			const response = await data.json();
			enableForm(); // Re-enable form fields

			// Display the response message to the user
			if (data.status === 201) {
				messageContainer.textContent =
					"Registration successful! You can Login Now";
				messageContainer.classList.remove("hidden");
				// Optionally redirect the user or reset the form
				registrationForm.reset(); // Clear the form fields
			} else {
				messageContainer.textContent = `Registration failed: ${response.error}`;
				messageContainer.classList.remove("hidden");
			}
		}, 2000); // Delay of 2000 milliseconds (2 seconds)
	} catch (err) {
		messageContainer.textContent = `Registration failed: Try Again After Some Time`;
		messageContainer.classList.remove("hidden");
		console.log(err);
	}
});
