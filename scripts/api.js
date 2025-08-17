let BASE_URL = "https://join-52020-default-rtdb.europe-west1.firebasedatabase.app/";

function createUser(name, email, phone = "01510000000", color = getRandomColor(), assigned = false, password = false) {
  return {
    name: name,
    email: email,
    color: color,
    assigned: assigned,
    phone: phone.toString(),
    password: password.toString(),
    avatar: createAvater(name)
  };
}

function createAvater(name) {
  let myArr = name.split(" ");
  let avatar = "";
  myArr.forEach(element => {
    avatar += element.charAt(0);
  });
  return avatar
}

function getRandomColor() {
  const colors = ["#f1c40f", "#1abc9c", "#3498db", "#e67e22", "#9b59b6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function postUser(name, email, password, phone = "01510000000", color = getRandomColor(), assigned) {
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