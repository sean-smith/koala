// Get all the devices that the user uses
chrome.sessions.getDevices( function (devices){ 
	
	// Remove the loading graphic
	$("#loading").remove();

	// Get the devices
	for (i = 0; i < devices.length; i++) {
		$("#devices").append("<div class='device' data-sessionid='"+devices[i].sessions[0].window.sessionId+"'>"+devices[i].deviceName+"</div>");
		var sessions = devices[i].sessions;

		// For each session on a device
		for (j = 0; j < sessions.length; j++) {
			if (sessions[j].window) {
				var tabs = sessions[j].window.tabs;

				// For each window on a device
				for (k = 0; k < tabs.length; k++) {
					// Insert a favicon if availible
					$("#devices").append("<div class='link device-entry' data-url='"+tabs[k].url+"'><img class='link-img' src='chrome://favicon/size/16@1x/"+tabs[k].url+"'>"+tabs[k].title+"</div>");
				}
			}
			else if (sessions[j].tab) {
				alert("tab");
				var favicon_url = sessions[j].tab.favIconUrl ? "<img src='"+sessions[j].tab.favIconUrl+"'>" : "";
				$("#devices").append("<li class='link' data-url='"+sessions[j].tab.url+"'>"+favicon_url+"<a href='#'>"+sessions[j].tab.title+"</a></li>")
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
	  	var url = $(this).attr("data-url");
	  	var tabid = $(this).attr("data-tabid");
	  	$(this).remove();
		chrome.tabs.create({"url": url, "active": false}, function (tab){
			console.log("url = "+url);
		});
	});

	// If a device is clicked, trigger a new window with all the tabs
	$(".device").click(function () {
	  	var sessionid = $(this).attr("data-sessionid");
		chrome.sessions.restore(sessionid);
	});
}