// FILE_PATH: src\stores\pomodoro.js
import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  settings: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  currentSession: "pomodoro",
  currentDuration: 25 * 60,
  timeRemaining: 25 * 60,
  timerRunning: false,
  sessionsCompleted: 0,
  intervalId: null,
});

const updateSettings = (newSettings) => {
  setStore("settings", { ...store.settings, ...newSettings });
  if (store.currentSession === "pomodoro") {
    const newDuration = store.settings.pomodoro * 60;
    setStore("currentDuration", newDuration);
    setStore("timeRemaining", newDuration);
  }
};

const startTimer = () => {
  if (store.timerRunning) return;
  setStore("timerRunning", true);
  const id = setInterval(() => {
    if (store.timeRemaining > 0) {
      setStore("timeRemaining", store.timeRemaining - 1);
    } else {
      clearInterval(store.intervalId);
      setStore("timerRunning", false);
      setStore("sessionsCompleted", store.sessionsCompleted + 1);
      // Optional: Automatisches Umschalten der Session
    }
  }, 1000);
  setStore("intervalId", id);
};

const pauseTimer = () => {
  if (store.intervalId) {
    clearInterval(store.intervalId);
    setStore("timerRunning", false);
  }
};

const resetTimer = () => {
  pauseTimer();
  setStore("timeRemaining", store.currentDuration);
};

const switchSession = (session) => {
  pauseTimer();
  setStore("currentSession", session);
  let newDuration = store.currentDuration;
  if (session === "pomodoro") {
    newDuration = store.settings.pomodoro * 60;
  } else if (session === "break") {
    newDuration = store.settings.shortBreak * 60;
  } else if (session === "longBreak") {
    newDuration = store.settings.longBreak * 60;
  }
  setStore("currentDuration", newDuration);
  setStore("timeRemaining", newDuration);
};

export default {
  store,
  updateSettings,
  startTimer,
  pauseTimer,
  resetTimer,
  switchSession,
};
