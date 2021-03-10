import Cookies from "js-cookie";

export async function signUp(userData) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify(userData),
  });

  if (response.status >= 400) {
    return Promise.reject(`There was an error signing up`);
  }

  return response.json();
}

export async function fetchUser() {
  const response = await fetch("/api/user");

  if (response.status === 200) {
    return response.json();
  }
}

export function logout() {
  return fetch("/api/logout", {
    method: "POST",
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
  });
}

export async function login(userData) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify(userData),
  });

  if (response.status >= 400) {
    return Promise.reject(`There was an error logging in.`);
  }

  return response.json();
}