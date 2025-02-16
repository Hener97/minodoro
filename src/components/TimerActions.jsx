import pomodoroStore from "../stores/pomodoro";

function TimerActions() {
  return (
    <div class="flex gap-4 mb-8">
      <button
        onClick={() => {
          if (pomodoroStore.store.timerRunning)
            pomodoroStore.pauseTimer();
          else pomodoroStore.startTimer();
        }}
        class={`px-8 py-3 rounded-full text-lg font-semibold transition-transform hover:scale-105 transition-colors duration-200 ${
          pomodoroStore.store.timerRunning
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {pomodoroStore.store.timerRunning ? "⏸ Pause" : "▶️ Start"}
      </button>
      <button
        onClick={() => pomodoroStore.resetTimer()}
        class="px-6 py-3 rounded-full bg-gray-light-200 hover:bg-gray-light-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-light-700 dark:text-gray-300"
      >
        ↻ Reset
      </button>
    </div>
  );
}

export default TimerActions;
