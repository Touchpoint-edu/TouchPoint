import Cookies from "js-cookie";

export async function signUp(userData) {
  console.log("User data", userData);
  let userStr = btoa(`${userData.email}:${userData.password}`);
  let response;
  try {

  response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + userStr,
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    body: {
      fname: userData.fname,
      lname: userData.lname
    }
  });
} catch(error) {
  console.log("There was an error!!");
}

console.log(response);
  return response;
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
  let userStr = btoa(`${userData.email}:${userData.password}`);

  const response = await fetch("/api/login/auth", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + userStr,
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
    //body: JSON.stringify(userData),
  });
  if (response.status === 200) {
    return response.status;
  }
  return response.json();
}

export async function loginWithGoogle(token) {
  const res = await fetch("api/login/auth/google", {
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
  const res = await fetch("api/signup/google", {
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