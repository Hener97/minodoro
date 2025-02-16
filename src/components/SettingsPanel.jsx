// FILE_PATH: src\components\SettingsPanel.jsx
import { createSignal } from "solid-js";
import pomodoroStore from "../stores/pomodoro";

function SettingsPanel(props) {
  const [settings, setSettings] = createSignal({
    ...pomodoroStore.store.settings,
  });

  const saveSettings = () => {
    pomodoroStore.updateSettings(settings());
    props.onClose();
  };

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg transition-colors duration-200"> {/* transition hinzugefügt */}
        <div class="flex justify-between mb-4 text-gray-light-800 dark:text-white transition-colors duration-200"> {/* Light Mode Textfarbe, transition */}
          <h3 class="text-xl font-bold">Settings</h3>
          <button onClick={props.onClose} class="text-gray-light-600 dark:text-gray-400 hover:text-gray-light-800 dark:hover:text-white transition-colors duration-200">&times;</button> {/* Light Mode Button Farbe, transition */}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-1 text-gray-light-700 dark:text-gray-300 transition-colors duration-200">Pomodoro (minutes)</label> {/* Light Mode Label Farbe, transition */}
            <input
              type="number"
              value={settings().pomodoro}
              onInput={(e) =>
                setSettings({ ...settings(), pomodoro: Number(e.target.value) })
              }
              min="1"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-light-800 dark:border-gray-700 border-gray-light-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500" // Light Mode Input Text/Border Farbe, focus styles, transition
            />
          </div>

          <div>
            <label class="block mb-1 text-gray-light-700 dark:text-gray-300 transition-colors duration-200">Short Break (minutes)</label> {/* Light Mode Label Farbe, transition */}
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
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-light-800 dark:border-gray-700 border-gray-light-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500" // Light Mode Input Text/Border Farbe, focus styles, transition
            />
          </div>

          <div>
            <label class="block mb-1 text-gray-light-700 dark:text-gray-300 transition-colors duration-200">Long Break (minutes)</label> {/* Light Mode Label Farbe, transition */}
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
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white text-gray-light-800 dark:border-gray-700 border-gray-light-300 transition-colors duration-200 focus:ring-blue-500 focus:border-blue-500" // Light Mode Input Text/Border Farbe, focus styles, transition
            />
          </div>

          <button
            onClick={saveSettings}
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200" // transition hinzugefügt
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;