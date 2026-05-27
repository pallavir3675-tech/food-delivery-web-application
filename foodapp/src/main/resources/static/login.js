const API_BASE = "http://localhost:8080/api/users";

function showTab(tab) {
  // Switch between login and register tabs
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";

  if (tab === "login") {
    document.getElementById("login-form").style.display = "flex";
    document.querySelectorAll(".tab")[0].classList.add("active");
  } else {
    document.getElementById("register-form").style.display = "flex";
    document.querySelectorAll(".tab")[1].classList.add("active");
  }
}

async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    document.getElementById("login-msg").textContent = "Please enter email and password!";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.text();
    document.getElementById("login-msg").textContent = result;

    if (result === "Login successful!") {
      // Save user email and go to food page
      localStorage.setItem("loggedInUser", email);
      window.location.href = "index.html";
    }

  } catch (error) {
    document.getElementById("login-msg").textContent = "Could not connect to server!";
  }
}

async function register() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!name || !email || !password) {
    document.getElementById("register-msg").textContent = "Please fill all fields!";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.text();
    document.getElementById("register-msg").textContent = result;

    if (result === "Registration successful!") {
      // Switch to login tab after registration
      setTimeout(() => showTab("login"), 1000);
    }

  } catch (error) {
    document.getElementById("register-msg").textContent = "Could not connect to server!";
  }
}