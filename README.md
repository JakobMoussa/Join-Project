<div align="center">

  <img src="assets/icons/join-logo.svg" alt="Join Logo" width="100" height="100" />

  # Join &mdash; Kanban Project Management Tool

  **A modern, intuitive task management web application inspired by the Kanban methodology.**  
  Streamline team workflows, track progress in real time, and collaborate seamlessly.

  [Live Demo](https://jakobmoussa.github.io/Join-Project/) &bull; [Report Bug](https://github.com/JakobMoussa/Join-Project/issues) &bull; [Request Feature](https://github.com/JakobMoussa/Join-Project/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Special Highlights](#-special-highlights)
- [Getting Started](#-getting-started)
- [Contributors](#-contributors)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🚀 About The Project

**Join** is an agile task and project management tool built to simplify team collaboration. Inspired by industry-standard Kanban boards like Jira and Trello, Join provides a structured yet flexible environment to organize, prioritize, and track tasks from conception to completion.

The project features a clean and modern user interface, real-time cloud data persistence via **Firebase Realtime Database**, dynamic subtask tracking, and an integrated **Stakeholder Request & AI Ticket Workflow**.

---

## ✨ Key Features

### 📋 Interactive Kanban Board
- **4 Workflow Stages**: `To Do`, `In Progress`, `Awaiting Feedback`, and `Done`.
- **Drag & Drop**: Fluid HTML5 Drag & Drop to shift tasks between columns.
- **Task Search**: Real-time filter by title and description.
- **Detailed Task Modal**: View full descriptions, assigned members, due dates, categories, priorities, and subtasks.
- **In-Place Editing**: Edit tasks directly without leaving the board view.
- **Subtask Progress**: Visual progress bars displaying completion status per card.

### 📊 Summary Dashboard
- **Real-Time Metrics**: Instant count of tasks across all statuses.
- **Urgent Priority Tracker**: Displays the number of urgent tasks and highlights the nearest upcoming deadline.
- **Dynamic Greeting**: Time-aware greeting (Morning / Afternoon / Evening) personalized with the active user's name.

### 📝 Comprehensive Task Creator
- **Categorization**: Assign tasks as *Technical Task* or *User Story*.
- **Priority Levels**: Choose between *Urgent*, *Medium*, and *Low* with visual indicators.
- **Contact Assignment**: Multi-select dropdown with auto-generated contact avatars and colors.
- **Subtask System**: Add, edit, check off, or delete subtasks dynamically.
- **Direct Column Injection**: Quickly create a task targeted at any specific column.

### 👥 Contact Management (Address Book)
- **Alphabetical Organization**: Contacts sorted and grouped with letter dividers.
- **Color-Coded Avatars**: Automatic generation of initials and unique color assignment.
- **Full CRUD**: Create new contacts, edit details (name, email, phone), or delete entries.
- **Direct Actions**: Quick links to trigger email or phone calls.

### 🔐 Authentication & Access Control
- **User Registration & Login**: Client-side validation with secure credential checking against Firebase.
- **Guest Login**: One-click access for evaluation and visitors without registration.
- **Session Handling**: Persistent user state with URL and session parameters.

---

## 💡 Special Highlights

### 🤖 Stakeholder Email Flow & AI-Generated Tickets
Join bridges the gap between external stakeholders and development teams:
- **Stakeholder Portal**: Non-team members can submit feature requests directly via a dedicated email request workflow.
- **AI Ticket Integration**: Requests can be transformed into structured tickets with auto-calculated priorities, categories, and deadlines.
- **Creator Badges**: Tasks clearly distinguish between **Team Member** tickets and **Extern / AI-Generated** tickets, with direct contact links to the original requester.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / CSS3 / ES6+ JavaScript | Modern, dependency-free vanilla web development |
| **Styling** | Custom CSS / Flexbox / CSS Grid | Mobile-first, responsive design with smooth animations |
| **Typography** | Inter Variable Font | Clean and modern typography |
| **Backend / DB** | Firebase Realtime Database | RESTful API communication (`fetch` / JSON endpoints) |
| **Version Control** | Git / GitHub | Feature branch workflow and collaborative development |

---

## 📂 Project Architecture

```
Join-Project/
├── index.html                  # Welcome / Role Selection landing page
├── script.js                   # Shared utility scripts
├── style.css                   # Global styles
├── assets/
│   ├── fonts/                  # Inter variable typography
│   └── icons/                  # SVG & PNG UI icons and illustrations
├── html-templates/
│   ├── login.html              # Member authentication
│   ├── signup.html             # User registration
│   ├── summary.html            # Dashboard overview
│   ├── board.html              # Kanban board
│   ├── add-task.html           # Task creation page
│   ├── contacts.html           # Contact address book
│   ├── stakeholder-request.html# Stakeholder email request portal
│   ├── legal-notice.html       # Legal notice (Impressum)
│   ├── privacy-policy.html     # Privacy policy
│   └── help.html               # User guide & documentation
├── scripts/
│   ├── api.js                  # Firebase REST API client (GET, POST, PUT, DELETE)
│   ├── board.js                # Kanban board logic, drag-and-drop & task cards
│   ├── add-task.js             # Task creation & subtask management
│   ├── contact.js              # Contact management & avatar generation
│   ├── summary.js              # Dashboard metrics & greeting logic
│   ├── login.js & signup.js    # Authentication handlers
│   ├── templates.js            # Reusable HTML template components
│   └── welcome.js              # Landing splash screen animation
└── styles/                     # Modular CSS stylesheets per component
```

---

## 🚦 Getting Started

### Prerequisites
To run this project locally, you only need a modern web browser. No complex package installations or build steps are required.

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JakobMoussa/Join-Project.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd Join-Project
   ```

3. **Open the project:**
   - Simply open `index.html` in your favorite browser, or
   - Use the **VS Code Live Server** extension (recommended for local development):
     - Right-click `index.html` &rarr; `Open with Live Server`.

---

## 👥 Contributors

This project was developed collaboratively by:

- **Jakob Moussa** &mdash; [GitHub Profile](https://github.com/JakobMoussa)
- **Henning Otte** &mdash; [GitHub Profile](https://github.com/HenningOtte)
- **InfiniteLoop889** &mdash; [GitHub Profile](https://github.com/InfiniteLoop889)
- **Marc**

---

## 📄 License & Acknowledgments

- Built as part of the **Developer Akademie** Frontend Developer curriculum.
- Icons & Design inspiration provided by Developer Akademie.