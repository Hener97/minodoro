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

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const items = [...props.tasks];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    
    props.onTaskReordered(items);
    draggedIndex = index;
  };

  const handleDrop = () => {
    draggedIndex = null;
  };

  return (
    <div class="w-96 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl transition-all duration-300">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
        📝 Tasks ({props.tasks.length})
      </h2>
      <input
        value={newTask()}
        onInput={(e) => setNewTask(e.target.value)}
        onKeyUp={addTask}
        placeholder="➕ Add new task..."
        class="w-full mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <ul class="space-y-3">
        {props.tasks.map((task, index) => (
          <li
            key={index}
            draggable="true"
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move transition-transform hover:scale-105 hover:shadow-md duration-200"
          >
            <div class="flex justify-between items-center text-gray-800 dark:text-gray-300">
              <span>✅ {task}</span>
              <button
                onClick={() => props.onTaskRemoved(index)}
                class="text-red-500 hover:text-red-700 transition-colors duration-200 text-xl"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPanel;