var settings = {
  "eventsRefresh": 60, // refresh events refresh rate, in seconds
  "calendarID": "228", // LibCal calendar ID
  "institutionID": "1448", // LibCal institution ID
  "categories": [5064, 4979, 4981], // an array of categories IDs from LibCal
  "logoFile": "img/Forbes-Logo-Vertical.png",
};

/**
 * We will store the script element for the remote LibCal script in this variable
 */
var remoteScript;

var params = (new URL(location)).searchParams;
if (params.has("category")) {
  settings.categories = params.getAll("category");
}
if (params.has("logoFile")) {
  settings.logoFile = params.getAll("logoFile");
}

var sidebar = document.getElementById('sidebar');
var clock = document.getElementById('clock');
var logo = document.getElementById('logo');
var borderWidth = parseFloat(getComputedStyle(document.body).getPropertyValue('border-left-width'));
var docWidth = document.documentElement.clientWidth + 0.0;
var docHeight = document.documentElement.clientHeight + 0.0;
var aspectRatio = docWidth / docHeight;
var eventDiv;

/**
 * Called on script load
 */
function init() {
  eventDiv = document.createElement('div');
  eventDiv.id = 'api_today_cid' + settings.calendarID + '_iid' + settings.institutionID;
  eventDiv.className = 'eventList';
  document.getElementsByTagName('body')[0].appendChild(eventDiv);

  logo.src = settings.logoFile;

  updateClock();
  loadEvents();
  setInterval(updateClock, 1000);
  setInterval(loadEvents, settings.eventsRefresh * 1000);
}

/**
 * Set the clock to the current time
 */
function updateClock() {
  var now = new Date();
  clock.innerHTML = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

/**
 * Build LibCal URL
 */
function eventsURL() {
  var url = 'https://api3.libcal.com/api_events.php?';
  url = url + 'iid=' + settings.institutionID;
  url = url + '&m=today';
  url = url + '&cid=' + settings.calendarID;
  url = url + '&d=' + settings.categories.join('-');
  url = url + '&context=object&format=js';
  url = url + '&nocache=' + Date.now();
  return url;
}

/**
 * Load events
 */
function loadEvents() {
  if (remoteScript) {
    remoteScript.remove();
  }
  remoteScript = document.createElement('script');
  remoteScript.type = 'text/javascript';
  remoteScript.async = true;
  remoteScript.onload = function(){
      // remote script has loaded
      window.requestAnimationFrame(adapt);
  };
  remoteScript.src = eventsURL();
  document.getElementsByTagName('head')[0].appendChild(remoteScript);
}

/**
 * adapt the layout according to how much room today's events take up
 */
function adapt() {
  // scale events if they are two tall for screen
  var height = eventDiv.offsetHeight;
  var availableHeight;
  if (aspectRatio < 13.0/8.0) {
    availableHeight = docHeight  - sidebar.offsetHeight - borderWidth * 2;
  } else {
    availableHeight = docHeight - borderWidth * 2;
  }
  var scaleFactor = (availableHeight) / height;
  console.log(`Adapting stage 1: scaleFactor=${scaleFactor}`);
  if (aspectRatio < 13.0/8.0 && scaleFactor < 0.85) {
    // hide logo if font size would have to be reduced to less than 85%
    logo.style.display = "none";
    availableHeight = docHeight - sidebar.offsetHeight - borderWidth * 2;
    scaleFactor = (availableHeight) / height;
  }
  console.log(`Adapting stage 2: scaleFactor=${scaleFactor}`);
  if (height > availableHeight) {
    eventDiv.style['transform-origin'] = "top left";
    eventDiv.style.transform = 'scale(' + scaleFactor + ',' + scaleFactor + ')';
    eventDiv.style.width = docWidth / scaleFactor;
  } else {
    eventDiv.style.transform = 'translateY(' + (availableHeight - height) / 3 + 'px)';
  }
}

init();
