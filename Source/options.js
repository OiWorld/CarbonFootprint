/**  @param index_et
* Index for selected emission type  Fuel consumption=0,fuel Efficiency =1 , CO2 Emission=2 
*/
var index_et = 2;

//getting DOM object for emisssion-input-type
var  $eit = document.getElementsByClassName('emission-input-type'),
     $ei = document.getElementsByClassName('emission-input');

//function to switch between tabs and open respective inputs
function openEmissionInput()
{
  //adding selected class to the clicked tab
  document.getElementsByClassName('emission-input-type selected')[0].className = 'emission-input-type';
  this.className += ' selected';
  //opening input to the corresponding tab
  index_et = Array.prototype.slice.call( $eit ).indexOf( this );
  document.getElementsByClassName('emission-input open')[0].className = 'emission-input';
  $ei[index_et].className += ' open';
}

function save_options() {
  var emission = document.getElementById("emission");
  var carbonEmission = emission.value;
  localStorage["carbonEmission"] = carbonEmission;

  // Update status to let user know options were saved.
  var status = document.getElementById("save-message");
  status.innerHTML = "Saved!";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function S(key) { return localStorage[key]; }

function restore_options() {
  var emission = document.getElementById("emission");
  emission.setAttribute('value', S("carbonEmission"));
}

document.addEventListener('DOMContentLoaded', function () {
  
  //assigning click listener to the save for each tabs
  for(var i=0;i< document.getElementsByClassName('save-button').length;++i)
    {
      document.getElementsByClassName('save-button')[i].addEventListener('click', save_options);
    }

  //assigning click listener to the tabs
  for(var  i=0;i<$eit.length;++i)
  {
    $eit[i].addEventListener('click', openEmissionInput, false);
  }
});

window.onload = restore_options ;

google_analytics('UA-1471148-11');