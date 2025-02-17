import { createSignal } from 'solid-js';

// FILE_PATH: src\components\TasksPanel.jsx
import { HiOutlineXMark } from 'solid-icons/hi'
import { BsPlusCircle } from 'solid-icons/bs'
import { IoCheckmarkCircleOutline } from 'solid-icons/io'
import { BsClipboard } from 'solid-icons/bs'
import { TbEdit } from 'solid-icons/tb'

import { IoSave } from 'solid-icons/io'

function TasksPanel(props) {
  let draggedIndex = null;
  const [newTask, setNewTask] = createSignal("");
  const [completedTasks, setCompletedTasks] = createSignal(new Set()); // Zustand für erledigte Aufgaben
  // Neuer Zustand für bearbeitende Task
  const [editingIndex, setEditingIndex] = createSignal(null);
  const [editingText, setEditingText] = createSignal("");

  const addTask = (e) => {
    if (e.key === "Enter" && newTask().trim()) {
      props.onTaskAdded(newTask().trim());
      setNewTask("");
    }
  };

  const startEditing = (index, task) => {
    setEditingIndex(index);
    setEditingText(task);
  };

  const saveEdit = (index) => {
    if (editingText().trim()) {
      props.onTaskEdited && props.onTaskEdited(index, editingText().trim());
      setEditingIndex(null);
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

  const toggleComplete = (index) => {
    const newCompletedTasks = new Set(completedTasks());
    if (newCompletedTasks.has(index)) {
      newCompletedTasks.delete(index);
    } else {
      newCompletedTasks.add(index);
    }
    setCompletedTasks(newCompletedTasks);
  };

  return (
    <div class="w-96 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl transition-all duration-300">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
        <BsClipboard class="inline-block mr-2" /> Tasks ({props.tasks.length})
      </h2>
      {/* Neuer Container für Input mit Icon */}
      <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg mb-4 p-2">
        <BsPlusCircle class="mr-2 h-5 w-5 text-gray-400" />
        <input
          value={newTask()}
          onInput={(e) => setNewTask(e.target.value)}
          onKeyUp={addTask}
          placeholder="Add new task..."
          class="w-full outline-none bg-transparent text-gray-800 dark:text-white"
        />
      </div>
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
              {editingIndex() === index ? (
                // Bearbeitungsmodus: Input-Feld und Speichern-Button
                <>
                  <input
                    value={editingText()}
                    onInput={(e) => setEditingText(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && saveEdit(index)}
                    class="flex-1 mr-2 bg-white dark:bg-gray-600 rounded p-1 text-gray-800"
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    class="text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    <IoSave class="h-5 w-5" />
                  </button>
                </>
              ) : (
                // Normaler Modus: Anzeige + Edit- und Lösch-Button
                <>
                  <span class={`flex-1 ${completedTasks().has(index) ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>
                    <IoCheckmarkCircleOutline
                      class="inline-block mr-2 cursor-pointer h-5 w-5"
                      onClick={() => toggleComplete(index)}
                    />
                    {task}
                  </span>
                  <button
                    onClick={() => startEditing(index, task)}
                    class="mr-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <TbEdit />
                  </button>
                  <button
                    onClick={() => props.onTaskRemoved(index)}
                    class="text-red-600 hover:text-red-800 transition-colors duration-200 text-xl"
                  >
                    <HiOutlineXMark />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPanel;
