// Get the DOM elements
const dropdown = document.getElementById("myDropdown");
const inputField = document.getElementById("userId");
const actionButton = document.getElementById("actionButton");
const userTableContainer = document.getElementById("userTableContainer");

// Set the base URL of your backend API
const API_URL = 'http://localhost:3000/admin'; // Change this URL if your backend URL differs

// Function to handle user actions
actionButton.addEventListener('click', () => {
  const action = dropdown.value;
  const userId = inputField.value;

  if (!userId && action !== 'search') {
    alert("Please provide a User ID.");
    return;
  }

  switch (action) {
    case 'search':
      searchUser(userId);
      break;
    case 'delete':
      deleteUser(userId);
      break;
    case 'promote':
      promoteToAdmin(userId);
      break;
    default:
      alert("Please select an action.");
  }
});

// Fetch All Users (GET)
function fetchAllUsers() {
  fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN', // Include JWT token here
    }
  })
  .then(response => response.json())
  .then(users => {
    displayUsersTable(users);
  })
  .catch(error => {
    console.error("Error fetching users:", error);
    alert("Error fetching users.");
  });
}

// Search User (GET)
function searchUser(userId) {
  fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN', // Include JWT token here
    }
  })
  .then(response => response.json())
  .then(user => {
    displayUsersTable([user]); // Display only this user in the table
  })
  .catch(error => {
    alert("User not found.");
    console.error("Error fetching user:", error);
  });
}


// Promote User to Admin (PATCH)
function promoteToAdmin(userId) {
  fetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN', // Include JWT token here
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || "User promoted to Admin successfully.");
    fetchAllUsers(); // Refresh the user list after promotion
  })
  .catch(error => {
    alert("Error promoting user.");
    console.error("Error promoting user:", error);
  });
}

// Delete User (DELETE)
function deleteUser(userId) {
  fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN', // Include JWT token here
    }
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || "User deleted successfully.");
    fetchAllUsers(); // Refresh the user list after deletion
  })
  .catch(error => {
    alert("Error deleting user.");
    console.error("Error deleting user:", error);
  });
}


// Display Users in a Table
function displayUsersTable(users) {
  let tableHtml = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>`;

  users.forEach(user => {
    tableHtml += `
      <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.role}</td>
      </tr>`;
  });

  tableHtml += `</tbody></table>`;
  userTableContainer.innerHTML = tableHtml;
}

// Initially fetch all users when the page loads (Optional)
fetchAllUsers();
