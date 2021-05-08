import Cookies from "js-cookie";

export async function signUp(userData) {
  let userStr = btoa(`${userData.email}:${userData.password}`);
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + userStr,
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify({
      fname: userData.fname,
      lname: userData.lname
    })
  });
  return response;
}

export async function fetchUser() {
  const response = await fetch("/api/auth/username", {
    method: "GET"
  });

  return response
}

export function logout() {
  return fetch("/api/auth/signout", {
    method: "POST"
  });
}

export async function login(userData) {
  let userStr = btoa(`${userData.email}:${userData.password}`);

  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + userStr,
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    //body: JSON.stringify(userData),
  });
  return response;
}

export async function loginWithGoogle(token) {
  const res = await fetch("/api/auth/signin/google", {
    method: "POST",
    body: JSON.stringify({
        token: token
    }),
    headers: {
        "Content-Type": "application/json"
    }
  });
  return res;
}

export async function signUpWithGoogle(token) {
  const res = await fetch("/api/auth/signup/google", {
    method: "POST",
    body: JSON.stringify({
        token: token
    }),
    headers: {
        "Content-Type": "application/json"
    }
  });
  return res;
}