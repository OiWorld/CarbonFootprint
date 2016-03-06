/*CONVERSION CONTSANTS TABLE for fuel consumption and efficiency
Using l/km as the reference unit i.e LKM
also l/km = 1000 ml/km i.e  LKM_to_MLKM = 1 / MLKM_TO_LKM
also km/ml = 1000 km/l  i.e  KMML_to_KML = 1000 / KML_TO_KMML
to avoid redundancy caused by making all combinations
*/
 
$('#saveButton1').click(function() {
    var fuel = document.getElementById('fuelInput1');
        fuelValue = fuel.value;
        distance = document.getElementById('distanceInput1');
        distanceValue = distance.value;
        input = document.getElementById('fuelConsumptionInput');
        inputValue = input.value;
        status = document.getElementById('save-message');
    status.innerHTML = 'Saved!';
    switch (fuelValue) {
        case "l":
            if (distance == "km") {
                console.log("l/km case");
                var conversionConstant = 2328;
                    fuelConsumption = conversionConstant * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            } else {
                var conversionConstant = 2328;
                    fuelConsumption = conversionConstant * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            }
            break;
        case "g":
            if (distance == "km") {
                var conversionConstant = 8782.155;
                    fuelConsumption = conversionConstant * inputValue;
                localStorage['carbonEmission'] = fuelConsumption;
            } else {
                var conversionConstant = 5456.97;
                    fuelConsumption = 1 / inputValue;
                fuelConsumption = conversionConstant * fuelConsumption;
            }

            break;
    }
});

$('#saveButton2').click(function() {
    var unit = document.getElementById('distanceFuelInput2');
        unitValue = unit.value;
        input = document.getElementById('fuelEfficiencyInput');
        inputValue = input.value;
        status = document.getElementById('save-message-2');
    status.innerHTML = 'Saved!';
    if (unitValue == "km/l") {
        var conversionConstant = 2328;
            fuelEfficiency = 1 / inputValue;
        fuelEfficiency = conversionConstant * fuelEfficiency;
        localStorage['carbonEmission'] = fuelEfficiency;
    } else if (unitValue == "km/gl") {
        var conversionConstant = 8782.155;
            fuelEfficiency = 1 / inputValue;
        fuelEfficiency = conversionConstant * fuelEfficiency;
        localStorage['carbonEmission'] = fuelEfficiency;
    } else {
        var conversionConstant = 5456.97;
            fuelEfficiency = conversionConstant * inputValue;
        localStorage['carbonEmission'] = fuelEfficiency;
    }
});

$('#saveButton3').click(function() {

    var fuel = document.getElementById('fuelInput3');
        fuelValue = fuel.value;
        distance = document.getElementById('distanceInput3');
        distanceValue = distance.value;
        input = document.getElementById('co2EmissionInput');
        inputValue = input.value;
        status = document.getElementById('save-message-3');
    status.innerHTML = 'Saved!';
    console.log(inputValue);
    switch (fuelValue) {
        case "g":
            if (distance == "km") {
                var co2Emission = inputValue;
                localStorage['carbonEmission'] = co2Emission;
            } else {
                var conversionConstant = 0.621371;
                    co2Emission = conversionConstant * inputValue;
                localStorage['carbonEmission'] = co2Emission;
            }
            break;
        case "kg":
            if (distance == "km") {
                var conversionConstant = 1000;
                    co2Emission = conversionConstant * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 2;
            } else {
                var conversionConstant = 621.371;
                    co2Emission = conversionConstant * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 2;

            }
            break;
        case "p":
            if (distance == "km") {
                var conversionConstant = 453.592;
                    co2Emission = conversionConstant * inputValue;
                localStorage['carbonEmission'] = co2Emission;
                localStorage['massFlag'] = 1;

            } else {
                var conversionConstant = 281.849;
                    co2Emission = conversionConstant * inputValue;
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
