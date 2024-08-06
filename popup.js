document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["interval", "time", "unit"], function (result) {
    if (result.time) {
      document.getElementById("time").value = result.time;
    }
    if (result.unit) {
      document.getElementById("unit").value = result.unit;
    }
  });
});

document.getElementById("save").addEventListener("click", function () {
  let time = document.getElementById("time").value;
  let unit = document.getElementById("unit").value;

  if (time && unit) {
    let interval;
    if (unit === "seconds") {
      interval = time * 1000;
    } else if (unit === "minutes") {
      interval = time * 60000;
    } else if (unit === "hours") {
      interval = time * 3600000;
    }

    chrome.storage.sync.set(
      { interval: interval, time: time, unit: unit },
      function () {
        console.log("Interval is set to " + interval + " ms");
      }
    );

    chrome.runtime.sendMessage({ type: "setAlarm", interval: interval });

    showTimer(interval);
  }
});

document.getElementById("reset").addEventListener("click", function () {
  chrome.runtime.sendMessage({ type: "resetAlarm" });
  document.getElementById("timer-container").style.display = "none";
  document.getElementById("time").value = "";
});

function showTimer(interval) {
  const timerContainer = document.getElementById("timer-container");
  const remainingTimeDisplay = document.getElementById("remaining-time");
  timerContainer.style.display = "block";

  let remainingTime = interval;
  remainingTimeDisplay.textContent = formatTime(remainingTime);

  setInterval(() => {
    remainingTime -= 1000;
    remainingTimeDisplay.textContent = formatTime(remainingTime);

    if (remainingTime <= 0) {
      remainingTime = interval;
      chrome.runtime.sendMessage({ type: "setAlarm", interval: interval });
    }
  }, 1000);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
