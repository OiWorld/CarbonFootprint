function createAutoClosingAlert(selector, delay) {
  $(selector).fadeTo(delay, 500).slideUp(500, function(){
  });
}

function saveOptionsEmissions() {
  var emission = document.getElementById('emission');
  var carbonEmission = emission.value;
  localStorage['carbonEmission'] = carbonEmission;

  // Update status to let user know options were saved.
  createAutoClosingAlert("#saved-alert", 1000);
}

function saveOptionsFuelCost() {
  var fuelCost = document.getElementById('fuel-cost');
  localStorage['fuelCost'] = fuelCost.value;

  // Update status to let user know options were saved.
  createAutoClosingAlert("#saved-alert", 2000);
}

function displayTravelCost() {
  
  var isChecked = document.getElementById("display-travel-cost").checked;
 
  if (isChecked){
    localStorage['displayTravelCost'] = true;    
    document.getElementById("average-mileage-div").style.visibility = "visible";
    document.getElementById("fuel-cost-div").style.visibility = "visible";
  }
  else{
    localStorage['displayTravelCost'] = false;
    document.getElementById("average-mileage-div").style.visibility = "hidden";
    document.getElementById("fuel-cost-div").style.visibility = "hidden";
  }
}

function saveOptionsAverageMileage() {
  var averageMileage = document.getElementById('average-mileage');
  localStorage['averageMileage'] = averageMileage.value;

  // Update status to let user know options were saved.
  createAutoClosingAlert("#saved-alert", 2000);
}



function S(key) { return localStorage[key]; }

function restoreOptions() {
  var emission = document.getElementById('emission');
  emission.setAttribute('value', S('carbonEmission'));

  var fuelCost = document.getElementById('fuel-cost');
  fuelCost.setAttribute('value', S('fuelCost'));
  
  var displayTravelCostCheckbox = document.getElementById('display-travel-cost');
  var isTrue = (S('displayTravelCost') === "true");
  
  // Checks the value of displayTravelCost flag and changes the visibility
  // of the checkbox

  if(isTrue){  
    displayTravelCostCheckbox.checked = true;
    document.getElementById("average-mileage-div").style.visibility = "visible";
    document.getElementById("fuel-cost-div").style.visibility = "visible";
  }
  else{
    displayTravelCostCheckbox.checked = false;
  }
 
  var averageMileage = document.getElementById('average-mileage');
  averageMileage.setAttribute('value', S('averageMileage'));

}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save-button-emission').addEventListener('click', saveOptionsEmissions);
  document.getElementById('save-button-fuel-cost').addEventListener('click', saveOptionsFuelCost);
  document.getElementById('display-travel-cost').addEventListener('change', displayTravelCost);
  document.getElementById('save-button-average-mileage').addEventListener('click', saveOptionsAverageMileage);
});


//to hide the save alert 
$(document).ready (function(){
  // $("#saved-alert").hide();
 });

window.onload = restoreOptions;

googleAnalytics('UA-1471148-11');