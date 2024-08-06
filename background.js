chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "setAlarm") {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create({
        delayInMinutes: request.interval / 60000,
        periodInMinutes: request.interval / 60000,
      });
    });
  } else if (request.type === "resetAlarm") {
    chrome.alarms.clearAll();
  }
});

chrome.alarms.onAlarm.addListener(() => {
  triggerNotification();
});

function triggerNotification() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Time to Drink Water",
    message: "Stay Hydrated, Stay Focused with Vky!",
    priority: 0,
  });
}
