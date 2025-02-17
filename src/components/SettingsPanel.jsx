import { createSignal } from "solid-js";
import pomodoroStore from "../stores/pomodoro";
import { HiOutlineXMark } from 'solid-icons/hi';

function SettingsPanel(props) {
  const [settings, setSettings] = createSignal({
    ...pomodoroStore.store.settings,
  });

  const saveSettings = () => {
    pomodoroStore.updateSettings(settings());
    props.onClose();
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-gray-700 transition-colors duration-300 transform scale-100 opacity-100">
        <div class="flex justify-between mb-6 text-gray-800 dark:text-white">
          <h3 class="text-2xl font-bold">Settings</h3>
          <button
            onClick={props.onClose}
            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 focus:outline-none"
          >
            <HiOutlineXMark class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-6">
          <div class="transition-transform duration-300 ease-in-out transform hover:scale-105">
            <label class="block mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Pomodoro (minutes)
            </label>
            <input
              type="number"
              value={settings().pomodoro}
              onInput={(e) =>
                setSettings({ ...settings(), pomodoro: Number(e.target.value) })
              }
              min="1"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-800 dark:border-gray-700 border-gray-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="transition-transform duration-300 ease-in-out transform hover:scale-105">
            <label class="block mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Short Break (minutes)
            </label>
            <input
              type="number"
              value={settings().shortBreak}
              onInput={(e) =>
                setSettings({
                  ...settings(),
                  shortBreak: Number(e.target.value),
                })
              }
              min="1"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-800 dark:border-gray-700 border-gray-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="transition-transform duration-300 ease-in-out transform hover:scale-105">
            <label class="block mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Long Break (minutes)
            </label>
            <input
              type="number"
              value={settings().longBreak}
              onInput={(e) =>
                setSettings({
                  ...settings(),
                  longBreak: Number(e.target.value),
                })
              }
              min="1"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-800 dark:border-gray-700 border-gray-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={saveSettings}
            class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none transform hover:scale-105"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
