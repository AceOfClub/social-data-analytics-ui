$(function () {
    $("#form_sdas_input").trigger("reset");
    $("#txt_geo_code").trigger("geocode");

    $("#txt_geo_code").geocomplete({
        details: "#form_sdas_input",
    });

});


function generateMapForKeyWordData(keyWord, keyWordDataByLocation) {
    $('#data_vis_container').empty();
    var map = new Datamap({
        scope: 'world',
        element: document.getElementById('data_vis_container'),
        projection: 'mercator',
        height: 1000,
        fills: {
            defaultFill: '#a5a4a2',
            area: 'red',
        }
    })

    var dataForMap = _.map(keyWordDataByLocation, function (data) {
        return {
            name: keyWord,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: 5,
            fillKey: 'area'
        };
    })

    map.bubbles(dataForMap, {
        popupTemplate: function (geo, data) {
            return "<div class='hoverinfo'>" + data.name + "</div>";
        }
    });
}

function generateChartsForKeyWordData(locationDataByKeyWord) {
    $('#data_vis_container').empty();
    var data = [{
        x: _.map(locationDataByKeyWord, function (data) {
            return data.hashTag;
        }),
        y: _.map(locationDataByKeyWord, function (data) {
            return data.count;
        }),
        type: 'bar'
    }];
    console.log("DATA -- " + JSON.stringify(data));
    Plotly.newPlot('data_vis_container', data);
}

function onfinalClick() {
    var name = document.getElementById("txt_keyWrd").value.trim();
    var latitude = document.getElementById("txt_latitude").value.trim();
    var longitude = document.getElementById("txt_longitude").value.trim();
    var radius = document.getElementById("txt_radius").value.trim();
    var lovVal = document.getElementById('lov_Search').value.trim();



    var urlVar = 'http://localhost:8080/data/';
    if (lovVal == 'keyword') {
        urlVar = urlVar + 'hashtag/' + name;
        console.log("Url Keyword>> " + urlVar);
    } else if (lovVal == 'location') {
        urlVar = urlVar + 'location/latitude/' + latitude + '/longitude/' + longitude + '/radius/' + radius;
        console.log("Url Locatio based>> " + urlVar);
    }
    if (lovVal == 'keyword' && (name == null || '' == name)) {
        alert('Please enter a keyword to search');
    } else if (lovVal == 'location' && !isValidLocation(latitude, longitude, radius)) {
        alert('Please enter a valid Location to search');
        return false;
    } else {
        $.ajax({
            type: "GET",
            url: urlVar,
            cache: false,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if (lovVal == 'keyword') {
                    generateMapForKeyWordData(name, data);
                } else {
                    generateChartsForKeyWordData(data);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });

        return false;
    }

}

function onFormLoad(event) {
    document.getElementById('lov_Search').value = 'keyword';
    document.getElementById("txt_keyWrd").disabled = '';
    document.getElementById("txt_keyWrd").value = '';
    document.getElementById("txt_latitude").disabled = 'true';
    document.getElementById("txt_longitude").disabled = 'true';
    document.getElementById("txt_radius").disabled = 'true';
    document.getElementById("txt_latitude").value = '';
    document.getElementById("txt_longitude").value = '';
    document.getElementById("txt_radius").value = '';
}

function onSearchModify(event) {
    if (document.getElementById('lov_Search').value == 'keyword') {
        document.getElementById("txt_keyWrd").disabled = '';
        document.getElementById("txt_keyWrd").value = '';
        document.getElementById("txt_latitude").disabled = 'true';
        document.getElementById("txt_longitude").disabled = 'true';
        document.getElementById("txt_radius").disabled = 'true';
    } else {
        document.getElementById("txt_keyWrd").disabled = 'true';
        document.getElementById("txt_latitude").disabled = '';
        document.getElementById("txt_longitude").disabled = '';
        document.getElementById("txt_radius").disabled = '';
        document.getElementById("txt_latitude").value = '';
        document.getElementById("txt_longitude").value = '';
        document.getElementById("txt_radius").value = '';
    }
}


function isValidLocation(latitude, longitude, radius) {
    if ((latitude == null || '' == latitude) ||
        (longitude == null || longitude == null) ||
        (radius == '' || radius == null)) {
        return false;
    }

    var isValid = (isFinite(latitude) && Math.abs(latitude) <= 90) &&
        (isFinite(longitude) && Math.abs(longitude) <= 180);
    return isValid;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 &&
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}