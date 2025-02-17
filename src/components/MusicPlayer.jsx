// FILE_PATH: src\components\MusicPlayer.jsx
import { createSignal, createEffect, onCleanup } from "solid-js";
import { FiPlay } from 'solid-icons/fi';
import { HiOutlinePause } from 'solid-icons/hi';
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

  // Track-Änderung überwachen
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

  // Vollbildmodus an/aus
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    // Updated: slimmer container with reduced padding and full width, no extra horizontal margins
    <div
      id="playerContainer"
      class="w-full bg-white dark:bg-gray-800 p-1 sm:p-0 shadow-2xl rounded-2xl transition-colors duration-300"
    >
      {/* Steuerleiste oben, controls shifted to left */}
      <div class="flex items-center justify-start gap-4 ps-2 pe-2 px-2">
        <button
          onClick={togglePlay}
          class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          {isPlaying() ? (
            <HiOutlinePause class="cursor-pointer text-4xl text-gray-800 dark:text-gray-300" />
          ) : (
            <FiPlay class="cursor-pointer text-4xl text-gray-800 dark:text-gray-300" />
          )}
        </button>

        <select
          value={currentTrack()}
          onInput={(e) => setCurrentTrack(Number(e.target.value))}
          class="bg-transparent text-gray-800 dark:text-gray-300 dark:bg-gray-700 rounded-lg px-2 py-1 transition-colors duration-300"
        >
          {playlist().map((track, index) => (
            <option value={index} key={index}>
              {track.title}
            </option>
          ))}
        </select>

        {/* Fullscreen-Button (optional repositioned left if desired) */}
        <button
          onClick={toggleFullScreen}
          class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>

      {/* Zeit-Info + Slider */}
      <div class="flex items-center gap-2 mb-2 pl-2">
        <span class="text-sm text-gray-800 dark:text-gray-300">
          {currentTimeFormatted()}
        </span>
        <span class="text-sm text-gray-500">/</span>
        <span class="text-sm text-gray-800 dark:text-gray-300">
          {duration() ? formatTime(duration()) : "00:00"}
        </span>
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
        class="w-full accent-blue-600 cursor-pointer"
      />
    </div>
  );
}

// Hilfsfunktion zur Formatierung der Gesamtzeit
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default MusicPlayer;
