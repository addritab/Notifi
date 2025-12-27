var STORAGE_KEY = "notifi_checklist_tasks_v1";
var inputBox = document.getElementById("input-task");
var listContainer = document.getElementById("task-list");
var addTaskBtn = document.getElementById("add-task-btn");
function loadTasks() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return [];
    try {
        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed;
    }
    catch (_a) {
        return [];
    }
}
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function makeId() {
    return "".concat(Date.now(), "_").concat(Math.random().toString(16).slice(2));
}
var tasks = loadTasks();
function renderTasks() {
    listContainer.innerHTML = "";
    var _loop_1 = function (task) {
        var li = document.createElement("li");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks(tasks);
        });
        var span = document.createElement("span");
        span.className = "task-text";
        span.textContent = " ".concat(task.text);
        span.addEventListener("click", function () {
            tasks = tasks.filter(function (t) { return t.id !== task.id; });
            saveTasks(tasks);
            renderTasks();
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        listContainer.appendChild(li);
    };
    for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
        var task = tasks_1[_i];
        _loop_1(task);
    }
}
function addTask() {
    var text = inputBox.value.trim();
    if (text === "") {
        alert("Insert a task to complete");
        return;
    }
    tasks.push({ id: makeId(), text: text, completed: false });
    saveTasks(tasks);
    renderTasks();
    inputBox.value = "";
    inputBox.focus();
}
addTaskBtn.addEventListener("click", addTask);
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter")
        addTask();
});
renderTasks();
