const registerForm = document.getElementById('register-form') as HTMLFormElement | null;
const registerUsernameInput = document.getElementById('username') as HTMLInputElement | null;
const registerPasswordInput = document.getElementById('password') as HTMLInputElement | null;
const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement | null;
const registerMessageContainer = document.getElementById('message-container') as HTMLElement | null; // Renamed variable

if (registerForm && registerUsernameInput && registerPasswordInput && confirmPasswordInput && registerMessageContainer) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Clear previous messages
    registerMessageContainer.innerHTML = '';

    // Check if passwords match
    if (password !== confirmPassword) {
      registerMessageContainer.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
      return;
    }

    const registerData = {
      username,
      password,
      confirmPassword,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        registerMessageContainer.innerHTML = `<div class="alert alert-danger">Error: ${errorData.message}</div>`;
        return;
      }

      // Success: Registration was successful
      registerMessageContainer.innerHTML = '<div class="alert alert-success" style="color: green;">User successfully registered! Redirecting to login page...</div>';
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        window.location.href = 'login.html'; // Redirect to the login page
      }, 2000); // Delay of 2 seconds

    } catch (error) {
      registerMessageContainer.innerHTML = '<div class="alert alert-danger">An unknown error occurred.</div>';
      console.error('Error during registration:', error);
    }
  });
} else {
  console.error("One or more elements are missing from the DOM.");
}
