alert("in event script");
chrome.alarms.create("periodicCheck", {delayInMinutes: 0, periodInMinutes: 1}); // First time, execute immediately, then every minute.
chrome.alarms.onAlarm.addListener(function (alarm) {
	if(alarm.name === "periodicCheck"){
		periodicCheck();
	}
});

var debug = false;

function periodicCheck(){
	chrome.storage.sync.get(null, function(items) { // "get(null.." will get every item in google storage
		for(var key in items) {
			if(items.hasOwnProperty(key)) {
				getDomFromUrl(key, function(doc){
					var iconHref = getFavicon(doc);
					iconHref = formatHref(key, iconHref);
					chrome.notifications.create(
					"", {
						type: "basic",
						title: items[key]["title"],
						message: strip(items[key]["htmlObject"]),
						iconUrl: iconHref
					},
					function() {
						if(debug){alert("notification successfully created");}
					});
					chrome.notifications.onClicked.addListener(function(){
						chrome.tabs.create({ url: "showChanges.html" }, function(tab){
							alert(tab["id"]);
							//TODO: dynamically add a link towards the wanted page inside showChanges.html
						});
					});
				});
			}
		}
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

function formatHref(url, href) {
	// Remove leading '/' characters
	while(href[0]=='/'){
		href = href.slice(1, href.length);
	}
	//if http and www not found
	if(href.search("http") == -1 && href.search("www") == -1) {
		// alert("http and www not found in " + href);
		dotFound = false;
		posEnd = -1;
		for(var i=0; i<url.length; i++) {
			if(dotFound && url[i] == "/") {
				posEnd = i;
				break;
			}
			else if(url[i] == '.') {
				dotFound = true;
			}
		}
		// alert("/ found at position "+posEnd+" in "+url);
		if(posEnd == -1) {
			return url+"/"+href;
		}
		else{
			url.slice(0, posEnd);
			return url.slice(0, posEnd+1) + href;
		}
	}
	if(href.search("http") != 0){ //http not at beginning
		return "http://" + href;
	}
	return href;
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

//https://stackoverflow.com/https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d