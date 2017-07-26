alert("event page called");

chrome.alarms.create("periodicCheck", {delayInMinutes: 0, periodInMinutes: 1}); // First time, execute immediately, then every minute.
chrome.alarms.onAlarm.addListener(function (alarm) {
	if(alarm.name === "periodicCheck"){
		periodicCheck();
	}
});

function periodicCheck(){
	chrome.storage.sync.get(null, function(items) { // "get(null.." will get every item in google storage
		alert("get");
		var value;
		Object.keys(items).forEach(function(key) {
			getDomFromUrl(key, function(doc){
				alert("bla");
				alert(key);
				alert(items["title"]);
				alert(items["htmlObject"]);
				chrome.notifications.create(
				"", {
					type: "basic",
					title: "title",
					message: "message",
					iconUrl: getFavicon(doc)
				},
				function() {
					alert("notification created successfully");
				});
			});
		});
	});
}

function getFavicon(dom) {
    var favicon = undefined;
    var nodeList = dom.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++)
    {
        if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
        {
            favicon = nodeList[i].getAttribute("href");
        }
    }
    return favicon;
}

function getDomFromUrl(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'document';
	xhr.send();
	xhr.onload = function(e) {
		var doc = e.target.responseXML;
		callback(doc);
	}
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}