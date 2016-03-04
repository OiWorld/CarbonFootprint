function saveOptions() {
  var emission = document.getElementById('emission');
  var carbonEmission = emission.value;
  localStorage['carbonEmission'] = carbonEmission;

  var average = document.getElementById('average');
  var vehicleAverage = average.value;
  localStorage['vehicleAverage'] = vehicleAverage;

  var fuelPrice = document.getElementById('price');
  var vehicleFuelPrice = fuelPrice.value;
  localStorage['vehicleFuelPrice'] = vehicleFuelPrice;

  // Update status to let user know options were saved.
  var status = document.getElementById('save-message');
  status.innerHTML = 'Saved!';
  setTimeout(function() {
    status.innerHTML = '';
  }, 750);
}

function S(key) { return localStorage[key]; }

function restoreOptions() {
  var emission = document.getElementById('emission');
  emission.setAttribute('value', S('carbonEmission'));
  
  var fuelPrice = document.getElementById('price');
  fuelPrice.setAttribute('value', S('vehicleFuelPrice'));
  
  var vehicleAverage = document.getElementById('average');
  vehicleAverage.setAttribute('value', S('vehicleAverage'));
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save-button').addEventListener('click', saveOptions);
});

window.onload = restoreOptions ;

googleAnalytics('UA-1471148-11');
