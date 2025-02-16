import { createSignal, createMemo } from "solid-js";
import pomodoroStore from "../stores/pomodoro";
import ProgressRing from "./ProgressRing";
import TasksPanel from "./TasksPanel";
import MusicPlayer from "./MusicPlayer";
import SettingsPanel from "./SettingsPanel";
import ThemeToggle from "./ThemeToggle";
import StatBadge from "./StatBadge";

function TimerComponent() {
  const [showSettings, setShowSettings] = createSignal(false);
  const [tasks, setTasks] = createSignal([
    "Prepare project plan",
    "Review code",
    "Write documentation",
  ]);

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
    pomodoros: pomodoroStore.store.sessionsCompleted * 2,
  }));

  const weeklyStats = createMemo(() => ({
    pomodoros: pomodoroStore.store.sessionsCompleted * 5,
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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Header mit Glasmorphism-Effekt */}
      <header class="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            🍅 Pomodash
            <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Beta 1.0
            </span>
          </h1>
          <div class="flex gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowSettings(!showSettings())}
              class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg transition-all text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              ⚙️ Customize
            </button>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main class="container mx-auto p-6">
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Timer-Sektion */}
          <div class="flex-1 flex flex-col items-center">
            {/* Motivations-Sektion */}
            <div class="mb-8 text-center animate-fade-in">
              <p class="text-xl mb-2 text-gray-800 dark:text-gray-200">
                🔥 Current Streak: 3 days
              </p>
              <div class="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-full text-indigo-800 dark:text-indigo-200">
                🎯 Focus Goal: {currentGoal()}
              </div>
            </div>

            {/* Progress Ring */}
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
                <div class="text-5xl font-mono mb-2 text-gray-800 dark:text-gray-200 transition-all duration-300">
                  {(() => {
                    const minutes = Math.floor(
                      pomodoroStore.store.timeRemaining / 60
                    );
                    const seconds = pomodoroStore.store.timeRemaining % 60;
                    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
                  })()}
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                  {sessionTypes[pomodoroStore.store.currentSession]} Session
                </div>
              </div>
            </ProgressRing>

            {/* Session Controls */}
            <div class="flex gap-4 mb-8">
              {Object.entries(sessionTypes).map(([key, session]) => (
                <button
                  onClick={() => pomodoroStore.switchSession(key)}
                  class={`px-6 py-2 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    pomodoroStore.store.currentSession === key
                      ? `text-white ${sessionColors[key]} border-transparent`
                      : "text-gray-700 dark:text-gray-300 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  {session}
                </button>
              ))}
            </div>

            {/* Aktionsbuttons */}
            <div class="flex gap-4 mb-8">
              <button
                onClick={() => {
                  if (pomodoroStore.store.timerRunning)
                    pomodoroStore.pauseTimer();
                  else pomodoroStore.startTimer();
                }}
                class={`px-8 py-3 rounded-full text-lg font-semibold transition-transform active:scale-95 ${
                  pomodoroStore.store.timerRunning
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {pomodoroStore.store.timerRunning ? "⏸ Pause" : "▶️ Start"}
              </button>
              <button
                onClick={() => pomodoroStore.resetTimer()}
                class="px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 active:scale-95"
              >
                ↻ Reset
              </button>
            </div>

            {/* Statistiken */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center w-full">
              <StatBadge
                title="Today"
                value={dailyStats().pomodoros}
                icon="🍅"
                maxValue={10}
              />
              <StatBadge
                title="Week"
                value={weeklyStats().pomodoros}
                icon="📅"
                maxValue={10}
              />
              <StatBadge
                title="Total"
                value={pomodoroStore.store.sessionsCompleted}
                icon="🏆"
                maxValue={10}
              />
            </div>
          </div>

          {/* Aufgaben-Sektion */}
          <TasksPanel
            tasks={tasks()}
            onTaskAdded={addTask}
            onTaskRemoved={removeTask}
            onTaskReordered={reorderTasks}
          />
        </div>
      </main>

      {/* Musiksteuerung */}
      <div class="fixed bottom-0 left-0 right-0 z-50">
        <MusicPlayer />
      </div>

      {/* Einstellungs-Panel */}
      {showSettings() && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default TimerComponent;
