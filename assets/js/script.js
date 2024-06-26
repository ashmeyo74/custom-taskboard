// Retrieve tasks and nextId from localStorage, sets to an empty array otherwise
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
const taskboardModal = document.getElementById("taskboardModal");
const taskInput = document.getElementById("modalContent");

let toDoContainer = document.getElementById("todo-cards");
let inProgressContainer = document.getElementById("in-progress-cards");
let doneContainer = document.getElementById("done-cards");

let taskAddDiv = document.getElementById("submitBtnDiv");
let addTaskButton = document.getElementById("addTaskBtn");
let taskForm = document.querySelector("#taskForm");

// Creates card post dynamically by appending divs to their parent element in cascading order.
function createTaskCard(task) {
  console.log("Creating task card for task:", task); // Debugging output
  
  // Configures dates
  const now = dayjs();
  const tomorrow = dayjs().add(1, "day");
  const setDate = dayjs(task.Date);

  let cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.setAttribute("draggable", true);
  // Sets an ID for the card
  cardContainer.setAttribute("id", task.id);

  cardContainer.addEventListener("dragstart", handleDragStart);

  let titleDiv = document.createElement("div");
  titleDiv.classList.add("titleDiv");

  let title = document.createElement("p");
  title.classList.add("title");
  title.textContent = task.Title;

  let date = document.createElement("p");
  date.classList.add("date");
  date.textContent = `Due On: ${task.Date}`;

  let description = document.createElement("p");
  description.classList.add("description");
  description.textContent = `${task.Description}`;

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.dataset.taskId = task.id; // Store the task ID in a data attribute
  deleteButton.textContent = "DELETE TASK";
  deleteButton.addEventListener("click", handleDeleteTask);

  titleDiv.appendChild(title);
  cardContainer.appendChild(titleDiv);
  cardContainer.appendChild(description);
  cardContainer.appendChild(date);
  cardContainer.appendChild(deleteButton);
  toDoContainer.appendChild(cardContainer);

  // Checks if the task date is beefore the 'now' varaible. If so, adds the 'isLate' class.
  if (setDate.isBefore(now, "day")) {
    cardContainer.classList.add("isLate");

    // Checks if the task date is the same as the 'tomorrow' varaible. If so, adds the 'dueSoon' class.
  } else if (setDate.isSame(tomorrow, "day")) {
    cardContainer.classList.add("dueSoon");
  }
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing tasks
  toDoContainer.innerHTML = "";

  // For each array found in the taskList storage, generate a new post.
  taskList.forEach((task) => {
    createTaskCard(task);
  });
}

// Creates a new task dependant on form entry
function handleAddTask(event) {
  event.preventDefault();

  let title = document.getElementById("taskTitleInfo").value;
  let date = document.getElementById("taskDueDate").value;
  let description = document.getElementById("taskDescriptionArea").value;
  let taskID = Date.now();

  let newTask = {
    id: taskID,
    Title: title,
    Date: date,
    Description: description
  };

  taskList.push(newTask);

  // Converts taskList into a string and saves it to localStorage.
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

  //  Resets the form after user submit
  taskForm.reset();
}

function allowDrop(event) {
  event.preventDefault();
}

// Add event listeners to the drop target elements
const dropTargets = document.querySelectorAll("#to-do, #in-progress, #done");
dropTargets.forEach((target) => {
  target.addEventListener("dragover", allowDrop);
  target.addEventListener("drop", handleDrop);
});

// Handles task deletion
function handleDeleteTask(event) {
  event.preventDefault();
  const taskId = event.target.dataset.taskId; // Get the task ID from the data attribute
  taskList = taskList.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}


// On set into new lane, saves text data  and appends to that lane
function handleDrop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  const draggableElement = document.getElementById(id);
  event.target.appendChild(draggableElement);
  event.dataTransfer.clearData();
}

// on page load, renders task list and listens for submit
$(document).ready(function () {
  renderTaskList();
  taskForm.addEventListener("submit", handleAddTask);
});
