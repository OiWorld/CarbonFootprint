var myScript = "window.addEventListener('click', function(event) {" +
               "  var t = event.target;" +
               "  if (t.nodeName == 'A')" +
               "    self.port.emit('click-link', t.toString());" +
               "}, false);"

window.addEventListener('click', function(ev) {
	var target = ev.target;
	if (target.dataset.tab) {
		self.port.emit('link', target.dataset.tab);
	}
});