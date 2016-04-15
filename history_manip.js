/*
 * GLOBAL VARIABLES AND EVENTS
 */
//Defining the onBack, onForward, onRefresh, onHistoryJump events
var onBack = new Event("onBack", {"bubbles":false, "cancelable":false});
var onForward = new Event("onForward", {"bubbles":false, "cancelable":false});
var onRefresh = new Event("onRefresh", {"bubbles":false, "cancelable":false});
var onUnknownAction = new Event("onUnknownAction", {"bubbles":false, "cancelable":false});

//Should history be logged. Used for debugging purposes. 
var logHistoryInfo = 0;
//Action class name:
var action_class = "action";


/*
 * EVENT LISTENERS
 */
//onLoad listeners for the different browsers. Uses user agent so it isnt terribly secure.
//Then again if you count on javascript to handle your security, you deserve everything that happens to you.
if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
	opera.setOverrideHistoryNavigationMode('compatible');
	history.navigationMode = 'compatible';
	window.onload = history_manip;
}
else if(navigator.userAgent.indexOf("Safari") != -1) {
	window.addEventListener("pageshow", history_manip, false);
}
else {
	window.onload = history_manip;
}

//onUnload needs to be overridden so that onLoad will called on every page loading. 
window.onunload = function() {};

//catching clicks on any and all html controls of the class action_class
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if ( target.getAttribute('class') == action_class ) { DetectAction(); }
}, false);


/*
 * PRIVATE FUNCTIONS
 * Probably shouldn't be called if you don't know what you're doing
 */
function init() {
	sessionStorage.step_history = JSON.stringify([location.href]);
	sessionStorage.history_pointer = 0;
	sessionStorage.action_detected = 0;
}

function history_manip() {
	if(!sessionStorage.step_history) { init(); } 
	else {
		var step_history = JSON.parse(sessionStorage.step_history);
		var history_pointer = parseInt(sessionStorage.history_pointer);
		
    	if( sessionStorage.action_detected == 0 ) {
	    	if ( step_history[history_pointer-1] == location.href ) {
	    		sessionStorage.history_pointer = history_pointer-1;
	    		document.dispatchEvent(onBack);
	    	} 
	    	else if ( step_history[history_pointer+1] == location.href ) {
	    		sessionStorage.history_pointer = history_pointer+1;
	    		document.dispatchEvent(onForward);
	    	} 
	    	else if ( step_history[history_pointer] == location.href ) {
	    		document.dispatchEvent(onRefresh);
	    	} 
	    	else {
	    		document.dispatchEvent(onUnknownAction);
	    	}
    	} else {
	    	if(step_history.length-1 != history_pointer) {
	    		step_history = step_history.slice(0, history_pointer);
	    	}
	    	
    		step_history.push(location.href);
    		sessionStorage.step_history = JSON.stringify(step_history);
    		sessionStorage.history_pointer = step_history.length-1;
    	}
	}
	
	if ( window.logHistoryInfo == 1 ) {
		console.log("step_history: " 	+ sessionStorage.step_history);
		console.log("history_pointer: " + sessionStorage.history_pointer);
		console.log("action_detected: " + sessionStorage.action_detected);
	}
	
	sessionStorage.action_detected = 0;
}


/*
 * PUBLIC FUNCTIONS
 */
//This function should be used when you can't use the action_class. For example in a onChange event.
function DetectAction() { sessionStorage.action_detected=1; }

//Function to clear sessionStorage. It's a just wrapper, so you can of course use just sessionStorage.clear() 
function ClearSession() { sessionStorage.clear(); }