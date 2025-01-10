// Declare the task action select element
const taskActionSelec = document.getElementById(
  "task-action-select"
) as HTMLSelectElement;


taskActionSelec.addEventListener("change", (event) => {
  const selectedAction = (event.target as HTMLSelectElement).value;

  // Show the appropriate form based on selected action
  if (selectedAction === "create") {
    // Show create task form
    document.getElementById("create-task-form")!.style.display = "block";
    document.getElementById("edit-task-form")!.style.display = "none";
    document.getElementById("delete-task-form")!.style.display = "none";
  } else if (selectedAction === "edit") {
    // Show edit task form
    document.getElementById("edit-task-form")!.style.display = "block";
    document.getElementById("create-task-form")!.style.display = "none";
    document.getElementById("delete-task-form")!.style.display = "none";
  } else if (selectedAction === "delete") {
    // Show delete task form
    document.getElementById("delete-task-form")!.style.display = "block";
    document.getElementById("create-task-form")!.style.display = "none";
    document.getElementById("edit-task-form")!.style.display = "none";
  }
});
