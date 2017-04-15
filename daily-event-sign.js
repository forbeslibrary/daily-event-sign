function updateClock() {
  var now = new Date();
  document.getElementById('clock').innerHTML = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
var content = document.getElementById('api_today_cid228_iid1448');
function adapt() {
  // scale events if they are two tall for screen
  var height = content.offsetHeight;
  if (height > 768) {
    var scaleFactor = 768.0 / height;
    content.style['transform-origin'] = "top left";
    content.style.transform = 'scale(' + scaleFactor + ',' + scaleFactor + ')';
  } else {
    content.style.transform = 'translateY(' + (768 - height) / 3 + 'px)';
  }
}
adapt();
// for testing ///////
var numberOfEvents = 1;
var events = content.childNodes;
function grow() {
  if (numberOfEvents < 16) {
    numberOfEvents++;
  } else {
    numberOfEvents = 1;
  }

  for (i=2; i<events.length; i++) {
    if (i<numberOfEvents) {
      events[i].style.display = 'block';
    } else {
      events[i].style.display = 'none';
    }
  }
  adapt();
}
//setInterval(grow, 500);
