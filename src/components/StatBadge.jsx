// FILE_PATH: src\components\StatBadge.jsx
import { createSignal, createEffect, onMount } from "solid-js";

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
      class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow transition-colors duration-200" // transition-colors hinzugefügt
      role="status"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">{icon}</span>
        <span class="text-sm font-medium text-gray-light-500 dark:text-gray-400 transition-colors duration-200"> {/* Light Mode Textfarbe, transition */}
          {title}
        </span>
      </div>

      <div class="text-3xl font-bold text-gray-light-800 dark:text-gray-100 transition-all duration-300 transition-colors duration-200"> {/* Light Mode Textfarbe, transition */}
        <span class="count-up">{animatedValue()}</span>
        <span class="text-lg ml-1">x</span>
      </div>

      <div class="mt-2 w-full bg-gray-light-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden transition-colors duration-200"> {/* Light Mode Backgroundfarbe, transition */}
        <div
          class="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

export default StatBadge;