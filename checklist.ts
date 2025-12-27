type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "notifi_checklist_tasks_v1";

const inputBox = document.getElementById("input-task") as HTMLInputElement;
const listContainer = document.getElementById("task-list") as HTMLUListElement;
const addTaskBtn = document.getElementById("add-task-btn") as HTMLButtonElement;

function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

let tasks: Task[] = loadTasks();

function renderTasks(): void {
  listContainer.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", (): void => {
      task.completed = checkbox.checked;
      saveTasks(tasks);
    });

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = ` ${task.text}`;

    span.addEventListener("click", (): void => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks(tasks);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    listContainer.appendChild(li);
  }
}

function addTask(): void {
  const text = inputBox.value.trim();
  if (text === "") {
    alert("Insert a task to complete");
    return;
  }

  tasks.push({ id: makeId(), text, completed: false });
  saveTasks(tasks);
  renderTasks();

  inputBox.value = "";
  inputBox.focus();
}

addTaskBtn.addEventListener("click", addTask);

inputBox.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.key === "Enter") addTask();
});

renderTasks();
