var content = document.getElementById('api_today_cid228_iid1448');
var clock = document.getElementById('clock');

/**
 * Set the clock to the current time
 */
function updateClock() {
  var now = new Date();
  clock.innerHTML = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

/**
 * adapt the layout according to how much room today's events take up
 */
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

setInterval(updateClock, 1000);
adapt();
