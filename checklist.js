const inputBox = document.getElementById("input-task");
const listContainer = document.getElementById("task-list");
const addTaskBtn = document.getElementById("add-task-btn");

function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === '') {
        alert("Insert a task to complete");
        return;
    }
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let span = document.createElement("span");
    span.textContent = " " + taskText;
    span.className = "task-text";
    span.addEventListener('click', function() {
        li.remove();
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    listContainer.appendChild(li);
    inputBox.value = '';
    inputBox.focus();
}

// adds task when the plus sign button/enter is clicked

addTaskBtn.addEventListener('click', addTask);
inputBox.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTask();
});
