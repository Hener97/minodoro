// FILE_PATH: src\components\TasksPanel.jsx
import { createSignal } from 'solid-js';

function TasksPanel(props) {
    let draggedIndex = null;
    const [newTask, setNewTask] = createSignal("");

    const addTask = (e) => {
      if (e.key === "Enter" && newTask().trim()) {
        props.onTaskAdded(newTask().trim());
        setNewTask("");
      }
    };

    const handleDragStart = (index) => {
      draggedIndex = index;
    };

    const handleDragOver = (index) => {
      if (draggedIndex !== index) {
        const items = [...props.tasks];
        const item = items[draggedIndex];
        items.splice(draggedIndex, 1);
        items.splice(draggedIndex, 0, item);
        props.onTaskReordered(items);
        draggedIndex = index;
      }
    };

    const handleDrop = () => {
      draggedIndex = null;
    };

    return (
      <div class="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300">
        <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white transition-colors duration-300">Tasks ({props.tasks.length})</h2>
        <input
          value={newTask()}
          onInput={(e) => setNewTask(e.target.value)}
          onKeyUp={addTask}
          placeholder="Add new task..."
          class="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <ul class="space-y-2">
          {props.tasks.map((task, index) => (
            <li
              key={index}
              draggable="true"
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDrop={handleDrop}
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-move transition-all hover:scale-102 hover:shadow-sm duration-200"
            >
              <div class="flex justify-between items-center text-gray-800 dark:text-gray-300">
                {task}
                <button
                  onClick={() => props.onTaskRemoved(index)}
                  class="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  export default TasksPanel;