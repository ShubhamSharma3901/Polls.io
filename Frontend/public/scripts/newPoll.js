import "../output.css";
document.addEventListener("DOMContentLoaded", function () {
  let optionCount = 2;
  const maxOptions = 10;

  //DOM Elements
  const pollForm = document.getElementById("pollForm");
  const optionsContainer = document.getElementById("optionsContainer");
  const addOptionBtn = document.getElementById("addOptionBtn");
  const optionError = document.getElementById("optionError");

  //Fetch Headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  fetch(`http://localhost:3000/polls`, {
    credentials: "include",
    headers: myHeaders,
  })
    .then((response) => response.json())
    .then((polls) => {
      // Display poll question
      polls.map((poll) => appendPollsToDOM(poll));
    })
    .catch((err) => {
      console.log("Cannot get Poll: ", err);
    });

  // Function to create a new option group without numbering
  function createOptionGroup() {
    const optionGroup = document.createElement("div");
    optionGroup.classList.add(
      "option-group",
      "flex",
      "items-center",
      "space-x-2",
    );

    const input = document.createElement("input");
    input.type = "text";
    input.id = `option${optionCount}`;
    input.name = "option";
    input.required = "true";
    input.classList.add(
      "w-full",
      "dark:border-gray-600",
      "rounded",
      "bg-white",
      "dark:bg-gray-700",
      "text-gray-800",
      "dark:text-gray-200",
      "border-gray-300",
      "p-2",
      "border",
      "rounded",
    );
    input.placeholder = `Enter option`;
    input.setAttribute("aria-required", "true");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add(
      "bg-red-50",
      "text-red-600",
      "hover:bg-red-100",
      "hover:text-500",
      "transition-all",
      "hover:underline",
      "delete-option-btn",
      "dark:bg-red-200",
      "dark:text-red-700",
      "dark:hover:bg-red-300",
      "dark:hover:text-red-900",
    );
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete option`);

    // Add delete event listener
    deleteBtn.addEventListener("click", function () {
      removeOptionGroup(optionGroup);
    });

    optionGroup.appendChild(input);
    optionGroup.appendChild(deleteBtn);

    return optionGroup;
  }

  // Function to remove an option group
  function removeOptionGroup(optionGroup) {
    optionsContainer.removeChild(optionGroup);
    optionCount--;
    optionError.classList.add("hidden"); // Hide error when deleting an option
  }

  // Event listener to add more options
  addOptionBtn.addEventListener("click", function () {
    if (optionCount < maxOptions) {
      optionCount++;
      const newOptionGroup = createOptionGroup();
      optionsContainer.appendChild(newOptionGroup);
    } else {
      optionError.textContent = "You can add a maximum of 10 options.";
      optionError.classList.remove("hidden");
    }
  });

  // Event listener for form submission
  pollForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear any previous errors
    optionError.classList.add("hidden");

    // You can now process the form data
    const pollQuestion = document.getElementById("pollQuestion").value;
    const options = Array.from(document.getElementsByName("option")).map(
      (input) => input.value,
    );

    // console.log("Poll Question:", pollQuestion);
    // console.log("Poll Options:", options);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    try {
      if (navigator.cookieEnabled) {
        const response = await fetch("http://localhost:3000/polls", {
          method: "POST",
          body: JSON.stringify({
            question: pollQuestion,
            options: options.map((opt) => {
              return {
                name: opt,
                users: [],
                votes: 0,
              };
            }),
          }),
          credentials: "include",
          headers: myHeaders,
        });

        const data = await response.json();

        if (response.status === 200) {
          pollForm.reset(); // Reset all inputs

          const openPollFormBtn = document.getElementById("openPollFormBtn");

          const createPollSection = document.getElementById("create-poll");

          // Remove all dynamically added options
          optionsContainer.innerHTML = `
                    <p class="block font-semibold xsPhone:text-[min(5vh,5vw)] smTablet:text-[min(2.5vh,2.5vw)] dark:text-white">Options</p>
                            <div class="option-group space-y-4" id="optionGroup1">
                                <input type="text" required id="option1" name="option"
                                    class="w-full border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" placeholder="Enter option">
                            </div>
                            <div class="option-group space-y-4" id="optionGroup2">
                                <input type="text" required id="option1" name="option"
                                    class="w-full border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" placeholder="Enter option">
                            </div>`;
          optionCount = 2;

          createPollSection.classList.add("hidden");
          openPollFormBtn.classList.remove("hidden");

          //append polls to dashboard
          appendPollsToDOM(data);
        } else {
          alert("Failed to create poll");
        }
      } else {
        alert("Cookies are not enabled!");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

function appendPollsToDOM(poll) {
  const pollsList = document.getElementById("polls-list");
  const pollElement = document.createElement("div");
  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

  pollElement.classList.add(
    "rounded-xl",
    "p-6",
    "font-poppins",
    "space-y-4",
    "bg-white",
    "hover:bg-primary",
    "hover:text-white",
    "transition-all",
    "group",
    "grid",
    "grid-cols-1",
    "grid-rows-auto",
    "align-center",
    "hover:shadow-2xl",
    "dark:bg-[#1F2026]",
    "dark:outline",
    "dark:outline-neutral-700",
    "dark:shadow-xl",
    "dark:hover:bg-[#2A2B33]",
  );

  const element = `
		<div class="w-full flex justify-start items-center gap-4">
			<div class="bg-green-50 dark:bg-green-200 text-green-900 w-fit h-fit px-3 py-2 rounded-full shadow-sm xsPhone:text-[min(3.5vh,3.5vw)] smTablet:text-[min(2vh,2vw)]">
				votes: ${totalVotes}
			</div>
		</div>
		<h3 class="text-primary group-hover:text-white dark:text-[#8ABBEF] dark:group-hover:text-[#8ABBEF] xsPhone:text-[min(7vh,7vw)] smTablet:text-[min(3.5vh,3.5vw)]">${
      poll.question
    }</h3>
		<p class="dark:text-white xsPhone:text-[min(4vh,4vw)] mdPhone:text-[min(4vh,4vw)] smTablet:text-[min(2vh,2vw)]">Created at : ${new Date(
      poll.createdAt,
    ).toLocaleDateString()}</p>
		<div class="relative bottom-0 flex gap-4 xsPhone:flex-col smTablet:flex-row">
			<a href="/public/vote?id=${
        poll._id
      }" class="smTablet:w-[60%] tablet:w-[70%] xsPhone:w-full">
				<button class="text-primary shadow-sm rounded-xl w-full smTablet:p-4 xsPhone:p-3 bg-blue-50 dark:bg-blue-200 dark:text-hover dark:hover:bg-blue-300 dark:hover:text-hover hover:text-white hover:shadow-none hover:scale-95 transition-all">View</button>
			</a>
			
			<button class="deletePollBtn smTablet:w-[40%] tablet:w-[30%] xsPhone:w-full text-red-600 bg-red-50 dark:bg-red-200 dark:text-red-700 shadow-sm rounded-xl hover:shadow-none hover:scale-95 smTablet:p-4 xsPhone:p-3 hover:text-red-700 hover:bg-red-100 dark:hover:text-red-900 dark:hover:bg-red-300 transition-all" data-poll-id="${
        poll._id
      }">
				Delete
			</button>
		</div>
	`;
  pollElement.innerHTML = element;
  pollsList.appendChild(pollElement);

  // Add event listener to the delete button
  const deleteBtn = pollElement.querySelector(".deletePollBtn");
  deleteBtn.addEventListener("click", function () {
    // Show a confirmation dialog
    showModal(
      "Confirm Deletion",
      "Are you sure you want to delete this poll?",
      function () {
        // On confirm, delete the poll
        deletePoll(poll._id, pollElement);
      },
    );
  });
}

// Function to show the modal as a confirmation prompt
function showModal(title, message, onConfirm, onCancel = null) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const okBtn = document.getElementById("modal-ok-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");

  // Set modal content
  modalTitle.innerText = title;
  modalMessage.innerText = message;

  // Show cancel button if it is a confirmation modal
  cancelBtn.classList.remove("hidden");

  // Show the modal
  modal.classList.remove("hidden");

  // Add event listener for the OK button
  okBtn.onclick = function () {
    modal.classList.add("hidden");
    if (onConfirm) onConfirm();
  };

  // Add event listener for the Cancel button
  cancelBtn.onclick = function () {
    modal.classList.add("hidden");
    if (onCancel) onCancel();
  };
}

// Function to show the modal as an alert
function showAlert(title, message, onOk = null) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const okBtn = document.getElementById("modal-ok-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");

  // Set modal content
  modalTitle.innerText = title;
  modalMessage.innerText = message;

  // Hide cancel button for alerts
  cancelBtn.classList.add("hidden");

  // Show the modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Add event listener for the OK button
  okBtn.onclick = function () {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    if (onOk) onOk();
  };
}

//Function to delete the poll
function deletePoll(pollId, pollElement) {
  // Make an API call to delete the poll
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  fetch(`http://localhost:3000/polls/${pollId}`, {
    method: "DELETE",
    headers: myHeaders,
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        // Remove the poll element from the DOM
        pollElement.remove();
        // alert("Poll deleted successfully.");
        showAlert(
          "Poll Deleted",
          "The poll has been deleted successfully.",
          function () {
            // Optional action after alert is dismissed
            console.log("Alert dismissed");
          },
        );
      } else {
        alert("Error deleting the poll. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error deleting the poll:", error);
      alert("Error deleting the poll. Please try again.");
    });
}
