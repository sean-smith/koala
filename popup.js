// Sean Smith 2016
// seanssmith.com
// Feel free to copy!

// Get all the devices that the user uses
chrome.sessions.getDevices( function (devices){ 
	
	// Remove the loading graphic
	$("#loading").remove();

	// Get the devices
	for (i = 0; i < devices.length; i++) {
		var sessions = devices[i].sessions;
		var device_name = devices[i].deviceName;

		// For each session on a device
		for (j = 0; j < sessions.length; j++) {
			if (sessions[j].window) {
				$("#devices").append("<div class='device' data-sessionid='"+sessions[j].window.sessionId+"'>"+device_name+"</div>");
				var tabs = sessions[j].window.tabs;

				// For each window on a device
				for (k = 0; k < tabs.length; k++) {
					// Add the tab to the list
					$("#devices").append("<div class='link device-entry' data-sessionid='"+tabs[k].sessionId+"'><img class='link-img' src='chrome://favicon/size/16@1x/"+tabs[k].url+"'>"+tabs[k].title+"</div>");
				}
			}
			else if (sessions[j].tab) {
				// Add device name
				$("#devices").append("<div class='device' data-sessionid='"+sessions[j].tab.sessionId+"'>"+device_name+"</div>");
				// List tab inline
				$("#devices").append("<div class='link device-entry'><img class='link-img' src='chrome://favicon/size/16@1x/"+sessions[j].tab.url+"'>"+sessions[j].tab.title+"</div>");
			}
		}
	}
	// Setup listeners
	listen();
});

function listen () {
	// If a link is clicked open a new tab (unfocused) and remove link from list
	// Also close the tab on the device
	$(".link").click(function () {
		var sessionid = $(this).attr("data-sessionid");
	  	$(this).remove();
	  	chrome.sessions.restore(sessionid);
	});

	// If a device is clicked, trigger a new window with all the tabs
	$(".device").click(function () {
	  	var sessionid = $(this).attr("data-sessionid");
		chrome.sessions.restore(sessionid);
	});
}