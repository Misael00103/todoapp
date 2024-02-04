const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn btn-info">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn btn-danger">Delete</button> 
        </div>
      `;
  });
};

const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.classList.add("exit-animation");

  setTimeout(() => {
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data", JSON.stringify(taskData));
  }, 500); // Ajusta el tiempo de la animación
};

const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
};

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () => taskForm.classList.toggle("hidden"));

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    taskForm.classList.toggle("hidden");
  }
});

cancelBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  taskForm.classList.toggle("hidden");
});

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
  taskForm.classList.toggle("hidden");
  reset();
});

// Agregar efecto de deslizamiento a la derecha y cambio de color al hacer hover en los botones
const slideRightButtons = (buttons) => {
  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.style.transition = "transform 0.3s ease-in-out, background-color 0.3s ease-in-out";
      button.style.transform = "translateX(5px)";
      button.style.backgroundColor = "#ff9999"; // Ajusta el color al que desees
    });

    button.addEventListener("mouseout", () => {
      button.style.transition = "transform 0.3s ease-in-out, background-color 0.3s ease-in-out";
      button.style.transform = "translateX(0)";
      button.style.backgroundColor = ""; // Restablecer al color original
    });
  });
};

const buttons = document.querySelectorAll(".btn");
slideRightButtons(buttons);
