//function to switch between tabs and open respective inputs
function openEmissionInput()
{
  //adding selected class to the clicked tab
  $('.emission-input-type.selected').removeClass('selected');
  $(this).addClass(' selected');
  //opening input to the corresponding tab
  var index = $('.emission-input-type.selected').index();
  $('.emission-input.open').removeClass('open');
  $('.emission-input:nth-child('+(index+1)+')').addClass('open');
}

/**
* Usign Calculation table provided in comments to common JSON object's array
*@const fuel_info
*FUEL NAME: fuel_info[i]["name"] = fuel name
*FUEL CONVERSION CONSTANTS: fuel_info[i]["CO2Emission"]  is in g/L
*/
var fuel_info = [
  {
    name:'diesel',
    CO2Emission: 2614,
  },
  {
    name:'gasoline',
    CO2Emission: 2328,
  },
  {
    name:'lpg',
    CO2Emission: 1533,
  },
  {
    name:'e10',
    CO2Emission: 2245,  // (0.10 * 1503) + (0.90 * 2328) = 2245.5
  },
  {
    name:'e25',
    CO2Emission: 2121,  // (0.25 * 1503) + (0.75 * 2328) = 2121.75
  },
  {
    name:'e85',
    CO2Emission: 1626,  //  (0.85 * 1503) + (0.15 * 2328) = 1626.75  
  },
  {
    name:'ethanol',
    CO2Emission: 1503,
  },
  {
    name:'biodiesel',
    CO2Emission: 2486,
  },
];

//prototype  function to get and set JSON as localStorage only supports string
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// Function to handle all 3 tabs save  click
function saveOptions() {
  //Saving input type
  localStorage.setObj('savedTab',$('.emission-input.open').index());
  // Saving PRIMITVE VARIABLES- fuelType
  localStorage.setObj('fuelType',parseInt(document.getElementById("fuel-type").value));
  // Saving PRIMITVE VARIABLES- fuelCost
  localStorage.setObj('fuelCost',{
    value: parseFloat(document.getElementById("fuel-cost").value),
    unit1: '$',
    unit2: document.getElementById("fuel-cost-unit2").value,
  });
  localStorage.setObj('emissionUnit','g');
  /**
  * TO STORE EVERYTYPE OF INFO IN TERMS OF PRIMITVE VARIABLES-
  * fuelConsumption
  */
  switch(localStorage.getObj('savedTab'))
  {
    case 0: localStorage.setObj('fuelConsumption',{
              value: parseFloat($('#consumption').val()),
              unit1: $('#consumption-unit1').val(), 
              unit2: $('#consumption-unit2').val(),
            });
            setEmissionRate('g',$('#consumption-unit2').val());
            break;
    case 1: //As fuel consumption = 1/fuel efficiency
            localStorage.setObj('fuelConsumption',{
              value: 1 / $('#efficiency').val(),
              unit1: $('#efficiency-unit2').val(), 
              unit2: $('#efficiency-unit1').val(),
            });  
            setEmissionRate('g',$('#efficiency-unit1').val());
            break;
    case 2: 
            var emission = $('#emission').val(),
                emissionUnit1 = $('#emission-unit1').val(), 
                emissionUnit2 = $('#emission-unit2').val();
            // CONVERSION TO GRAMS  
            emission = unitConvertor(emission,emissionUnit1,'g')
            // Conversion to fuel efficiency based on fuel type
            var fuelType = localStorage.getObj('fuelType');
            emission = emission / fuel_info[fuelType]['CO2Emission'];

            localStorage.setObj('fuelConsumption',{
              value: emission,
              unit1: 'L', 
              unit2: emissionUnit2,
            }); 
            // Set emission rate
            setEmissionRate(emissionUnit1,emissionUnit2);
            break;
  }
  //function call to calculate travel rate
  setTravelRate();
  // Update status to let user know options were saved.
  var status = $('#save-message');
  status.html('Saved!');
  setTimeout(function() {
    status.html('');
  }, 750);
}

/**
* CONVERSION CONTSANTS TABLE for Distance Units 
*
* Using km as the reference unit i.e KM
* Other Units MI
*/

var KM_TO_KM = 1.0,
    KM_TO_MI = 0.621371;

/**
* CONVERSION CONTSANTS TABLE for Volume Units 
*
* Using L as the reference unit i.e L
* Other Units GAL
*/

var L_TO_L = 1.0,
    L_TO_GAL = 0.264172;

/**
* CONVERSION CONTSANTS TABLE for Mass Units 
*
* Using G as the reference unit i.e G
* Other Units KG, LBS
*/

var G_TO_G = 1.0,
    G_TO_KG = 0.001,
    G_TO_LBS = 0.00220462;    

//function to set emission rate
function setEmissionRate(mUnit,dUnit) {
  var fuelType = localStorage.getObj('fuelType');
  var consumptionObj = localStorage.getObj('fuelConsumption');
  var emissionRate = consumptionObj.value;
  //CONVERSION TO STANDARD UNIT AS DATA IS AVAILABLE  IN GRAM/LITER
  // Converts multiplicative unit to Liter
  emissionRate = unitConvertor(emissionRate,consumptionObj.unit1,'L',consumptionObj.unit2,'km');
  //NOW CONVERTING THE FUEL EFFICIENCY (NOW IN L/KM) TO CARBON EMISSION (in G/KM) for particular fuel type
  emissionRate = emissionRate * fuel_info[fuelType]['CO2Emission'];
  //CONVERSION TO USER PROVIDED UNITS

  //convert to the multiplicative new unit
  emissionRate = unitConvertor(emissionRate,'g',mUnit,'km',dUnit);
  localStorage.setObj('emissionRate',{
    value: Math.round(emissionRate * 10000) / 10000,
    unit1: mUnit,
    unit2: dUnit,
  });
}

//function to set emission rate
function setTravelRate() {
  var fuelCostObj = localStorage.getObj('fuelCost');
  var consumptionObj = localStorage.getObj('fuelConsumption');
  var fuelRate = null;
  //cost($/volume) and consumption (volume/distance)
  //if both volume unit are same
  if(fuelCostObj['unit2'] === consumptionObj['unit1']) {
    fuelRate =  fuelCostObj['value'] * consumptionObj['value'];
  }
  //if volume units are different
  else {
    fuelRate = fuelCostObj['value'] * unitConvertor(consumptionObj['value'],consumptionObj['unit1'],fuelCostObj['unit2']);
  }
  localStorage.setObj('travelRate',{
    value: Math.round(fuelRate * 10000) / 10000,
    unit1: fuelCostObj['unit1'],
    unit2: consumptionObj['unit2'],
  });
}

function unitConvertor(value,prevN,curN,prevD,curD) {
  // conversion should take place if previous numerator and new numerator are different
  // Conversion for numerator
  if(prevN != curN) {
    value = ( value / getConstant(prevN) ) * getConstant(curN) ;
  }
  // Conversion for denominator
  if(prevD != curD) {
    value = ( value * getConstant(prevD) ) / getConstant(curD) ;
  }
  return  value;
}

function getConstant(unit) {
  switch(unit) {
    case 'g'  : return G_TO_G ;
                 break;
    case 'kg' : return G_TO_KG ;
                 break;
    case 'lbs': return G_TO_LBS ;
                 break;
    case 'km' : return KM_TO_KM ;
                 break;
    case 'mi' : return KM_TO_MI ;
                 break;
    case 'L'  : return L_TO_L ;
                 break;
    case 'gal': return L_TO_GAL ;
                 break;
    default :  return  -1;          
  }
  return  -1;  
}

// function to update value on  unit change
(function () {
    var previous;
    // console.log('yo',$(".selectMUnit"));
    $(".selectMUnit,.selectDUnit,.selectFUnit").on('focus', function () {
        // Store the current value on focus and on change
        previous = this.value;
    }).change(function() {
        // var to store respective input field and changing via generalised function 
        var inputField;
        if($(this).hasClass('selectMUnit')) {
          inputField = $($(this).parents('.form-group').siblings()[0]).find('input');
          inputField.val(unitConvertor(inputField.val(),previous,this.value,'none','none'));
        }
        else if($(this).hasClass('selectDUnit')) {
          inputField = $($(this).parents('.form-group').siblings()[0]).find('input');
          inputField.val(unitConvertor(inputField.val(),'none','none',previous,this.value));
        }
        else if($(this).hasClass('selectFUnit')) {
          inputField = $(this).parents('.form-group').find('input');
          inputField.val(unitConvertor(inputField.val(),'none','none',previous,this.value));
        }
        // Make sure the previous value is updated
        previous = this.value;
    });
})();

function restoreOptions() {
  //restore only if options html was saved once
  if(localStorage.getObj('savedTab')) {
    // Fuel type restore
    $('#fuel-type').val(localStorage.getObj('fuelType'));
    // Fuel Cost restore
    $('#fuel-cost').val(localStorage.getObj('fuelCost')['value']);
    $('#fuel-cost-unit2').val(localStorage.getObj('fuelCost')['unit2']);
    //  Storing input field on type
    $($('.emission-input-type')[localStorage.getObj('savedTab')]).click();
    switch(localStorage.getObj('savedTab')) {
      case 0 :  $('#consumption').val(localStorage.getObj('fuelConsumption')['value']);
                $('#consumption-unit1').val(localStorage.getObj('fuelConsumption')['unit1']);
                $('#consumption-unit2').val(localStorage.getObj('fuelConsumption')['unit2']);
                break;

      case 1 :  $('#efficiency').val( 1 / localStorage.getObj('fuelConsumption')['value']);
                $('#efficiency-unit1').val(localStorage.getObj('fuelConsumption')['unit2']);
                $('#efficiency-unit2').val(localStorage.getObj('fuelConsumption')['unit1']);
                break;

      case 2 :  $('#emission').val(localStorage.getObj('emissionRate')['value']);
                $('#emission-unit1').val(localStorage.getObj('emissionRate')['unit1']);
                $('#emission-unit2').val(localStorage.getObj('emissionRate')['unit2']);
                break;                            
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  //assigning click listener to the save for each tabs
  document.getElementById('save-button').addEventListener('click', saveOptions);

  //assigning click listener to the tabs
  $('.emission-input-type').on('click',openEmissionInput);

  // Added multiple language support. replaces text with user language
  for(var i=0;i< $('[data-language]').length;++i) {
    $($('[data-language]')[i]).html(chrome.i18n.getMessage($($('[data-language]')[i]).data('language'))) 
  }
});

window.onload = restoreOptions ;

googleAnalytics('UA-1471148-11');