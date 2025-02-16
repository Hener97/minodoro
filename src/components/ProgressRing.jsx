// FILE_PATH: src\components\ProgressRing.jsx
import { createMemo } from "solid-js";

function ProgressRing(props) {
  const size = props.size || 300
  const color = props.color || "stroke-blue-500";
  const progress = props.progress || 0;

  const radius = createMemo(() => size / 2 - 10);
  const circumference = createMemo(() => 2 * Math.PI * radius());
  const strokeOffset = createMemo(
    () => circumference() * (1 - progress / 100)
  );

  return (
    <div class="relative cursor-pointer" onClick={props.onClick}>
      <svg width={size} height={size}>
        <circle
          cx="50%"
          cy="50%"
          r={radius()}
          fill="transparent"
          class="stroke-gray-light-200 dark:stroke-gray-700 transition-colors duration-200"
          stroke-width="8"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius()}
          fill="transparent"
          class={`${color} transition-all duration-500`}
          stroke-width="8"
          stroke-dasharray={circumference()}
          stroke-dashoffset={strokeOffset()}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {props.children}
      </div>
    </div>
  );
}

export default ProgressRing;