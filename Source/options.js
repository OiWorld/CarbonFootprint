function save_options() {
    var emission = document.getElementById("emission");
    var format = document.getElementById("input-format");
    var carbonEmission = emission.value;

    if (format == "co2") {
        var unit = document.getElementById("co2-unit");
    } else {
        var unit = document.getElementById("fuel-consumption");
    }

    var emissionUnit = unit.value;
    //corversion factors from https://goo.gl/z1bTk5 
    //and https://goo.gl/PMz9VN (google unit converter)
    //assuming gasoline and US units
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
            carbonEmission = 2328 * carbonEmission;
            break;
        case "km/ltr":
            carbonEmission = 1 / carbonEmission;
            carbonEmission = 2328 * carbonEmission;
            break;
        case "gal/km":
            carbonEmission = 8782.155 * carbonEmission;
            break;
        case "km/gal":
            carbonEmission = 1 / carbonEmission;
            carbonEmission = 8782.155 * carbonEmission;
            break;
        case "mi/gal":
            carbonEmission = 5456.97 * carbonEmission;
            break;
        case "gal/mi":
            carbonEmission = 1 / carbonEmission;
            carbonEmission = 5456.97 * carbonEmission;
            break;
        default:
            emissionUnit = emission.value;      //g/km
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
    return localStorage[key];
}

function restore_options() {
    var emission = document.getElementById("emission");
    emission.setAttribute('value', S("carbonEmission"));
    document.getElementById('input-format').addEventListener('change', function() {
        Array.prototype.forEach.call(document.querySelectorAll('.unit-list'), function(e) {
            e.style.display = 'none';
        });
        var sel = this.selectedIndex;
        if (sel == 0) {
            document.getElementById('co2-list').style.display = 'block';


        } else {
            document.getElementById('fuel-list').style.display = 'block';

        }
    });
}





document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save-button').addEventListener('click', save_options);
});

window.onload = restore_options;

google_analytics('UA-1471148-11');
