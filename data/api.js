const baseUrl = "https://test-form-app-ruangguru.herokuapp.com";
// const baseUrl = "http://localhost:3030";

export async function signIn(username, password) {
  const res = await fetch(`${baseUrl}/api/v0/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function identity() {
  const jwt = localStorage.getItem("JWT_TOKEN");
  await fetch(`${baseUrl}/api/v0/identity`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return res.json();
}

export async function subscriberSubmit(data) {
  const jwt = localStorage.getItem("JWT_TOKEN");
  const res = await fetch(`${baseUrl}/api/v0/subscriber/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listSubscriberInfo() {
  const jwt = localStorage.getItem("JWT_TOKEN");
  const res = await fetch(`${baseUrl}/api/v0/subscriber`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return res.json();
}

export async function checkStatus(userid) {
  const res = await fetch(
    `https://us-central1-silicon-airlock-153323.cloudfunctions.net/rg-package-dummy?userId=${userid}`
  );
  return res.json();
}

export async function changeStatus(subscriber_id, status) {
  const data = { subscriber_id, status };
  const jwt = localStorage.getItem("JWT_TOKEN");
  const res = await fetch(`${baseUrl}/api/v0/subscriber/change-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
