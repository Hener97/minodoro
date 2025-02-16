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
        items.splice(index, 0, item);
        props.onTaskReordered(items);
        draggedIndex = index;
      }
    };
  
    const handleDrop = () => {
      draggedIndex = null;
    };
  
    return (
      <div class="w-96 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 class="text-xl font-bold mb-4">Tasks ({props.tasks.length})</h2>
        <input
          value={newTask()}
          onInput={(e) => setNewTask(e.target.value)}
          onKeyUp={addTask}
          placeholder="Add new task..."
          class="w-full mb-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600"
        />
        <ul class="space-y-2">
          {props.tasks.map((task, index) => (
            <li
              key={index}
              draggable="true"
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDrop={handleDrop}
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-move transition-transform hover:scale-[1.02]"
            >
              <div class="flex justify-between items-center">
                {task}
                <button
                  onClick={() => props.onTaskRemoved(index)}
                  class="text-red-500 hover:text-red-700"
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
