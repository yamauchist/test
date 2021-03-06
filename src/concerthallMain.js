import $ from 'jquery';
import csv from 'jquery-csv';
import mapboxgl from 'mapbox-gl';
import List from 'list.js';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import "mapbox-gl/dist/mapbox-gl.css";

import { getMarker,getListOptions } from "./common";

export function concerthallMain() {
    var mainMap;
        var mainMarkerLayer;
        var map;
        var markerLayer;
        var detailMarker;
        function init() {
            mapboxgl.accessToken = 'pk.eyJ1IjoieWFtYXVjaGlzdCIsImEiOiJjazdiem93cTkwOHhwM2ZwYTFzMmx6bXg2In0.VJZV5mGnqi_055RCBx3Ouw';

            map = new mapboxgl.Map({
                container: 'mapcontainer', // container id
                style: 'mapbox://styles/yamauchist/ck7cy2v8w0hfr1ilnpqaps4an', // stylesheet location
                center: [135.486011, 34.701486], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });

            mainMap = new mapboxgl.Map({
                container: 'main-map', // container id
                style: 'mapbox://styles/yamauchist/ck7cy2v8w0hfr1ilnpqaps4an', // stylesheet location
                center: [135.486011, 34.701486], // starting position [lng, lat]
                zoom: 9 // starting zoom
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
        request.open("get", "concerthall.csv", true);
        request.send(null);

        var facilities = [];
        request.onload = function () {
            var line = request.responseText.split("\n");

            for (var i = 1; i < line.length; ++i) {
                if (line[i]) {
                    let facility = convertToConcertHall(line[i]);
                    facility.id = i;
                    facilities[i] = facility;
                    facilityList.add(facility);

                    let marker = getMarker(facility, '#map-popup-template');
                    //marker.addTo(mainMarkerLayer);

                    marker.addTo(mainMap);
                    markers.push(marker);
                }
            }
            $('#spinner').hide();

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
                $('#stationList').append('<li><label><input class="uk-checkbox station-checkbox" type="checkbox" value="' + value + '駅" >' + value + '駅</label>');
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

                if (facility.address)
                    $('#maplink').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + address);
                else
                    $('#maplink').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + facility.latitude + ',' + facility.longitude);

                //markerLayer.clearLayers();
                //L.marker([facility.latitude, facility.longitude], { title: facility.name }).addTo(markerLayer);
                //map.setView([facility.latitude, facility.longitude], 15);

                if (detailMarker)
                    detailMarker.remove();

                var el = document.createElement('div');
                el.className = 'marker';

                if (facility.category == 'アンサンブル用') {
                    $(el).addClass('facility-marker');
                }

                var detailMarker = new mapboxgl.Marker(el)
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
                //mainMap.invalidateSize();
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
            //mainMarkerLayer.clearLayers();
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
                    if ($('#child-checkbox').prop('checked')) {
                        if (!item.values()['child'].match(/あり/))
                            isShown = false;
                    }
                    if ($('#standCheckbox').prop('checked')) {
                        if (!item.values()['stand'].match(/あり/))
                            isShown = false;
                    }

                    if (isShown) {
                        let facility = facilities[item.values()['id']];

                        let marker = getMarker(facility, '#map-popup-template');
                        //marker.addTo(mainMarkerLayer);

                        marker.addTo(mainMap);
                        markers.push(marker);
                    }

                    return isShown;
                }
            );
        });
}

function convertToConcertHall(line) {
    let columns = line.split(',');
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
        depth: columns[10],
        width: columns[11],
        capacity: columns[12],
        fee: columns[13],
        parking: columns[14] && !columns[14].includes('なし') ? '駐車場:' + columns[14] : '',
        piano: columns[15].includes('〇') ? 'ピアノあり' : '',
        stand: columns[16].includes('〇') ? '譜面台貸出あり' : '',
        child: columns[17].includes('〇') ? '親子室あり' : '',
        appointFrom: columns[18],
        appointTo: columns[19],
        longitude: columns[20],
        latitude: columns[21],
        description: columns[22],
    }
    return facility;
}