// ==========================================
// INDU'S TASK PLANNER
// SKILLCRAFT TECHNOLOGY - TASK 04
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const taskTime =
    document.getElementById("taskTime");

const addTaskButton =
    document.getElementById("addTaskButton");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const clearCompletedButton =
    document.getElementById("clearCompleted");

const allCount =
    document.getElementById("allCount");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const progressFill =
    document.getElementById("progressFill");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");

const progressMessage =
    document.getElementById("progressMessage");

const motivationText =
    document.getElementById("motivationText");

const dateDisplay =
    document.getElementById("dateDisplay");


// ==========================================
// VARIABLES
// ==========================================

let tasks = [];

let currentFilter = "all";


// ==========================================
// LOAD TASKS FROM LOCAL STORAGE
// ==========================================

const savedTasks =
    localStorage.getItem(
        "induTaskPlannerTasks"
    );


if (savedTasks) {

    try {

        tasks = JSON.parse(savedTasks);

    } catch (error) {

        tasks = [];

    }

}


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "induTaskPlannerTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// CREATE UNIQUE TASK ID
// ==========================================

function createTaskId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


// ==========================================
// DISPLAY TODAY'S DATE
// ==========================================

function displayTodayDate() {

    const today = new Date();

    dateDisplay.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


// ==========================================
// SET DEFAULT DATE
// ==========================================

function setDefaultDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    taskDate.value =
        `${year}-${month}-${day}`;

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(timeString) {

    if (!timeString) {

        return "";

    }

    const [hours, minutes] =
        timeString.split(":");

    const date = new Date();

    date.setHours(
        Number(hours)
    );

    date.setMinutes(
        Number(minutes)
    );

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const title =
        taskInput.value.trim();


    if (title === "") {

        alert(
            "Please enter a task first."
        );

        taskInput.focus();

        return;

    }


    const newTask = {

        id: createTaskId(),

        title: title,

        date: taskDate.value,

        time: taskTime.value,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";

    taskTime.value = "";


    renderTasks();

    updateProgress();

    taskInput.focus();

}


// ==========================================
// ADD BUTTON CLICK
// ==========================================

addTaskButton.addEventListener(
    "click",
    addTask
);


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


// ==========================================
// FILTER BUTTONS
// ==========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


// ==========================================
// GET FILTERED TASKS
// ==========================================

function getFilteredTasks() {

    if (
        currentFilter === "pending"
    ) {

        return tasks.filter(
            function (task) {

                return !task.completed;

            }
        );

    }


    if (
        currentFilter === "completed"
    ) {

        return tasks.filter(
            function (task) {

                return task.completed;

            }
        );

    }


    return tasks;

}


// ==========================================
// SORT TASKS
// ==========================================

function sortTasks(taskArray) {

    return [...taskArray].sort(
        function (a, b) {

            // Pending tasks first
            if (
                a.completed !==
                b.completed
            ) {

                return a.completed
                    ? 1
                    : -1;

            }


            const first =
                `${a.date || "9999-12-31"} ${
                    a.time || "23:59"
                }`;


            const second =
                `${b.date || "9999-12-31"} ${
                    b.time || "23:59"
                }`;


            return first.localeCompare(
                second
            );

        }
    );

}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        sortTasks(
            getFilteredTasks()
        );


    emptyState.style.display =
        filteredTasks.length === 0
            ? "block"
            : "none";


    filteredTasks.forEach(
        function (task) {

            // -----------------------------
            // TASK ITEM
            // -----------------------------

            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.className =
                "task-item";


            if (task.completed) {

                taskItem.classList.add(
                    "completed"
                );

            }


            // -----------------------------
            // COMPLETE BUTTON
            // -----------------------------

            const completeButton =
                document.createElement(
                    "button"
                );


            completeButton.className =
                "complete-button";


            completeButton.innerHTML =
                task.completed
                    ? "✓"
                    : "";


            completeButton.title =
                task.completed
                    ? "Mark as pending"
                    : "Mark as completed";


            completeButton.addEventListener(
                "click",
                function () {

                    toggleTask(
                        task.id
                    );

                }
            );


            // -----------------------------
            // CONTENT
            // -----------------------------

            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "task-content";


            // Task title
            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "task-title";


            title.textContent =
                task.title;


            // Details
            const details =
                document.createElement(
                    "div"
                );


            details.className =
                "task-details";


            // Date
            if (task.date) {

                const dateBadge =
                    document.createElement(
                        "span"
                    );


                dateBadge.className =
                    "task-detail";


                dateBadge.textContent =
                    `📅 ${formatDate(task.date)}`;


                details.appendChild(
                    dateBadge
                );

            }


            // Time
            if (task.time) {

                const timeBadge =
                    document.createElement(
                        "span"
                    );


                timeBadge.className =
                    "task-detail";


                timeBadge.textContent =
                    `⏰ ${formatTime(task.time)}`;


                details.appendChild(
                    timeBadge
                );

            }


            content.appendChild(
                title
            );


            content.appendChild(
                details
            );


            // -----------------------------
            // ACTION BUTTONS
            // -----------------------------

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "task-actions";


            // Edit button
            const editButton =
                document.createElement(
                    "button"
                );


            editButton.className =
                "action-button edit-button";


            editButton.textContent =
                "✏️";


            editButton.title =
                "Edit task";


            editButton.addEventListener(
                "click",
                function () {

                    editTask(
                        task.id
                    );

                }
            );


            // Delete button
            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "action-button delete-button";


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "Delete task";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTask(
                        task.id
                    );

                }
            );


            actions.appendChild(
                editButton
            );


            actions.appendChild(
                deleteButton
            );


            // -----------------------------
            // BUILD TASK ITEM
            // -----------------------------

            taskItem.appendChild(
                completeButton
            );


            taskItem.appendChild(
                content
            );


            taskItem.appendChild(
                actions
            );


            taskList.appendChild(
                taskItem
            );

        }
    );


    updateCounts();

}


// ==========================================
// TOGGLE COMPLETED
// ==========================================

function toggleTask(id) {

    tasks =
        tasks.map(
            function (task) {

                if (
                    task.id === id
                ) {

                    return {
                        ...task,
                        completed:
                            !task.completed
                    };

                }

                return task;

            }
        );


    saveTasks();

    renderTasks();

    updateProgress();

}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {

        return;

    }


    const newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle === null
    ) {

        return;

    }


    const updatedTitle =
        newTitle.trim();


    if (
        updatedTitle === ""
    ) {

        alert(
            "Task cannot be empty."
        );

        return;

    }


    task.title =
        updatedTitle;


    const changeDetails =
        confirm(
            "Do you want to change the date and time?"
        );


    if (changeDetails) {

        const newDate =
            prompt(
                "Enter date (YYYY-MM-DD):",
                task.date || ""
            );


        if (
            newDate !== null
        ) {

            task.date =
                newDate.trim();

        }


        const newTime =
            prompt(
                "Enter time (HH:MM):",
                task.time || ""
            );


        if (
            newTime !== null
        ) {

            task.time =
                newTime.trim();

        }

    }


    saveTasks();

    renderTasks();

    updateProgress();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task) {

        return;

    }


    const shouldDelete =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!shouldDelete) {

        return;

    }


    tasks =
        tasks.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveTasks();

    renderTasks();

    updateProgress();

}


// ==========================================
// CLEAR COMPLETED
// ==========================================

clearCompletedButton.addEventListener(
    "click",
    function () {

        const completedTasks =
            tasks.filter(
                function (task) {

                    return task.completed;

                }
            );


        if (
            completedTasks.length === 0
        ) {

            alert(
                "There are no completed tasks to clear."
            );

            return;

        }


        const shouldClear =
            confirm(
                "Clear all completed tasks?"
            );


        if (!shouldClear) {

            return;

        }


        tasks =
            tasks.filter(
                function (task) {

                    return !task.completed;

                }
            );


        saveTasks();

        renderTasks();

        updateProgress();

    }
);


// ==========================================
// UPDATE COUNTS
// ==========================================

function updateCounts() {

    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const pending =
        tasks.length -
        completed;


    allCount.textContent =
        tasks.length;


    pendingCount.textContent =
        pending;


    completedCount.textContent =
        completed;

}


// ==========================================
// UPDATE PROGRESS
// ==========================================

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    // Progress bar
    progressFill.style.width =
        `${percentage}%`;


    // Percentage
    progressPercent.textContent =
        `${percentage}%`;


    // Progress heading
    progressText.textContent =
        `${percentage}% completed`;


    // Motivational messages
    if (total === 0) {

        progressMessage.textContent =
            "Start your first task and build momentum. 🌱";


        motivationText.textContent =
            "Let's make today a beautiful day! ☀️";

    }

    else if (percentage === 100) {

        progressMessage.textContent =
            "Amazing! You completed everything. 🌟";


        motivationText.textContent =
            "You did it! Be proud of yourself. 💚";

    }

    else if (percentage >= 75) {

        progressMessage.textContent =
            "Almost there! Keep going. 💪";


        motivationText.textContent =
            "You're doing amazing! Keep shining. ✨";

    }

    else if (percentage >= 40) {

        progressMessage.textContent =
            "Great progress. Keep the momentum going! ✨";


        motivationText.textContent =
            "You're making it happen! 💕";

    }

    else {

        progressMessage.textContent =
            "Every completed task is a step forward. 🌱";


        motivationText.textContent =
            "One little step at a time. You've got this! 💖";

    }

}


// ==========================================
// INITIALIZE APP
// ==========================================

displayTodayDate();

setDefaultDate();

renderTasks();

updateProgress();