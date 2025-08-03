let BASE_URL = "https://join-52020-default-rtdb.europe-west1.firebasedatabase.app/";

function createUser(name = "Unknown User", email = "unknown@example.com", phone, color = "#FF0000", assigned = false, password = false) {
  return {
    name: name,
    email: email,
    color: color,
    assigned: assigned,
    phone: phone.toString(),
    password: password.toString(),
  };
}

async function postUser(name, email, password, phone = "XXXXXXXXXXXX", color = "blue", assigned) {
  let user = createUser(name, email, phone.trim(), color, assigned, password);
  let validate = validateUser(user);
  if (!validate) {
    console.error("user obj not correct!");
    return;
  }
  let path = "users/";
  await postData(path, user);
}

function validateUser(user) {
  if (typeof user.name !== "string" || user.name.trim() === "") return false;
  if (typeof user.email !== "string" || user.email.trim() === "") return false;
  if (typeof user.phone !== "string" || user.phone.trim() === "") return false;
  return true;
}

async function loadData(link) {
  let response = await fetch(BASE_URL + link + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function postData(path, data = {}) {
  if (!path) {
    console.error("path not defined!");
    return;
  }
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJson = await response.json();
  return responseToJson;
}

async function putData(path, data = {}) {
  if (!path) {
    console.error("path not defined!");
    return;
  }
  await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function deleteData(path = "") {
  await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
}