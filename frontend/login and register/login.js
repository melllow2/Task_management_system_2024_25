"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessageContainer = document.getElementById('message-container');

if (loginForm && usernameInput && passwordInput && loginMessageContainer) {
    loginForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield fetch('http://localhost:3000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = yield response.json();
                loginMessageContainer.innerHTML = `
                    <div class="alert alert-danger" style="color: white; background-color: red; border-radius: 5px; padding: 10px;">
                        Error: ${errorData.message}
                    </div>`;
                return;
            }

            const data = yield response.json();
            const accessToken = data.accessToken;
            const role = data.role; // Assume the role is part of the response

            console.log('Role:', role);  // Debugging: check the role

            // Store token for future requests
            localStorage.setItem('accessToken', accessToken);

            // Check role and navigate accordingly
            if (role === 'admin') {
                console.log('Redirecting to Admin Dashboard');
                window.location.href = '../admin_dashboard/admin-dashboard.html'; // Navigate to Admin Dashboard
            } else if (role === 'user') {
                console.log('Redirecting to User Dashboard');
                window.location.href = '../user_dashboard/user-dashboard.html'; // Navigate to User Dashboard
            } else {
                // If the role is unknown, show a message and redirect to the registration page
                console.log('Unknown role, redirecting to register.html');
                loginMessageContainer.innerHTML = `
                    <div class="alert alert-warning" style="color: white; background-color: orange; border-radius: 5px; padding: 10px;">
                        Unknown role. Please contact support.
                    </div>`;
                setTimeout(() => {
                    console.log('Redirecting to register.html');
                    window.location.href = 'register.html'; // Redirect to the registration page after a brief delay
                }, 3000); // Delay to show the warning message before redirect
            }
        } catch (error) {
            loginMessageContainer.innerHTML = `
                <div class="alert alert-danger" style="color: white; background-color: red; border-radius: 5px; padding: 10px;">
                    An unknown error occurred.
                </div>`;
            console.error('Error during login:', error);
        }
    }));
} else {
    console.error("One or more elements are missing from the DOM.");
}
