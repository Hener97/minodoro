import { FiPlay, FiPause } from 'solid-icons/fi';
import pomodoroStore from '../stores/pomodoro';

import { TbReload } from 'solid-icons/tb'
function TimerActions() {
  const handlePlayPause = () => {
    if (pomodoroStore.store.timerRunning) {
      pomodoroStore.pauseTimer();
    } else {
      pomodoroStore.startTimer();
    }
  };

  const handleReload = () => {
    pomodoroStore.resetTimer && pomodoroStore.resetTimer();
  };

  return (
    <div class="flex gap-4">
      {pomodoroStore.store.timerRunning ? (
        <FiPause
          onClick={handlePlayPause}
          class="cursor-pointer text-5xl text-white hover:text-gray-300 transition-colors transition-transform transform hover:scale-110 duration-300"
        />
      ) : (
        <FiPlay
          onClick={handlePlayPause}
          class="cursor-pointer text-5xl text-white hover:text-gray-300 transition-colors transition-transform transform hover:scale-110 duration-300"
        />
      )}
      <TbReload
        onClick={handleReload}
        class="cursor-pointer text-5xl text-white hover:text-gray-300 transition-colors transition-transform transform hover:scale-110 duration-300"
      />
    </div>
  );
}

export default TimerActions;
