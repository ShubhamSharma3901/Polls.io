import "../output.css";
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
      // console.log(user);
      if (user.user._id) {
        window.location.href = "../../index.html";
      }
    })
    .catch((err) => {
      console.log("Cannot get User: ", err);
    });
};

const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
  window.location.href = "/";
});

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Show the loading message and disable input fields
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.setAttribute("disabled", true); // Disable button
    submitBtn.classList.remove("dark:text-hover");
    submitBtn.textContent = "Logging in..."; // Show loading state in button text

    document.getElementById("username").setAttribute("disabled", true);
    document.getElementById("password").setAttribute("disabled", true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Access-Control-Allow-Origin", "*");

      // Make the fetch request for login
      const data = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: username, password: password }),
        headers: myHeaders,
        credentials: "include",
      });

      const response = await data.json();

      // Simulate a delay using setTimeout to show the loading state longer
      setTimeout(() => {
        if (data.status !== 200) {
          // Re-enable inputs and show error message
          submitBtn.removeAttribute("disabled"); // Re-enable button
          submitBtn.textContent = "Log in"; // Reset button text
          submitBtn.classList.add("dark:text-hover");
          document.getElementById("username").removeAttribute("disabled");
          document.getElementById("password").removeAttribute("disabled");

          // Show error styles
          document.getElementById("username").classList.add("border-red-600");
          document.getElementById("password").classList.add("border-red-600");
          document.getElementById("passwordError").style.display =
            "inline-block";
          document.getElementById("passwordError").innerText =
            `${response.error}`;
        } else if (data.status === 200) {
          // Success
          submitBtn.textContent = "Success!";
          submitBtn.style.backgroundColor = "green";
          submitBtn.classList.add("dark:text-green-700");
          document.getElementById("passwordError").style.display = "none";

          // Remove error styles
          document
            .getElementById("username")
            .classList.remove("border-red-600");
          document
            .getElementById("password")
            .classList.remove("border-red-600");

          // Redirect
          window.location.href = "../../index.html";
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      submitBtn.removeAttribute("disabled"); // Re-enable button if there's an error
      submitBtn.textContent = "Log in"; // Reset button text
      document.getElementById("username").removeAttribute("disabled");
      document.getElementById("password").removeAttribute("disabled");

      // Optionally, showing a general error message
      document.getElementById("passwordError").style.display = "inline-block";
      document.getElementById("passwordError").innerText =
        "Something went wrong!";
    }
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
