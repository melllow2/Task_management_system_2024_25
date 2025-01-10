const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
const usernameInput = document.getElementById('username') as HTMLInputElement | null;
const passwordInput = document.getElementById('password') as HTMLInputElement | null;
const loginMessageContainer = document.getElementById('message-container') as HTMLElement | null;

if (loginForm && usernameInput && passwordInput && loginMessageContainer) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous messages
    loginMessageContainer.innerHTML = '';

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        loginMessageContainer.innerHTML = `
          <div class="alert alert-danger" style="color: white; background-color: red; border-radius: 5px; padding: 10px;">
            Error: ${errorData.message}
          </div>`;
        return;
      }

      const data = await response.json();
      const accessToken = data.accessToken;
      localStorage.setItem('accessToken', accessToken); // Store token for future requests
      window.location.href = '../user_dashboard/user-dashboard.html'; // Redirect to the dashboard

    } catch (error) {
      loginMessageContainer.innerHTML = `
        <div class="alert alert-danger" style="color: white; background-color: red; border-radius: 5px; padding: 10px;">
          An unknown error occurred.
        </div>`;
      console.error('Error during login:', error);
    }
  });
} else {
  console.error("One or more elements are missing from the DOM.");
}
