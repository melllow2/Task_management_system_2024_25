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
const registerForm = document.getElementById('register-form');
const registerUsernameInput = document.getElementById('username');
const registerPasswordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerMessageContainer = document.getElementById('message-container'); // Renamed variable
if (registerForm && registerUsernameInput && registerPasswordInput && confirmPasswordInput && registerMessageContainer) {
    registerForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });
            if (!response.ok) {
                const errorData = yield response.json();
                registerMessageContainer.innerHTML = `<div class="alert alert-danger">Error: ${errorData.message}</div>`;
                return;
            }
            // Success: Registration was successful
            registerMessageContainer.innerHTML = '<div class="alert alert-success" style="color: green;">User successfully registered! Redirecting to login page...</div>';
            // Redirect after a short delay to show the success message
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to the login page
            }, 2000); // Delay of 2 seconds
        }
        catch (error) {
            registerMessageContainer.innerHTML = '<div class="alert alert-danger">An unknown error occurred.</div>';
            console.error('Error during registration:', error);
        }
    }));
}
else {
    console.error("One or more elements are missing from the DOM.");
}
