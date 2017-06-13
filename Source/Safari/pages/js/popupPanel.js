window.addEventListener('click', function(ev) {
  var target = ev.target;
    if (target.dataset.tab) {
      self.port.emit('link', target.dataset.tab);
    }
});
