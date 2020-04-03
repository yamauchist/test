import $ from 'jquery';
import csv from 'jquery-csv';
import mapboxgl from 'mapbox-gl';
import List from 'list.js';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import "mapbox-gl/dist/mapbox-gl.css";

import { getMarker, getListOptions } from "./common";

export function facilitiesMain() {
    var mainMap;
    var map;
    var mainMarkerLayer;
    var markerLayer;
    var detailMarker;
    function init() {
        mapboxgl.accessToken = 'pk.eyJ1IjoieWFtYXVjaGlzdCIsImEiOiJjazdiNTEzNWgxYjk0M2ZwN25yd2h5MmVpIn0.8pQ-2DCw-p2Zpwcb5Z9Pmg';

        map = new mapboxgl.Map({
            container: 'mapcontainer',
            style: 'mapbox://styles/yamauchist/ck7cy2v8w0hfr1ilnpqaps4an',
            center: [135.486011, 34.701486],
            zoom: 9
        });

        mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/yamauchist/ck7cy2v8w0hfr1ilnpqaps4an',
            center: [135.486011, 34.701486],
            zoom: 9
        });
    }
    init();

    function resize() {
        var mapHeight = window.innerHeight - $('header').height() - $('#button-grid').height() - 30;
        $('#main-map').height(mapHeight);
        mainMap.resize();
    }
    resize();

    window.onresize = function () {
        resize();
    };

    var options = getListOptions('#list-template');
    var facilityList = new List('facility-list', options);

    var request = new XMLHttpRequest();
    request.open("get", "facilities.csv", true);
    request.send(null);

    var facilities = [];
    request.onload = function () {
        var lines = request.responseText.split("\n");

        for (var i = 1; i < lines.length; ++i) {
            if (lines[i]) {
                let facility = convertToFacility(lines[i]);
                facility.id = i;
                facilities[i] = facility;
                facilityList.add(facility);

                let marker = getMarker(facility, '#map-popup-template');

                marker.addTo(mainMap);
                markers.push(marker);
            }
        }
        $('#spinner').hide();

        facilityList.sort('room', { order: "asc" });
        facilityList.sort('name', { order: "asc" });

        var prefArray = facilities.map((x) => x.pref).filter((x, i, self) => x && self.indexOf(x) === i).sort((a, b) => a > b ? 1 : -1);
        prefArray.forEach(function (value) {
            $('#prefList').append('<li><label><input class="uk-checkbox pref-checkbox" type="checkbox" value="' + value + '" >' + value + '</label>');
        });

        var cityArray = facilities
            .slice()
            .sort((a, b) => a.city > b.city ? 1 : -1)
            .sort((a, b) => a.pref > b.pref ? 1 : -1)
            .map((x) => x.city)
            .filter((x, i, self) => x && self.indexOf(x) === i);
        cityArray.forEach(function (value) {
            $('#cityList').append('<li><label><input class="uk-checkbox city-checkbox" type="checkbox" value="' + value + '" >' + value + '</label>');
        });

        var stationArray = facilities.map((x) => x.station).filter((x, i, self) => x && self.indexOf(x) === i).sort((a, b) => a > b ? 1 : -1);
        stationArray.forEach(function (value) {
            $('#stationList').append('<li><label><input class="uk-checkbox station-checkbox" type="checkbox" value="' + value + '" >' + value + '</label>');
        });

        var categoryArray = facilities.map((x) => x.category).filter((x, i, self) => x && self.indexOf(x) === i).sort((a, b) => a > b ? 1 : -1);
        categoryArray.forEach(function (value) {
            $('#categoryList').append('<li><label><input class="uk-checkbox category-checkbox" type="checkbox" value="' + value + '" >' + value + '</label>');
        });

        $('.detail-link').on('click', function () {
            let id = $(this).find('.id').text();
            let facility = facilities[id];
            $('#dialogTitle').text(facility.name);
            let address = facility.pref + facility.city + facility.address;
            $('#dialog_address').text(address);

            let station = facility.line + facility.station + facility.onfoot;
            $('#dialog_station').text(station);

            $('#detail-url').text(facility.url);
            $('#detail-url').attr('href', facility.url);

            if (facility.address)
                $('#maplink').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + address);
            else
                $('#maplink').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + facility.latitude + ',' + facility.longitude);
            $('#maplink').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + facility.name.replace(' ', '+'));

            if (detailMarker)
                detailMarker.remove();

            let width = 20;
            let height = 34.892337;
            var el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = `<svg 
            width="${width}" height="${height}"
            viewBox="0 0 20 34.892337"
            >
           <g transform="translate(-814.59595,-274.38623)">
             <g transform="matrix(1.1855854,0,0,1.1855854,-151.17715,-57.3976)">
               <path class="marker"
                  d="m 817.11249,282.97118 c -1.25816,1.34277 -2.04623,3.29881 -2.01563,5.13867 0.0639,3.84476 1.79693,5.3002 4.56836,10.59179 0.99832,2.32851 2.04027,4.79237 3.03125,8.87305 0.13772,0.60193 0.27203,1.16104 0.33416,1.20948 0.0621,0.0485 0.19644,-0.51262 0.33416,-1.11455 0.99098,-4.08068 2.03293,-6.54258 3.03125,-8.87109 2.77143,-5.29159 4.50444,-6.74704 4.56836,-10.5918 0.0306,-1.83986 -0.75942,-3.79785 -2.01758,-5.14062 -1.43724,-1.53389 -3.60504,-2.66908 -5.91619,-2.71655 -2.31115,-0.0475 -4.4809,1.08773 -5.91814,2.62162 z"
                  style="display:inline;stroke:white;stroke-width:1;stroke-dasharray:none;" />
               <circle
                  r="3.0355"
                  cy="288.25278"
                  cx="823.03064"
                  style="display:inline;stroke-width:0;fill:white" />
             </g>
           </g>
         </svg>`;

            if (facility.category == 'アンサンブル用') {
                $(el).addClass('facility-marker');
            }

            detailMarker = new mapboxgl.Marker(el, {
            })
                .setLngLat([facility.longitude, facility.latitude])
                .addTo(map);
            map.setCenter([facility.longitude, facility.latitude]);
            map.setZoom(14);
        });
    }

    UIkit.util.on('.toggle-content', 'shown', function () {
        if ($('#main-map').prop('hidden')) {
            $('#map-toggle-button').html(`<i class="fas fa-map-marker-alt"></i>マップ`);
        }
        else {
            $('#map-toggle-button').html(`<i class="fas fa-list"></i>リスト`);
            mainMap.resize();
        }
    });


    $('#sort-select').on('change', function () {
        if ($(this).val() == '住所順') {
            facilityList.sort('address', { order: "asc" });
            facilityList.sort('city', { order: "asc" });
            facilityList.sort('pref', { order: "asc" });
        }
        if ($(this).val() == '駅名順') {
            facilityList.sort('station', { order: "asc" });
            facilityList.sort('line', { order: "asc" });
        }
        if ($(this).val() == '駅から近い順') {
            facilityList.sort('onfoot', { order: "asc" });
        }
        if ($(this).val() == '広い順') {
            facilityList.sort('area', { order: "asc" });
        }
        if ($(this).val() == '定員順') {
            facilityList.sort('capacity', { order: "asc" });
        }
        if ($(this).val() == '安い順') {
            facilityList.sort('fee', { order: "asc" });
        }
        if ($(this).val() == '名前順') {
            facilityList.sort('room', { order: "asc" });
            facilityList.sort('name', { order: "asc" });
        }
    });

    var markers = [];
    function clearMarker() {
        for (let i in markers) {
            markers[i].remove();
        }
        markers = [];
    }

    $('#search-button').on('click', function () {
        clearMarker();
        facilityList.filter(
            function (item) {
                var isShown = true;

                var name = $('[name="name-input"]').val();
                if (name) {
                    if (!item.values()['name'].includes(name)) {
                        isShown = false;
                    }
                }

                var checkedPref = [];
                $('.pref-checkbox:checked').each(function () {
                    checkedPref.push($(this).val());
                });
                if (checkedPref.length > 0) {
                    if (!checkedPref.includes(item.values()['pref'])) {
                        isShown = false;
                    }
                }

                var checkedCity = [];
                $('.city-checkbox:checked').each(function () {
                    checkedCity.push($(this).val());
                });
                if (checkedCity.length > 0) {
                    if (!checkedCity.includes(item.values()['city'])) {
                        isShown = false;
                    }
                }

                var checkedStation = [];
                $('.station-checkbox:checked').each(function () {
                    checkedStation.push($(this).val());
                });
                if (checkedStation.length > 0) {
                    if (!checkedStation.includes(item.values()['station'])) {
                        isShown = false;
                    }
                }

                var checkedCategory = [];
                $('.category-checkbox:checked').each(function () {
                    checkedCategory.push($(this).val());
                });
                if (checkedCategory.length > 0) {
                    if (!checkedCategory.includes(item.values()['category'])) {
                        isShown = false;
                    }
                }

                if ($('#pianoCheckbox').prop('checked')) {
                    if (!item.values()['piano'].match(/あり/))
                        isShown = false;
                }
                if ($('#percCheckbox').prop('checked')) {
                    if (!item.values()['percussion'].match(/あり/))
                        isShown = false;
                }
                if ($('#standCheckbox').prop('checked')) {
                    if (!item.values()['stand'].match(/あり/))
                        isShown = false;
                }

                if (isShown) {
                    let facility = facilities[item.values()['id']];

                    let marker = getMarker(facility, '#map-popup-template');

                    marker.addTo(mainMap);
                    markers.push(marker);
                }

                return isShown;
            }
        );
    });
}

function convertToFacility(line) {
    let columns = csv.toArrays(line)[0];
    let facility = {
        name: columns[0],
        room: columns[1],
        pref: columns[2],
        city: columns[3],
        address: columns[4],
        url: columns[5],
        category: columns[6],
        line: columns[7] ? columns[7] + '駅' : '',
        station: columns[8] ? columns[8] + '駅' : '',
        onfoot: columns[9] ? '徒歩' + columns[9] + '分' : '',
        area: columns[10],
        capacity: columns[11],
        fee: columns[12],
        parking: columns[13] && !columns[13].includes('なし') ? '駐車場:' + columns[13] : '',
        piano: columns[14].includes('〇') ? 'ピアノあり' : '',
        percussion: columns[15].includes('〇') ? '打楽器貸出あり' : '',
        stand: columns[16].includes('〇') ? '譜面台貸出あり' : '',
        appointFrom: columns[17],
        appointTo: columns[18],
        longitude: columns[19],
        latitude: columns[20],
        description: columns[21],
    }
    return facility;
}