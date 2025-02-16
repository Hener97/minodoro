import { createMemo, createSignal, createEffect, onMount } from "solid-js";
import pomodoroStore from "../stores/pomodoro";

function StatBadge(props) {
  const { title, value, icon, maxValue } = props;
  const [animatedValue, setAnimatedValue] = createSignal(0);

  const animateValue = (newVal) => {
    const duration = 1000;
    const start = animatedValue();
    const range = newVal - start;
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedValue(Math.floor(start + range * progress));
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  onMount(() => {
    animateValue(value);
  });
  createEffect(() => {
    animateValue(props.value);
  });

  return (
    <div
      class="flex flex-col items-center justify-center p-2 w-32 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow transition-colors duration-200 transform hover:scale-105"
      role="status"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">{icon}</span>
        <span class="text-lg font-medium text-gray-light-500 dark:text-gray-400 transition-colors duration-200">
          {title}
        </span>
      </div>

      <div class="text-4xl font-bold text-gray-light-800 dark:text-gray-100 transition-all duration-300 transition-colors duration-200">
        <span class="count-up">{animatedValue()}</span>
        <span class="text-lg ml-1">x</span>
      </div>

      <div class="mt-2 w-full bg-gray-light-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden transition-colors duration-200">
        <div
          class="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

function StatsSidebar() {
  const daily = createMemo(() => pomodoroStore.store.sessionsCompleted * 2);
  const weekly = createMemo(() => pomodoroStore.store.sessionsCompleted * 5);
  const total = createMemo(() => pomodoroStore.store.sessionsCompleted);

  return (
    <div class="flex flex-col gap-6">
      <StatBadge title="Today" value={daily()} icon="🍅" maxValue={10} />
      <StatBadge title="Week" value={weekly()} icon="📅" maxValue={10} />
      <StatBadge title="Total" value={total()} icon="🏆" maxValue={10} />
    </div>
  );
}

export default StatsSidebar;
