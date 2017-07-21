alert("event page called");

chrome.alarms.create("periodicCheck", {delayInMinutes: 0, periodInMinutes: 1}); // First time, execute immediately, then every minute.
chrome.alarms.onAlarm.addListener(function (alarm) {
	if(alarm.name === "periodicCheck"){
		periodicCheck();
	}
});

function periodicCheck(){
	var somethingChanged = true;
	if(somethingChanged) {
		chrome.notifications.create(
		"", {
			type: "basic",
			title: "Primary Title",
			message: "Primary message to display",
			iconUrl: "icon.png"
		},
		function() {
			//alert("notification created successfully");
		});
	}
}