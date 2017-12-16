var settings = {
  "eventsRefresh": 60, // refresh events refresh rate, in seconds
  "calendarID": "228", // LibCal calendar ID
  "institutionID": "1448", // LibCal institution ID
  "categories": [5064, 4979, 4981], // an array of categories IDs from LibCal
  "logoFile": "img/Forbes_logo_noSubText_margins.png",
};

var clock = document.getElementById('clock');
var logo = document.getElementById('logo');
var docWidth = document.documentElement.clientWidth;
var docHeight = document.documentElement.clientHeight;
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
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function(){
      // remote script has loaded
      adapt();
  };
  script.src = eventsURL();
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * adapt the layout according to how much room today's events take up
 */
function adapt() {
  // scale events if they are two tall for screen
  var height = eventDiv.offsetHeight;
  if (height > docHeight) {
    var scaleFactor = (docHeight + 0.0) / height;
    eventDiv.style['transform-origin'] = "top left";
    eventDiv.style.transform = 'scale(' + scaleFactor + ',' + scaleFactor + ')';
    eventDiv.style.width = 860.0 / scaleFactor;
  } else {
    eventDiv.style.transform = 'translateY(' + (docHeight - height) / 3 + 'px)';
  }
}

/**
 * Returns the number of events
 */
function eventCount() {
  return eventDiv.childNodes.length - 1;
}

init();
