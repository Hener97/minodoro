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
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
        <div class="flex justify-between mb-4">
          <h3 class="text-xl font-bold">Settings</h3>
          <button onClick={props.onClose}>×</button>
        </div>

        <div class="space-y-4">
          <div>
            <label>Pomodoro (minutes)</label>
            <input
              type="number"
              value={settings().pomodoro}
              onInput={(e) =>
                setSettings({ ...settings(), pomodoro: Number(e.target.value) })
              }
              min="1"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label>Short Break (minutes)</label>
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
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label>Long Break (minutes)</label>
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
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={saveSettings}
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
