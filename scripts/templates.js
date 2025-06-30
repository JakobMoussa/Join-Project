function subListItem(task, id) {
    return `
        <li class="sub-item">
            <span>•</span>
            <input type="text" value="${task}" id="sub-input-${id}" disabled>
            <div class="sub-btn-container">
                <button class="sub-btn-edit" onclick="editSubItem(${id}, true)"></button>
                <div class="divider-vertical"></div>
                <button class="sub-btn-delete" onclick="removeSubItem(${id})"></button>
            </div>
        </li>
    `
}

function subListItemEdit(task, id) {
    return `
        <li class="sub-item-editing">
            <input type="text" id="sub-input-${id}" value="${task}">
            <div class="sub-btn-container">
                <button class="sub-btn-editing-delete" onclick="removeSubItem(${id})"></button>
                <div class="divider-vertical"></div>
                <button class="sub-btn-conf" onclick="editSubItem(${id}, false)"></button>
            </div>
        </li>
    `
}

function singleUserContainer(initials, name = "XX", color = "red") {
    return `
        <div class="single-user-container" onclick="assignedUser('${name}', '${color}')">
            <div class="user-icon" style="background-color: ${color};">${initials}</div>
            <span class="user-name">${name}</span>
            <button class="btn-check"></button>
        </div>
    `
}

function userIcon(color = "red", initials = "XX") {
    return `
        <div class="user-icon" style="background-color: ${color}">${initials}</div>
    `
}