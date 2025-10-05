let BASE_URL = "https://join-52020-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Creates a user object with the specified properties.
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string} [phone="01510000000"] - The phone number of the user
 * @param {string} [color=getRandomColor()] - The color code associated with the user
 * @param {boolean} [assigned=false] - Whether the user is assigned to a task
 * @param {boolean|string} [password=false] - The user's password
 * @returns {Object} The user object with all properties
 * @returns {string} return.name - User's name
 * @returns {string} return.email - User's email
 * @returns {string} return.color - User's assigned color
 * @returns {boolean} return.assigned - Assignment status
 * @returns {string} return.phone - User's phone number as string
 * @returns {string} return.password - User's password as string
 * @returns {string} return.avatar - User's avatar initials
 */
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

/**
 * Creates an avatar string from a user's name by extracting the first character of each word.
 * @param {string} name - The full name of the user
 * @returns {string} The avatar initials in uppercase
 */
function createAvater(name) {
  let myArr = name.split(" ");
  let avatar = "";
  myArr.forEach(element => {
    avatar += element.charAt(0);
  });
  return avatar
}

/**
 * Returns a random color from a predefined set of colors.
 * @returns {string} A hex color code
 */
function getRandomColor() {
  const colors = ["#f1c40f", "#1abc9c", "#3498db", "#e67e22", "#9b59b6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Creates a user object, validates it, and posts it to the database.
 * @async
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string|boolean} password - The user's password
 * @param {string} [phone="01510000000"] - The phone number of the user
 * @param {string} [color=getRandomColor()] - The color code associated with the user
 * @param {boolean} assigned - Whether the user is assigned to a task
 * @returns {Promise<void>}
 */
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

/**
 * Validates a user object by checking that required string fields are present and non-empty.
 * @param {Object} user - The user object to validate
 * @param {string} user.name - The user's name
 * @param {string} user.email - The user's email
 * @param {string} user.phone - The user's phone number
 * @returns {boolean} True if the user object is valid, false otherwise
 */
function validateUser(user) {
  if (typeof user.name !== "string" || user.name.trim() === "") return false;
  if (typeof user.email !== "string" || user.email.trim() === "") return false;
  if (typeof user.phone !== "string" || user.phone.trim() === "") return false;
  return true;
}

/**
 * Loads data from the Firebase database at the specified path.
 * @async
 * @param {string} link - The path to the data resource (without .json extension)
 * @returns {Promise<Object|null>} The parsed JSON response from the database
 */
async function loadData(link) {
  let response = await fetch(BASE_URL + link + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Posts data to the Firebase database at the specified path using HTTP POST.
 * Creates a new entry with an auto-generated key.
 * @async
 * @param {string} path - The path where data should be posted (without .json extension)
 * @param {Object} [data={}] - The data object to post
 * @returns {Promise<Object|undefined>} The parsed JSON response containing the generated key, or undefined if path is not defined
 */
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

/**
 * Updates data in the Firebase database at the specified path using HTTP PUT.
 * Overwrites existing data at the path.
 * @async
 * @param {string} path - The path where data should be updated (without .json extension)
 * @param {Object} [data={}] - The data object to store
 * @returns {Promise<void>}
 */
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

/**
 * Deletes data from the Firebase database at the specified path using HTTP DELETE.
 * @async
 * @param {string} [path=""] - The path to the data to delete (without .json extension)
 * @returns {Promise<void>}
 */
async function deleteData(path = "") {
  await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
}