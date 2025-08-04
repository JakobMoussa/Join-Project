async function saveAllContactsToFirebaseSafely() {
    const contacts = document.querySelectorAll(".contact");
    const existingUsers = await loadData("users");

    for (const contact of contacts) {
        const name = contact.querySelector(".name").textContent.trim();
        const email = contact.querySelector(".email").textContent.trim();

        if (!userExists(existingUsers, email)) {
            const user = buildUser(name, email);
            await postData("users/", user);
            console.log(`Gespeichert: ${name}`);
        } else {
            console.log(`Skip (already exists): ${email}`);
        }
    }
}

function userExists(users, email) {
    return Object.values(users || {}).some(user => user.email === email);
}

function buildUser(name, email) {
    return {
        name,
        email,
        phone: "0152/0000000", // Standard oder später dynamisch
        Avatar: getInitials(name),
        color: getRandomColor(),
        assigned: false,
        password: false
    };
}

function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return console.warn("Formular nicht gefunden.");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = getValue("contact-name");
        const email = getValue("contact-email");
        const phone = getValue("contact-phone");

        if (!name || !email || !phone) return alert("Bitte alle Felder ausfüllen!");

        const user = buildUser(name, email, phone);
        await postData("users/", user);
        addContactToList(user);
        closeOverlay();
    });
}

function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

// Existiert schon und bitte mit der createUser() in der api.js austauschen
function buildUser(name, email, phone) {
    return {
        name,
        email,
        phone,
        avatar: getInitials(name),
        color: getRandomColor(),
        assigned: false,
        password: false
    };
}

// Austauschen mit der createAvater(name) in der script.js austauschen 
function getInitials(name) {
    const trimmed = name.trim();
    const parts = trimmed.split(" ");

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    const firstInitial = parts[0][0].toUpperCase();
    const secondInitial = parts[1][0].toUpperCase();

    return firstInitial + secondInitial;
}

function addContactToList(user) {
    const contactsBar = document.querySelector(".contacts-bar");
    const groupLetter = user.name[0].toUpperCase();

    let group = findOrCreateGroup(contactsBar, groupLetter);

    const contactHTML = createContactElement(user);
    contactHTML.addEventListener("click", () => renderUserInfo(user));

    group.appendChild(contactHTML);
}


function findOrCreateGroup(container, letter) {
    const allGroups = container.querySelectorAll(".contact-group");
    let group = null;

    for (let i = 0; i < allGroups.length; i++) {
        const label = allGroups[i].querySelector(".group-letter");
        if (label && label.textContent === letter) {
            group = allGroups[i];
            break;
        }
    }
    if (!group) {
        group = document.createElement("div");
        group.classList.add("contact-group");
        group.innerHTML = `<div class="group-letter">${letter}</div>`;
        container.appendChild(group);
    }
    return group;
}

async function loadContacts() {
    let users = await loadData("users");
    let initials = getUniqueInitials(users);
    importContactGroups(users, initials);
}
loadContacts();

function getUniqueInitials(users) {
    let result = [];
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (!letterExists(result, initial)) {
            result.push(initial);
        }
    }
    result.sort();
    return result;
}

function letterExists(array, initial) {
    return array.includes(initial);
}

function importContactGroups(users, initials) {
    let contactsContainer = document.getElementById("contacts-container");
    initials.forEach(letter => {
        let contactGroup = document.createElement("div");
        contactGroup.classList.add("contact-group");
        contactGroup = buildLetterGroup(contactGroup, letter, users);
        contactsContainer.appendChild(contactGroup);
    });
}

function buildLetterGroup(contactGroup, letter, users) {
    let groupLetter = createLetterBox(letter);
    contactGroup.appendChild(groupLetter);
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (initial === letter) {
            contactGroup.appendChild(createContactElement(users[key]));
        }
    }
    return contactGroup;
}

function createLetterBox(letter) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.classList.add("group-letter");
    span.innerHTML = letter;
    div.appendChild(span);
    return div
}