// Elements
var taskActionSelect = document.getElementById("task-action");
var updateTaskContainer = document.getElementById("update-task-container");
var filterTaskContainer = document.getElementById("filter-by-status");
var deleteTaskContainer = document.getElementById("delete-task-container");
var createTaskContainer = document.getElementById("create-task-container");

// Ensure containers are hidden initially
updateTaskContainer.style.display = "none";
deleteTaskContainer.style.display = "none";
filterTaskContainer.style.display = "none";
createTaskContainer.style.display = "none";

// Function to handle dropdown changes
function handleTaskActionChange() {
    var selectedAction = taskActionSelect.value;
    // Hide all containers first
    updateTaskContainer.style.display = "none";
    deleteTaskContainer.style.display = "none";
    filterTaskContainer.style.display = "none";
    createTaskContainer.style.display = "none";
    
    // Show the container based on the selected action
    if (selectedAction === "update") {
        updateTaskContainer.style.display = "block";
    } else if (selectedAction === "delete") {
        deleteTaskContainer.style.display = "block";
    } else if (selectedAction === "filter") {
        filterTaskContainer.style.display = "block";
    } else if (selectedAction === "Create") {
        createTaskContainer.style.display = "block";
    }
}

// Add event listener to the dropdown
taskActionSelect.addEventListener("change", handleTaskActionChange);

// Function to fetch tasks and display them
async function fetchTasks(statusFilter = "") {
    try {
        let url = 'http://127.0.0.1:3000/tasks'; // API endpoint for fetching tasks
        if (statusFilter) {
            url += `?status=${statusFilter}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // Ensure you are authorized
            }
        });

        if (response.ok) {
            const result = await response.json();
            displayTasks(result.tasks);  // Populate the tasks in the table
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("An error occurred while fetching tasks.");
    }
}

// Function to display tasks in the table
function displayTasks(tasks) {
    var tasksTableBody = document.getElementById("tasks-table-body");
    tasksTableBody.innerHTML = ""; // Clear existing list

    if (tasks.length === 0) {
        tasksTableBody.innerHTML = "<tr><td colspan='4'>No tasks found.</td></tr>";
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.status}</td>
        `;
        tasksTableBody.appendChild(row);
    });
}

// Fetch and display all tasks when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchTasks(); // Fetch all tasks initially
});

// Handle Filter Task Form Submission
document.getElementById("filter-form").addEventListener("submit", async function (event) {
  event.preventDefault();  // Prevent the default form submission

  // Get the selected status from the dropdown
  var status = document.getElementById("filter-status").value;

  // Fetch tasks based on the selected status
  fetchTasks(status); // Fetch tasks filtered by status
});

// Handle Create Task Form Submission
document.getElementById("task-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    var taskName = document.getElementById("task-name").value;
    var taskDescription = document.getElementById("task-description").value;
    
    // Validate inputs
    if (!taskName || !taskDescription) {
        alert("Please provide both task name and description.");
        return;
    }
    
    // Prepare data to send in the request
    var data = {
        title: taskName,
        description: taskDescription
    };
    
    try {
        const response = await fetch('http://127.0.0.1:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            document.getElementById("task-form").reset(); // Reset the form on success
            fetchTasks(); // Refresh the task list
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (error) {
        console.error("Error creating task:", error);
        alert("An error occurred while creating the task.");
    }
});

// Handle Update Task Form Submission
document.getElementById("update-task-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    var taskId = document.getElementById("update-task-id").value;
    var status = document.getElementById("update-task-status").value;

    // Validate inputs
    if (!taskId || !status) {
        alert("Please provide both task ID and status.");
        return;
    }

    var data = {
        status: status
    };

    try {
        const response = await fetch(`http://127.0.0.1:3000/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            fetchTasks(); // Refresh the task list
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (error) {
        console.error("Error updating task:", error);
        alert("An error occurred while updating the task.");
    }
});

// Handle Delete Task Form Submission
document.getElementById("delete-task-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    var taskId = document.getElementById("delete-task-id").value;

    // Validate task ID input
    if (!taskId) {
        alert("Please provide a task ID to delete.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:3000/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            fetchTasks(); // Refresh the task list
        } else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task.");
    }
});

// ** Search Fetch API Logic for Searching Tasks **

// Handle Search Button Click
document.querySelector(".search-btn").addEventListener("click", function () {
  const searchTerm = document.getElementById("search-task").value.trim(); // Get the search term
  if (searchTerm) {
    searchTasks(searchTerm);  // Call the search function with the search term
  } else {
    alert("Please enter a search term.");
  }
});

// Function to search tasks by title or description
async function searchTasks(searchTerm) {
  try {
    // Build the URL with the search term as a query parameter
    const url = `http://127.0.0.1:3000/tasks?search=${searchTerm}`; 
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // Ensure authorization token is provided
      },
    });

    if (response.ok) {
      const result = await response.json();
      displayTasks(result.tasks);  // Display the filtered tasks in the table
    } else {
      const error = await response.json();
      alert("Error: " + error.message);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("An error occurred while fetching tasks.");
  }
}
