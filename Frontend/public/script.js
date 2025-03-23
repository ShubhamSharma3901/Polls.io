const socket = io("http://localhost:3000");
import "./output.css";
// DOM Elements
const btnGrp = document.getElementById("btnGroup");
const loginBtn = document.createElement("button");
const logoutBtn = document.createElement("button");
const registerBtn = document.createElement("button");
const analyticsBtn = document.createElement("button");

const greet = document.getElementById("greeting");

//User Session Variables
var userName;
var userID;

//Retrieve User details on first load
document.addEventListener("DOMContentLoaded", async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");
  try {
    if (navigator.cookieEnabled) {
      //Fetch call to get the current user
      const response = await fetch("http://localhost:3000/auth/user", {
        method: "GET",
        credentials: "include",
        headers: myHeaders,
      });

      //If user found
      if (response.status === 200) {
        const container = document.getElementById("main-container");

        container.classList.remove("hidden");
        container.classList.add("flex");

        const data = await response.json();
        userName = data.user.username;

        userID = data.user._id;

        logoutBtn.innerText = "Logout";
        logoutBtn.classList.add(
          "dark:bg-[#89BBEE]",
          "dark:text-hover",
          "dark:hover:bg-[#89BBEE]",
          "dark:hover:text-hover",
          "dark:hover:scale-95",
          "transition-all",
          "hover:scale-95",
          "xsPhone:px-3",
          "xsPhone:px-2",
          "smTablet:px-4",
        );

        logoutBtn.addEventListener("click", async () => {
          try {
            const response = await fetch("http://localhost:3000/auth/logout", {
              method: "GET",
              credentials: "include",
              headers: myHeaders,
            });
            if (response.status === 200) {
              window.location.href = "/";
            }
          } catch (er) {
            console.log("Logout Error: ", er);
          }
        });

        btnGrp.appendChild(logoutBtn);

        greet.innerHTML = `<h1 class="xsPhone:text-[min(8vh,8vw)] smTablet:text-[min(6vh,6vw)] smLaptop:text-[min(7vh,7vw)] text-wrap">Hello, ${userName}</h1>`;
      } else {
        const defaultContent = document.getElementById("default-content");
        const defaultContentWrapper = document.getElementById(
          "default-content-main",
        );
        defaultContent.classList.remove("hidden");
        defaultContent.classList.add("flex");

        //If user not logged in or not found
        loginBtn.innerText = "Login";
        registerBtn.innerText = "Register Now";
        analyticsBtn.innerText = "View Analytics";

        registerBtn.classList.add(
          "text-primary",
          "bg-white",
          "border-2",
          "border-primary",
          "hover:bg-neutral-100",
          "xsPhone:px-3",
          "xsPhone:px-2",
          "smTablet:px-4",
          "mt-4",
        );

        analyticsBtn.classList.add(
          "border-2",
          "border-primary",
          "xsPhone:px-3",
          "xsPhone:px-2",
          "smTablet:px-4",
          "dark:bg-blue-200",
          "dark:text-blue-700",
          "dark:hover:bg-blue-300",
          "dark:hover:text-blue-700",
        );

        loginBtn.classList.add(
          "border-2",
          "border-primary",
          "xsPhone:px-3",
          "xsPhone:px-2",
          "smTablet:px-4",
          "dark:bg-blue-200",
          "dark:text-blue-700",
          "dark:hover:bg-blue-300",
          "dark:hover:text-blue-700",
        );

        loginBtn.addEventListener("click", async () => {
          window.location.href = `/public/auth/login.html`;
        });

        registerBtn.addEventListener("click", async () => {
          window.location.href = "/public/auth/register.html";
        });

        analyticsBtn.addEventListener("click", async () => {
          window.location.href = "/public/analytics";
        });

        // btnGrp.removeChild(logoutBtn);
        defaultContentWrapper.appendChild(registerBtn);
        btnGrp.appendChild(loginBtn);
        btnGrp.appendChild(analyticsBtn);
      }
    } else {
      console.log("Cookies are disabled");
      alert("Cookies are Disabled");
    }
  } catch (err) {
    console.log(err);
  }
});

//Form Toggle
document.addEventListener("DOMContentLoaded", function () {
  const openPollFormBtn = document.getElementById("openPollFormBtn");
  const closePollFormBtn = document.getElementById("closePollFormBtn");
  const createPollSection = document.getElementById("create-poll");

  // Show the poll form when "Open Poll Form" is clicked
  openPollFormBtn.addEventListener("click", function () {
    createPollSection.classList.remove("hidden"); // Show the form
    openPollFormBtn.classList.add("hidden"); // Hide the open button
  });

  // Hide the poll form when "Close Poll Form" is clicked
  closePollFormBtn.addEventListener("click", function () {
    createPollSection.classList.add("hidden"); // Hide the form
    openPollFormBtn.classList.remove("hidden"); // Show the open button
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
