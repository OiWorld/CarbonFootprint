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

/**
*@const param
* GL_GML is Conversion constant from g/L to g/mL using 1000g/L = g/mL
* GL_GGAL is Conversion constant from g/L to g/gal
*/
var GL_TO_GML = 0.001,
    GL_TO_GGAL = 3.7854;

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

// Function to handle all 3 tabs save  click
function save_options() {
  switch(index_et)
  {
    case 0: var fuelInType = document.getElementById("fuel-type-in").value,
                fuelIntake = document.getElementById("fuel-intake").value, 
                fuelInUnit = document.getElementById("fuel-intake-unit").value;
            CalcCarbonEmission(index_et,fuelInType,fuelIntake,fuelInUnit);     
            break;
    case 1: var fuelEffType = document.getElementById("fuel-type-eff").value,
                fuelEfftake = document.getElementById("fuel-efficiency").value, 
                fuelEffUnit = document.getElementById("fuel-efficiency-unit").value;
            fuelEfftake = 1/fuelEfftake;
            CalcCarbonEmission(index_et,fuelEffType,fuelEfftake,fuelEffUnit);     
            break;
    case 2: var emission = document.getElementById("emission");
            var emissionUnit = document.getElementById("CO2Emission-units");
            localStorage["carbonEmission"] = emission.value;
            localStorage["carbonEmissionUnit"] = emissionUnit.options[emissionUnit.selectedIndex].value;
            break;
  }

  // Update status to let user know options were saved.
  var status = document.getElementsByClassName("save-message")[index_et];
  status.innerHTML = "Saved!";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

//Function to handle different Units
function CalcCarbonEmission(index,type,intake,unit){
  switch(unit){
     case '0' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"];
                localStorage["carbonEmissionUnit"] = 'g/km'
                break;
     case '1' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"] * GL_TO_GML;
                localStorage["carbonEmissionUnit"] = 'g/km'
                break;
     case '2' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"] * GL_TO_GGAL;
                localStorage["carbonEmissionUnit"] = 'g/km'
                break;
     case '3' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"];
                localStorage["carbonEmissionUnit"] = 'g/mi'
                break;
     case '4' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"] * GL_TO_GML;
                localStorage["carbonEmissionUnit"] = 'g/mi'
                break;
     case '5' : localStorage["carbonEmission"] = intake * fuel_info[type]["CO2Emission"] * GL_TO_GGAL;
                localStorage["carbonEmissionUnit"] = 'g/mi'
                break;                                                                
  }
}

/**
* CONVERSION CONTSANTS TABLE for fuel consumption and efficiency
* Using l/km as the reference unit i.e LKM
* also l/km = 1000 ml/km i.e  LKM_to_MLKM = 1 / MLKM_TO_LKM
* also km/ml = 1000 km/l  i.e  KMML_to_KML = 1000 / KML_TO_KMML
* to avoid redundancy caused by making all combinations
*/
var LKM_TO_LKM = 1.0,
	LKM_TO_MLKM= 1000.0,
	LKM_TO_GALKM= 0.264172,
	LKM_TO_LMI= 1.60934,
	LKM_TO_MLMI= 1609.34,
	LKM_TO_GALMI= 0.425144;

//consumptionUnitConvertor takes 4 parameter:
//type(consumption or efficiency),inputValue,previousUnit,currentUnit
function unitConvertor(type,input,prev,cur){
	console.log(type,input,prev,cur);
	// A general function which can decide division and multiplication factor
	function factorDecide(index)
	{
		switch(index){
			case '0': return LKM_TO_LKM;
			case '1': return LKM_TO_MLKM;
			case '2': return LKM_TO_GALKM;
			case '3': return LKM_TO_LMI;
			case '4': return LKM_TO_MLMI;
			case '5': return LKM_TO_GALMI;
			default: return LKM_TO_LKM;
		}
	}
	if(type==="cons") {
		/**
		* Using l/km as the reference unit i.e LKM
		* We first convert the previous units to refernce unit l/km
		* and then convert it to new unit
		* also l/km = 1000 ml/km i.e  LKM_to_MLKM = 1 / MLKM_TO_LKM
		* also km/ml = 1000 km/l  i.e  KMML_to_KML = 1000 / KML_TO_KMML
		* so value = ( input / LKM_TO_prev ) / cur_TO_LKM
		*/
		return ( ( parseFloat(input) / factorDecide(prev) ) * factorDecide(cur) );
	}
	else if(type=="eff") {
		/**
		* Using km/l as the reference unit i.e 1/LKM
		* We first convert the previous units to refernce unit km/l
		* and then convert it to new unit
		* also l/km = 1000 ml/km i.e  LKM_to_MLKM = 1 / MLKM_TO_LKM
		* also km/ml = 1000 km/l  i.e  KMML_to_KML = 1000 / KML_TO_KMML
		* so value = ( input * prev_TO_LKM ) / LKM_TO_cur 
		*/
		return ( ( parseFloat(input) * factorDecide(prev) ) / factorDecide(cur) );
	}
	return 0;
}
//Declaring previousConsUnit which is initialised when DOM is loaded
var previousConsUnit = null;

//function for consumption unit convertor
function changeConsumptionUnit(){
	var fuelInput = document.getElementById("fuel-intake");
	//Convert to new units and set value up to 5 decimal places
	fuelInput.value = unitConvertor("cons",fuelInput.value,previousConsUnit,this.value).toFixed(5);
	previousConsUnit = this.value;
}

//Declaring previousEffUnit which is initialised when DOM is loaded
var previousEffUnit = null;

//function for efficiency unit convertor
function changeEfficiencyUnit(){
	var fuelInput = document.getElementById("fuel-efficiency");
	//Convert to new units and set value up to 5 decimal places
	fuelInput.value = unitConvertor("eff",fuelInput.value,previousEffUnit,this.value).toFixed(5);
	previousEffUnit = this.value;
}

function S(key) { return localStorage[key]; }

function restore_options() {
  var emission = document.getElementById("emission");
  emission.setAttribute('value', S("carbonEmission"));
  //Storing Units for CO2 Emission Units for future  output
  var emissionUnit = document.getElementById("CO2Emission-units");
  emissionUnit.value= S("carbonEmissionUnit");
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
  
  //Initalising previousConsUnit
  previousConsUnit = document.getElementById("fuel-intake-unit").value;
  //Attaching change event for unit conversion  in fuel consumption
  document.getElementById("fuel-intake-unit").addEventListener("change", changeConsumptionUnit);

  //Initalising previouEffUnit
  previousEffUnit = document.getElementById("fuel-efficiency-unit").value;
  //Attaching change event for unit conversion  in fuel consumption
  document.getElementById("fuel-efficiency-unit").addEventListener("change", changeEfficiencyUnit);
});

window.onload = restore_options ;

google_analytics('UA-1471148-11');