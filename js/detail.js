//localStorage.removeItem('jsonObj');
$('#loading').show()
$('.showDiv').hide();
//////////////////////////////////////////////////////////////////
const inscription = JSON.parse(localStorage.getItem('jsonObj'));
$('#ins_id').html(`<a class="text-decoration-none" href="${inscription.inscriptionURI}" target="_blank">${getInscriptionId(inscription.inscriptionId)}: ${inscription.inscriptionLabel}</a>`);
$('#tmId').html(`${getTrismegistosID(inscription.tmId)}`);
$('#material').html(`${getMaterial(inscription.materialLink, inscription.material)}`);
$('#objectType').html(`${getObjectType(inscription.objTypeLink, inscription.objectType)}`);
$('#language').html(`${getLanguageName(inscription.language)}`);
//$('#inc_text').html(`<pre>${inscription.inscriptionText.replace('Text', '')}</pre>`);
//////////////////////////////////////////////////////////////////////////////
//// Display image
async function f() {
    await getVisualisationFromRDF(inscription.rdfData, 'ttl', 'png', '#visualiseRDFInImage');
    $('#loading').hide()
    $('.showDiv').show();
}; f();

////////////////////////////////////////////////////////////////////////////
(async () => {
    let text = await getEpiDocText(getInscriptionId(inscription.inscriptionId), inscription.inscriptionId);
    $('#inc_text').next('div').remove();
    if (text !== '') {
        $('#inc_text').html(`${text.replace('Text', '')}`);
    }
    else {
        $('#inc_text').html(`<pre>${inscription.inscriptionText.replace('Text', '').trim()}</pre>`);
    }
})();


////////////////////////////////////////////////////////////
/// Show/Hide Inscription Text
$('#btnText').click(() => {
    if ($('#divInsText').attr('style') === 'display: none;') {
        $('#divInsText').show('fade');
        $('#btnText').html('Hide Inscription Text')
    }
    else {
        $('#divInsText').hide('fade');
        $('#btnText').html('Show Inscription Text')
    }
})
//////////////////////////////////////////////////////////
/// Get Relations
getRelations(inscription.tmId, '#closeMatch');
///////////////////////////////////////////////////////////////////////
//// Show Map

setTimeout(() => {
    map = new Microsoft.Maps.Map('#map', {});
    initMap();
}, 300);

async function initMap() {
    if (inscription.geo !== undefined) {
        let lat_lng = inscription.geo.split(',')
        //showGoogleMap(lat_lng);
        showBingMap(lat_lng);
    }
    else {
        lat_lng = await getLatLng(inscription.foundAt);
        showBingMap(lat_lng);
        // if (lat_lng !== undefined && lat_lng !== null && lat_lng.length > 0) {
        //     showGoogleMap(lat_lng);
        // }
        // else {
        //     setTimeout(() => {
        //         var map = new Microsoft.Maps.Map('#map');
        //         let searchManager;
        //         loadModuleMap(searchManager, map);
        //     }, 400)
        // }
    }
}

function showBingMap(lat_lng) {
    //let map = new Microsoft.Maps.Map('#map');
    const myLatLng = { lat: parseFloat(lat_lng[0]), lng: parseFloat(lat_lng[1]) };
    map.setView({
        center: new Microsoft.Maps.Location(myLatLng.lat, myLatLng.lng),
        zoom: 10
    });
    map.entities.clear();
    var center = map.getCenter();
    var width = 30; // Change this value to your desired width
    var height = 40; // Change this value to your desired height

    //Create custom Pushpin
    var pin = new Microsoft.Maps.Pushpin(center, {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAABKBAMAAAAGfmppAAAAKlBMVEVHcEzGIh7FIh/FIh/FIh/FIh7GIh/FIh/OKiTZMyrjPDDqQzXEIR20FBLVR2YzAAAADXRSTlMAMmqaxub/Tv////8SksoI7QAAAexJREFUeAF9k4FHA2EUwN9qE4SjGoCIAFQIhBUFQsgFwdbubbcVofYnjEwAJxLAsANgdveJSP0JKbn/pXZ739vt3tt+YPPb3vf7vrsPmMLWseud7zkgWHMxxdvNmzvEh4ExgyfEo1mzjn5oUuIAD7PmHR8M84QHmQLXNxmCusPqvknTiG4DiBV8NjNEeEuqw+N4ZINW4j8xkeek6sM3guAyVfs9qUZXk3lGIQ0p+ZrqV8Z9PU2Nxo0noabiOkChOc1KkunwrgPL/O0l+eeHf7cDpbadnqTYlYdnULafHyfq2/6yCtt0SlFC2O812KePr1b9krqidoqgEKp3afaNVV9mgscqYVjhPIWLlBuSyq0Ve6xuhJobH9UXbXm7px/UqAbltn68wyqUWvpD6Z8tepQF1F8AdABOxGtN7QCdtqaGDQAo+poKKuntChWFzuLroF6i/iWAPjGmG8sTxTyAYlP0nZJadZ/lVSbKrVxEAyxLuRDcJCFCOEKGcIQIibw3yLDhZyKqQORPJLYRHNKWESKEI0RIzBFMp8VPPs8yTexWhKKJvCk5cViThhqDCkgKGI736whBxz+qg0a5Jc6PF/PlUnzExnQ3QcUNY6RdyY5IrUivE21Y8ukH16BTRBSB/Drys5eHz4GC+wvI8AfE81lQFuNlPAAAAABJRU5ErkJggg==',
        anchor: new Microsoft.Maps.Point(width / 2, height)
    });
    pin.setOptions({ iconSize: new Microsoft.Maps.Size(width, height) });

    //Add the pushpin to the map
    map.entities.push(pin);
}

function showGoogleMap(lat_lng) {
    const myLatLng = { lat: parseFloat(lat_lng[0]), lng: parseFloat(lat_lng[1]) };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: myLatLng,
    });

    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "",
    });

    let interval = setInterval(() => {
        if (map !== undefined) {
            google.maps.event.trigger(map, 'resize')
            clearInterval(interval);
        }
    }, 500);
}

function downloadRDF(format) {
    downloadRDFSerialisation(inscription.rdfData, format, getInscriptionId(inscription.inscriptionId));
}