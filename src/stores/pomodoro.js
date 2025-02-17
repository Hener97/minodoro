import { createStore } from "solid-js/store";
import { createEffect, onCleanup } from "solid-js";

// Versuche, den persistierten Zustand aus dem localStorage zu laden
const storedState = localStorage.getItem("pomodoroStore");
let initialState = storedState
  ? JSON.parse(storedState)
  : {
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
      expectedEnd: null, // Zeitpunkt, an dem der Timer enden soll (in ms)
    };

// Falls der Timer vor dem Reload lief, berechne die verbleibende Zeit neu
if (initialState.timerRunning && initialState.expectedEnd) {
  const remaining = Math.ceil((initialState.expectedEnd - Date.now()) / 1000);
  initialState.timeRemaining = remaining > 0 ? remaining : 0;
  if (remaining <= 0) {
    initialState.timerRunning = false;
    initialState.expectedEnd = null;
  }
}

// Erstelle den Store
const [store, setStore] = createStore(initialState);

// Persistiere den Store bei Änderungen (ohne nicht-serialisierbare Daten wie Intervalle)
createEffect(() => {
  localStorage.setItem("pomodoroStore", JSON.stringify(store));
});

// Lokale Variable für das Interval – wird nicht im Store gespeichert
let timerInterval = null;

/**
 * Startet den Timer. Falls bereits ein Timer läuft, passiert nichts.
 * Setzt den erwarteten Endzeitpunkt und startet ein Interval, das jede Sekunde
 * die verbleibende Zeit neu berechnet.
 */
const startTimer = () => {
  if (store.timerRunning) return;

  // Timer starten und Endzeitpunkt setzen
  setStore("timerRunning", true);
  setStore("expectedEnd", Date.now() + store.timeRemaining * 1000);

  timerInterval = setInterval(() => {
    const newRemaining = Math.max(
      Math.ceil((store.expectedEnd - Date.now()) / 1000),
      0
    );
    setStore("timeRemaining", newRemaining);

    // Timer beenden, wenn die Zeit abgelaufen ist
    if (newRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      setStore("timerRunning", false);
      setStore("expectedEnd", null);
      setStore("sessionsCompleted", store.sessionsCompleted + 1);
    }
  }, 1000);
};

/**
 * Pausiert den Timer und löscht das Interval. Dadurch wird auch der Endzeitpunkt
 * zurückgesetzt.
 */
const pauseTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  setStore("timerRunning", false);
  setStore("expectedEnd", null);
};

/**
 * Setzt den Timer zurück auf die aktuelle Dauer der Session.
 */
const resetTimer = () => {
  pauseTimer();
  setStore("timeRemaining", store.currentDuration);
};

/**
 * Wechselt die aktuelle Session (Pomodoro, Short Break, Long Break) und setzt
 * die Dauer entsprechend.
 */
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

/**
 * Aktualisiert die Timer-Einstellungen. Falls die aktuelle Session "pomodoro" ist,
 * wird die Dauer direkt angepasst.
 */
const updateSettings = (newSettings) => {
  setStore("settings", { ...store.settings, ...newSettings });
  if (store.currentSession === "pomodoro") {
    const newDuration = store.settings.pomodoro * 60;
    setStore("currentDuration", newDuration);
    setStore("timeRemaining", newDuration);
  }
};

/**
 * Falls der Timer beim Reload bereits lief, wird hier automatisch ein neues Interval
 * gestartet, um den Timer fortzuführen.
 */
createEffect(() => {
  if (store.timerRunning && store.expectedEnd && !timerInterval) {
    timerInterval = setInterval(() => {
      const newRemaining = Math.max(
        Math.ceil((store.expectedEnd - Date.now()) / 1000),
        0
      );
      setStore("timeRemaining", newRemaining);
      if (newRemaining <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setStore("timerRunning", false);
        setStore("expectedEnd", null);
        setStore("sessionsCompleted", store.sessionsCompleted + 1);
      }
    }, 1000);
  }
});

// Stelle sicher, dass beim Unmounten des Components das Interval gelöscht wird
onCleanup(() => {
  if (timerInterval) clearInterval(timerInterval);
});

export default {
  store,
  updateSettings,
  startTimer,
  pauseTimer,
  resetTimer,
  switchSession,
};
