function save_options() {
    var emission = document.getElementById("emission");
    var unit = document.getElementById("unit");
    var carbonEmission = emission.value;
    var emissionUnit = unit.value;

    //corversion factors from https://goo.gl/z1bTk5 
    //and https://goo.gl/PMz9VN (google unit converter) 
    switch (emissionUnit) {
        case "kg/km":
            carbonEmission = 1000 * carbonEmission;
            break;
        case "g/mi":
            carbonEmission = 0.621371 * carbonEmission;
            break;
        case "kg/mi":
            carbonEmission = 621.371 * carbonEmission;
            break;
        case "ltr/km":
            carbonEmission = 2320 * carbonEmission;     //assuming gasoline
            break;
        case "gal/km":
            carbonEmission = 8782.155 * carbonEmission; //assuming gasoline
            break;
        default:
            emissionUnit = emission.value;
    }
    localStorage["carbonEmission"] = carbonEmission;

    // Update status to let user know options were saved.
    var status = document.getElementById("save-message");
    status.innerHTML = "Saved!";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

function S(key) {
    return localStorage[key]; }

function restore_options() {
    var emission = document.getElementById("emission");
    emission.setAttribute('value', S("carbonEmission"));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save-button').addEventListener('click', save_options);
});

window.onload = restore_options;

google_analytics('UA-1471148-11');
