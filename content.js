// Add a new "highlight" class to the current HTML page
var style = document.createElement("style");
style.id = "dunfy-temporary-style"
style.type = "text/css";
style.innerHTML = ".highlight:hover { background-color: yellow; }";
style.innerHTML += "html { cursor: crosshair;}";
document.getElementsByTagName('head')[0].appendChild(style);


var prev;
document.body.addEventListener('mouseover', highlightHover, false);
document.body.addEventListener('click', tagClicked, false);

function highlightHover(event) {
	if (event.target === document.body || (prev && prev === event.target)) {
		return;
	}
	if (prev) {
		prev.className = prev.className.replace(/\bhighlight\b/, '');
		prev = undefined;
	}
	if (event.target) {
		prev = event.target;
		prev.className += " highlight";
	}
}

function tagClicked(event) {
	if(prev) {
		// Save the targeted info
		dict = {};
		dict[document.URL] = {
			"title": document.getElementsByTagName("title")[0].innerHTML,
			"htmlObject": event.target.innerHTML
		}
		chrome.storage.sync.set(dict, function(){
			alert("successfully updated Google storage sync.");
		});
		
		// Clean up the HTML (restore it to its original state)
		// Remove the highlight class from the element we clicked on
		prev.className = prev.className.replace(/\bhighlight\b/, '');
		// Remove the event listeners
		document.body.removeEventListener('mouseover', highlightHover);
		document.body.removeEventListener('click', tagClicked);
		// Remove our injected CSS
		document.getElementById("dunfy-temporary-style").remove();
	}
}