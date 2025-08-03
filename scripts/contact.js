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
        phone: "0152/0000000", 
        Avatar: getInitials(name),
        color: getRandomColor(),
        assigned: false,
        password: false
    };
}

function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return console.warn("Form not found.");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = getValue("contact-name");
        const email = getValue("contact-email");
        const phone = getValue("contact-phone");

        if (!name || !email || !phone) return alert("Please fill in all fields!");

        const user = buildUser(name, email, phone);
        await postData("users/", user);
        addContactToList(user);
        closeOverlay();
    });
}

function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

function getRandomColor() {
    const colors = ["#f1c40f", "#1abc9c", "#3498db", "#e67e22", "#9b59b6"];
    return colors[Math.floor(Math.random() * colors.length)];
}

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

async function deleteUser(path) {
  try {
    await deleteData(path);         
    closeOverlay();              
    removeUserFromHTML(path);        
    console.log("User gelöscht:", path);
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
  }
}

function removeUserFromHTML(path) {
  const userId = path.split("/")[1]; 
  const contactEl = document.querySelector(`[data-user-id="${userId}"]`);
  if (contactEl) contactEl.remove();
}

