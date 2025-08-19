// Simulated user database stored in localStorage for persistence
let users = JSON.parse(localStorage.getItem('users')) || {
  'student1': { password: 'password123', role: 'student' } // preloaded user
};

const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const authForm = document.getElementById('auth-form');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authMessage = document.getElementById('auth-message');

let isLoginMode = true;

// ---- Add role select dynamically ----
let roleSelect = document.createElement('select');
roleSelect.name = "role";
roleSelect.id = "role";
roleSelect.innerHTML = `
  <option value="student" selected>Student</option>
  <option value="chef">Chef</option>
`;
roleSelect.style.display = "none"; // hidden by default

// Add label + dropdown into the form
let roleLabel = document.createElement('label');
roleLabel.textContent = "I am a: ";
roleLabel.id = "role-label";
roleLabel.style.display = "none";

authForm.insertBefore(roleLabel, authSubmitBtn);
authForm.insertBefore(roleSelect, authSubmitBtn);
// --------------------------------------

function updateAuthUI() {
  if (isLoginMode) {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    authSubmitBtn.textContent = 'Login';
    authMessage.textContent = '';
    roleSelect.style.display = "none";
    roleLabel.style.display = "none";
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    authSubmitBtn.textContent = 'Sign Up';
    authMessage.textContent = '';
    roleSelect.style.display = "block";
    roleLabel.style.display = "block";
  }
  authForm.reset();
  authMessage.style.color = 'red';
}

loginTab.addEventListener('click', () => {
  if (!isLoginMode) {
    isLoginMode = true;
    updateAuthUI();
  }
});

signupTab.addEventListener('click', () => {
  if (isLoginMode) {
    isLoginMode = false;
    updateAuthUI();
  }
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = authForm.username.value.trim();
  const password = authForm.password.value.trim();
  const role = isLoginMode ? null : roleSelect.value;

  if (!username || !password) {
    authMessage.textContent = 'Please enter both username and password.';
    return;
  }

  if (isLoginMode) {
    if (users[username] && users[username].password === password) {
      // Login success, store current user and redirect
      localStorage.setItem('currentUser', JSON.stringify({ username, role: users[username].role }));
      authMessage.style.color = 'green';
      authMessage.textContent = 'Login successful! Redirecting...';
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1000);
    } else {
      authMessage.textContent = 'Invalid username or password.';
    }
  } else {
    if (users[username]) {
      authMessage.textContent = 'Username already exists, try another.';
    } else {
      users[username] = { password, role };
      localStorage.setItem('users', JSON.stringify(users));
      authMessage.style.color = 'green';
      authMessage.textContent = 'Sign up successful! You can login now.';
      setTimeout(() => {
        isLoginMode = true;
        updateAuthUI();
      }, 1500);
    }
  }
});

// Initialize UI
updateAuthUI();
