/**
 * Authentication Module
 * Handles login, registration, validation, and route protection.
 */

// User Database Mock (for localStorage)
const USERS_DB_KEY = 'bookstore_users';
const CURRENT_USER_KEY = 'bookstore_current_user';

// Get current page name to determine routing rules
const currentPath = window.location.pathname;
const isLoginPage = currentPath.endsWith('login.html') || currentPath.endsWith('login');

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Route Protection Logic
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

  if (!currentUser && !isLoginPage) {
    // Kick to login if not logged in and not on login page
    window.location.replace('login.html');
    return;
  } else if (currentUser && isLoginPage) {
    // Kick to home if logged in and trying to go to login page
    window.location.replace('index.html');
    return;
  }

  // Set user name in navbar if requested (on non-login pages)
  if (currentUser && !isLoginPage) {
    const userNameEl = document.getElementById('navbar-user-name');
    if (userNameEl) {
      userNameEl.textContent = currentUser.name;
    }
  }

  // 2. Login Page Specific Logic
  if (isLoginPage) {
    initLoginPage();
  }

  // 3. Logout Logic
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.replace('login.html');
    });
  }

  // 4. Initialize ripple effect on all '.ripple' buttons
  initRippleEffect();
});


// Initialization function for Login Page
function initLoginPage() {
  const loginFormDiv = document.getElementById('login-form');
  const registerFormDiv = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');

  // Toggle Forms
  showRegisterLink.addEventListener('click', () => {
    loginFormDiv.style.display = 'none';
    registerFormDiv.style.display = 'block';
  });

  showLoginLink.addEventListener('click', () => {
    registerFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'block';
  });

  // Regex Patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Validation function
  const validateInput = (inputEl, groupEl, regex, emptyMsg, invalidMsg) => {
    const val = inputEl.value.trim();
    if (val === '') {
      groupEl.className = 'form-group error';
      groupEl.querySelector('.error-message').textContent = emptyMsg;
      return false;
    } else if (regex && !regex.test(val)) {
      groupEl.className = 'form-group error';
      groupEl.querySelector('.error-message').textContent = invalidMsg;
      return false;
    } else {
      groupEl.className = 'form-group success';
      return true;
    }
  };

  // Login Validation setup
  const loginEmail = document.getElementById('login-email');
  const loginEmailGroup = document.getElementById('login-email-group');
  const loginPass = document.getElementById('login-password');
  const loginPassGroup = document.getElementById('login-password-group');
  
  loginEmail.addEventListener('input', () => validateInput(loginEmail, loginEmailGroup, emailRegex, 'Email cannot be empty', 'Must be a valid Gmail address'));
  loginPass.addEventListener('input', () => validateInput(loginPass, loginPassGroup, passwordRegex, 'Password cannot be empty', 'Invalid password format'));

  // Registration Validation setup
  const regName = document.getElementById('reg-name');
  const regNameGroup = document.getElementById('reg-name-group');
  const regEmail = document.getElementById('reg-email');
  const regEmailGroup = document.getElementById('reg-email-group');
  const regPass = document.getElementById('reg-password');
  const regPassGroup = document.getElementById('reg-password-group');

  regName.addEventListener('input', () => validateInput(regName, regNameGroup, null, 'Name cannot be empty', ''));
  regEmail.addEventListener('input', () => validateInput(regEmail, regEmailGroup, emailRegex, 'Email cannot be empty', 'Must be a valid Gmail address'));
  regPass.addEventListener('input', () => validateInput(regPass, regPassGroup, passwordRegex, 'Password cannot be empty', 'Min 8 chars, 1 uppercase, 1 number'));


  // Form Submission Handlers
  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const isEmailValid = validateInput(loginEmail, loginEmailGroup, emailRegex, 'Email cannot be empty', 'Must be a valid Gmail address');
    const isPassValid = validateInput(loginPass, loginPassGroup, passwordRegex, 'Password cannot be empty', 'Invalid password format');

    if (isEmailValid && isPassValid) {
      handleAuthSubmit(e.target.querySelector('button'), 'login');
    }
  });

  document.getElementById('form-register').addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateInput(regName, regNameGroup, null, 'Name cannot be empty', '');
    const isEmailValid = validateInput(regEmail, regEmailGroup, emailRegex, 'Email cannot be empty', 'Must be a valid Gmail address');
    const isPassValid = validateInput(regPass, regPassGroup, passwordRegex, 'Password cannot be empty', 'Min 8 chars, 1 uppercase, 1 number');

    if (isNameValid && isEmailValid && isPassValid) {
      handleAuthSubmit(e.target.querySelector('button'), 'register');
    }
  });
}

function handleAuthSubmit(btnElement, type) {
  // Show spinner
  const originalText = btnElement.innerText;
  btnElement.innerHTML = `Loading... <div class="spinner"></div>`;
  btnElement.disabled = true;

  setTimeout(() => {
    let users = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    
    if (type === 'register') {
      const email = document.getElementById('reg-email').value.trim();
      const name = document.getElementById('reg-name').value.trim();
      const password = document.getElementById('reg-password').value; // In a real app we salt/hash

      // Check if user exists
      if (users.find(u => u.email === email)) {
        alert("Email is already registered! Please login.");
        btnElement.innerHTML = originalText;
        btnElement.disabled = false;
        return;
      }

      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      
      // Auto login
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
      window.location.replace('index.html');

    } else if (type === 'login') {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: foundUser.id, name: foundUser.name, email: foundUser.email }));
        window.location.replace('index.html');
      } else {
        alert("Invalid email or password!");
        btnElement.innerHTML = originalText;
        btnElement.disabled = false;
        // set error states manually
        document.getElementById('login-email-group').className = 'form-group error';
        document.getElementById('login-password-group').className = 'form-group error';
      }
    }
  }, 1000); // Faux network delay
}

function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn.ripple');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripples = document.createElement('span');
      ripples.style.left = x + 'px';
      ripples.style.top = y + 'px';
      ripples.classList.add('btn-ripple-wrapper');
      
      // The button needs relative positioning & overflow hidden 
      // (already handled in style.css)
      this.appendChild(ripples);
      
      setTimeout(() => {
        ripples.remove();
      }, 600);
    });
  });
}
