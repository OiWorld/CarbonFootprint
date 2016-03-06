/*CONVERSION CONTSANTS TABLE for fuel consumption and efficiency
Using l/km as the reference unit i.e LKM
also l/km = 1000 ml/km i.e  LKM_to_MLKM = 1 / MLKM_TO_LKM
also km/ml = 1000 km/l  i.e  KMML_to_KML = 1000 / KML_TO_KMML
to avoid redundancy caused by making all combinations
*/
 
$('#save-button-1').click(function() {
    var fuel = document.getElementById('fuelInput1');
    var fuelValue = fuel.value;
    var distance = document.getElementById('distanceInput1');
    var distanceValue = distance.value;
    var input = document.getElementById('fuelConsumptionInput');
    var inputValue = input.value;
    var status = document.getElementById('save-message');
    status.innerHTML = 'Saved!';
    switch (fuelValue) {
        case "l":
            if (distance == "km") {
                console.log("l/km case");
                var fuelConsumption = 2328 * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            } else {
                var fuelConsumption = 2328 * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            }
            break;
        case "g":
            if (distance == "km") {
                var fuelConsumption = 8782.155 * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            } else {
                var fuelConsumption = 1 / inputValue;
                fuelConsumption = 5456.97 * fuelConsumption;
            }

            break;
    }
});

$('#save-button-2').click(function() {
    var unit = document.getElementById('distanceFuelInput2');
    var unitValue = unit.value;
    var input = document.getElementById('fuelEfficiencyInput');
    var inputValue = input.value;
    var status = document.getElementById('save-message-2');
    status.innerHTML = 'Saved!';
    if (unitValue == "km/l") {
        var fuelEfficiency = 1 / inputValue;
        fuelEfficiency = 2328 * fuelEfficiency;
        localStorage['carbonEmission'] = fuelEfficiency;
    } else if (unitValue == "km/gl") {
        var fuelEfficiency = 1 / inputValue;
        fuelEfficiency = 8782.155 * fuelEfficiency;
        localStorage['carbonEmission'] = fuelEfficiency;
    } else {
        var fuelEfficiency = 5456.97 * inputValue;
        localStorage['carbonEmission'] = fuelEfficiency;
    }
});

$('#save-button-3').click(function() {

    var fuel = document.getElementById('fuelInput3');
    var fuelValue = fuel.value;
    var distance = document.getElementById('distanceInput3');
    var distanceValue = distance.value;
    var input = document.getElementById('co2EmissionInput');
    var inputValue = input.value;
    var status = document.getElementById('save-message-3');
    status.innerHTML = 'Saved!';
    console.log(inputValue);
    switch (fuelValue) {
        case "g":
            if (distance == "km") {
                var co2Emission = inputValue;
                localStorage['carbonEmission'] = co2Emission;
            } else {
                var co2Emission = 0.621371 * inputValue;
                localStorage['carbonEmission'] = co2Emission;
            }
            break;
        case "kg":
            if (distance == "km") {
                var co2Emission = 1000 * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 2;
            } else {
                var co2Emission = 621.371 * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 2;

            }
            break;
        case "p":
            if (distance == "km") {
                var co2Emission = 453.592 * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 1;

            } else {
                var co2Emission = 281.849 * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 1;
            }
            break;
    }
});


function S(key) {
    return localStorage[key]; }

function restoreOptions() {
    console.log("function restore options");

    var fuelConsumption = document.getElementById('fuelConsumption');
    fuelConsumption.setAttribute('value', S('carbonEmission'));

    var fuelEfficiency = document.getElementById('fuelEfficiency');
    fuelEfficiency.setAttribute('value', S('carbonEmission'));

    var co2Emission = document.getElementById('co2Emission');
    co2Emission.setAttribute('value', S('carbonEmission'));

}

window.onload = restoreOptions;
googleAnalytics('UA-1471148-11');
