// When the extension icon gets clicked (this script gets run):
// 		execute content.js on the DOM of the active tab.

//TODO: REMOVE after done testing
debug = true;
if(debug){
	chrome.storage.sync.clear(function(){
		alert("Cleared everything in storage.");
	});
}
chrome.tabs.query({currentWindow:true, active:true}, function(tabs) {
	var activeTab = tabs[0];
	chrome.tabs.executeScript(activeTab.id, {file:"content.js"}, function(){
		alert("content script finished successfully");
	});
});