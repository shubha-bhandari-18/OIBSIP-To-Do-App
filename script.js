const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ADD TASK

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString(),
        completedAt: null
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});


// SAVE

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// RENDER

function renderTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingTasks.forEach(task => {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(task => {
        completedList.appendChild(createTaskElement(task));
    });

    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;

    pendingEmpty.style.display =
        pendingTasks.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completedTasks.length === 0 ? "block" : "none";
}


// CREATE TASK ELEMENT

function createTaskElement(task) {

    const li = document.createElement("li");

    li.className = "task-item";

    if (task.completed) {
        li.classList.add("completed");
    }


    const content = document.createElement("div");

    content.className = "task-content";


    const text = document.createElement("div");

    text.className = "task-text";
    text.textContent = task.text;


    const time = document.createElement("div");

    time.className = "task-time";

    if (task.completed) {

        time.textContent =
            `Added: ${task.createdAt} | Completed: ${task.completedAt}`;

    } else {

        time.textContent =
            `Added: ${task.createdAt}`;
    }


    content.appendChild(text);
    content.appendChild(time);


    const actions = document.createElement("div");

    actions.className = "task-actions";


    // COMPLETE / UNDO

    const completeButton = document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.textContent =
        task.completed ? "Undo" : "Mark Complete";

    completeButton.addEventListener("click", () => {

        task.completed = !task.completed;

        task.completedAt = task.completed
            ? new Date().toLocaleString()
            : null;

        saveTasks();
        renderTasks();
    });


    // EDIT

    const editButton = document.createElement("button");

    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {

        const newText = prompt(
            "Edit your task:",
            task.text
        );

        if (newText === null) {
            return;
        }

        const updatedText = newText.trim();

        if (updatedText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = updatedText;

        saveTasks();
        renderTasks();
    });


    // DELETE

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {

        const confirmed = confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();
        renderTasks();
    });


    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(content);
    li.appendChild(actions);

    return li;
}


// INITIAL DISPLAY

renderTasks();