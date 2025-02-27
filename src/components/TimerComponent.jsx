import { createSignal, createMemo, createEffect } from "solid-js";
import pomodoroStore from "../stores/pomodoro";
import ProgressRing from "./ProgressRing";
import TasksPanel from "./TasksPanel";
import MusicPlayer from "./MusicPlayer";
import SettingsPanel from "./SettingsPanel";
// Import new component
import StatsSidebar from "./StatsSidebar";
import TimerActions from "./TimerActions";
import { IoSettingsOutline } from 'solid-icons/io'

// Lade Tasks aus localStorage oder setze Default-Werte
const storedTasks = localStorage.getItem("pomodoroTasks");
const initialTasks = storedTasks ? JSON.parse(storedTasks) : [
  "Prepare project plan",
  "Review code",
  "Write documentation",
];

function TimerComponent() {
  const [showSettings, setShowSettings] = createSignal(false);
  const [tasks, setTasks] = createSignal(initialTasks);

  // Persistiere Tasks bei Änderungen
  createEffect(() => {
    localStorage.setItem("pomodoroTasks", JSON.stringify(tasks()));
  });

  // Effekt: Aktualisiere den Dokument-Titel mit verbleibender Zeit
  createEffect(() => {
    const remaining = pomodoroStore.store.timeRemaining;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Pomodash`;
  });

  const sessionTypes = {
    pomodoro: "Focus Time",
    break: "Short Break",
    longBreak: "Long Break",
  };

  const sessionColors = {
    pomodoro: "bg-red-500",
    break: "bg-blue-500",
    longBreak: "bg-green-500",
  };

  const timeProgress = createMemo(
    () =>
      (pomodoroStore.store.timeRemaining / pomodoroStore.store.currentDuration) *
      100
  );

  const currentGoal = createMemo(() =>
    pomodoroStore.store.sessionsCompleted >= 8
      ? "Complete!"
      : `${8 - pomodoroStore.store.sessionsCompleted} pomodoros left`
  );

  const dailyStats = createMemo(() => ({
    pomodoros: pomodoroStore.store.sessionsCompleted * 2, // Beispielwert
  }));

  const weeklyStats = createMemo(() => ({
    pomodoros: pomodoroStore.store.sessionsCompleted * 5, // Beispielwert
  }));

  const addTask = (task) => {
    if (task.trim()) setTasks([...tasks(), task.trim()]);
  };

  const removeTask = (index) => {
    setTasks(tasks().filter((_, i) => i !== index));
  };

  const reorderTasks = (newTasks) => {
    setTasks(newTasks);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-light-50 to-blue-light-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/** Header mit Glasmorphism-Effekt */}
      <header class="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 px-6 py-4 border-b border-gray-light-200/50 dark:border-gray-700/50 shadow-sm transition-colors duration-200">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold flex items-center gap-2 text-gray-light-800 dark:text-white transition-colors duration-200">
            🍅 Pomodash
            <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Beta 1.0
            </span>
          </h1>
          <div class="flex gap-3">
            <button
              onClick={() => setShowSettings(!showSettings())}
              class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg transition-all text-gray-light-700 dark:text-gray-300 transition-colors duration-200"
            >
              <IoSettingsOutline class="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/** Hauptinhalt */}
      <main class="container mx-auto p-6">
        <div class="flex flex-col lg:flex-row gap-8">
          {/** Left sidebar with stats */}
          <div class="lg:w-1/6 mt-4 -ml-2">
            <StatsSidebar />
          </div>

          {/** Center content with timer */}
          <div class="lg:w-1/2 flex flex-col gap-8">
            <div class="flex flex-col items-center">
              {/** Motivations-Sektion */}
              <div class="mb-8 text-center animate-fade-in">
                <p class="text-2xl mb-2 text-gray-light-800 dark:text-gray-200 transition-colors duration-200">
                  🔥 Current Streak: 3 days
                </p>
                <div class="inline-flex items-center gap-2 bg-indigo-light-100 dark:bg-indigo-900 px-4 py-2 rounded-full text-indigo-light-800 dark:text-indigo-200 transition-colors duration-200">
                  🎯 Focus Goal: {currentGoal()}
                </div>
              </div>

              {/** Progress Ring */}
              <ProgressRing
                progress={timeProgress()}
                color={sessionColors[pomodoroStore.store.currentSession]}
                onClick={() => {
                  if (pomodoroStore.store.timerRunning)
                    pomodoroStore.pauseTimer();
                  else pomodoroStore.startTimer();
                }}
              >
                <div class="text-center">
                  <div class="text-6xl font-mono mb-2 text-gray-light-800 dark:text-gray-200 transition-colors duration-200">
                    {(() => {
                      const minutes = Math.floor(pomodoroStore.store.timeRemaining / 60);
                      const seconds = pomodoroStore.store.timeRemaining % 60;
                      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
                    })()}
                  </div>
                  <div class="text-lg text-gray-light-500 dark:text-gray-400 transition-colors duration-200">
                    {sessionTypes[pomodoroStore.store.currentSession]} Session
                  </div>
                </div>
              </ProgressRing>

              {/** Session Controls */}
              <div class="flex gap-4 mb-8">
                {Object.entries(sessionTypes).map(([key, session]) => (
                  <button
                    onClick={() => pomodoroStore.switchSession(key)}
                    class={`px-6 py-2 rounded-full border-2 transition-all text-gray-light-700 dark:text-gray-300 ${pomodoroStore.store.currentSession === key
                      ? `text-white ${sessionColors[key]} border-transparent`
                      : "border-gray-light-200 hover:border-gray-light-300 dark:border-gray-700 dark:hover:border-gray-600 transition-colors duration-200"
                      }`}
                  >
                    {session}
                  </button>
                ))}
              </div>

              {/** Aktionsbuttons - replaced with TimerActions component */}
              <TimerActions />
            </div>
          </div>

          {/** Right side with tasks */}
          <div class="lg:w-1/4">
            <TasksPanel
              tasks={tasks()}
              onTaskAdded={addTask}
              onTaskRemoved={removeTask}
              onTaskReordered={reorderTasks}
            />
          </div>
        </div>
      </main>

      {/** Musiksteuerung */}
      <div class="fixed bottom-0 left-0 right-0">
        <MusicPlayer />
      </div>

      {/** Einstellungs-Panel */}
      {showSettings() && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default TimerComponent;
