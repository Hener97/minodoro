// FILE_PATH: src\components\MusicPlayer.jsx
import { createSignal, createEffect, onCleanup } from "solid-js";

function MusicPlayer() {
  const [playlist] = createSignal([
    { title: "Lo-fi Chill", url: "/audio/lofi.mp3" },
    { title: "Classical Study", url: "/audio/classical.mp3" },
  ]);
  const [audio] = createSignal(new Audio());
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTrack, setCurrentTrack] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [progress, setProgress] = createSignal(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = createSignal("00:00");

  // Wenn sich der aktuelle Track ändert:
  createEffect(() => {
    const trackIndex = currentTrack();
    audio().src = playlist()[trackIndex].url;
    audio().play();
    setIsPlaying(true);
  });

  const togglePlay = () => {
    if (isPlaying()) {
      audio().pause();
      setIsPlaying(false);
    } else {
      audio().play();
      setIsPlaying(true);
    }
  };

  // Audio-Event-Handler
  const timeUpdateHandler = () => {
    setProgress(audio().currentTime);
    const minutes = Math.floor(audio().currentTime / 60);
    const seconds = Math.floor(audio().currentTime % 60);
    setCurrentTimeFormatted(
      `${minutes}:${seconds.toString().padStart(2, "0")}`
    );
  };

  const loadedMetadataHandler = () => {
    setDuration(audio().duration);
  };

  audio().addEventListener("timeupdate", timeUpdateHandler);
  audio().addEventListener("loadedmetadata", loadedMetadataHandler);

  onCleanup(() => {
    audio().removeEventListener("timeupdate", timeUpdateHandler);
    audio().removeEventListener("loadedmetadata", loadedMetadataHandler);
  });

  return (
    <div class="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg transition-colors duration-200"> {/* Light Mode bg-white, expliziter rounded-lg, transition */}
      <div class="flex items-center gap-4">
        <button
          onClick={togglePlay}
          class="p-2 rounded-full bg-gray-light-200 dark:bg-gray-700 hover:bg-gray-light-300 dark:hover:bg-gray-600 transition-colors duration-200"  // Light Mode hover bg
        >
          {isPlaying() ? "⏸" : "▶️"}
        </button>
        <select
          value={currentTrack()}
          onInput={(e) => setCurrentTrack(Number(e.target.value))}
          class="bg-transparent flex-1 text-gray-light-700 dark:text-gray-300 dark:bg-gray-700 transition-colors duration-200 rounded" // Light Mode text color, rounded
        >
          {playlist().map((track, index) => (
            <option value={index} key={index}>
              {track.title}
            </option>
          ))}
        </select>
        <span class="text-sm text-gray-light-700 dark:text-gray-300 transition-colors duration-200">{currentTimeFormatted()}</span> {/* Light Mode text color */}
      </div>
      <input
        type="range"
        min="0"
        max={duration()}
        value={progress()}
        onInput={(e) => {
          const newTime = Number(e.target.value);
          setProgress(newTime);
          audio().currentTime = newTime;
        }}
        class="w-full mt-2"
      />
    </div>
  );
}

export default MusicPlayer;