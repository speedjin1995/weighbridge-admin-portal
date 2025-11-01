export async function login(email: string, password: string) {
  const res = await fetch("http://localhost/api/login.php", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function checkSession() {
  const res = await fetch("http://localhost/api/check.php", {
    credentials: "include",
  });
  return res.json();
}

export async function logout() {
  await fetch("http://localhost/api/logout.php", {
    credentials: "include",
  });
}
