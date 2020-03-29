import $ from 'jquery';
import csv from 'jquery-csv';
import mapboxgl from 'mapbox-gl';
import List from 'list.js';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

export function getMarker(facility, contentSelector) {
    let query = facility.latitude + ',' + facility.longitude;
    if (facility.address)
        query = facility.address;
    let content = $($(contentSelector).html().trim());

    content.find('.name').text(facility.name);
    content.find('.room').text(facility.room);
    content.find('.pref').text(facility.pref);
    content.find('.city').text(facility.city);
    content.find('.address').text(facility.address);
    content.find('.line').text(facility.line);
    content.find('.station').text(facility.station);
    content.find('.onfoot').text(facility.onfoot);
    content.find('.open-map').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + query);

    let el = document.createElement('div');
    el.className = 'marker';

    if (facility.category == 'アンサンブル用') {
        $(el).addClass('facility-marker');
    }

    let marker = new mapboxgl.Marker(el)
        .setLngLat([facility.longitude, facility.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(content.prop('outerHTML')))

    return marker;
}

export function getListOptions(template) {
    let options = {
        valueNames: [
            'id',
            'name',
            'room',
            'pref',
            'city',
            'address',
            'url',
            'category',
            'line',
            'station',
            'onfoot',
            'area',
            'depth',
            'width',
            'capacity',
            'fee',
            'parking',
            'piano',
            'percussion',
            'stand',
            'child',
            'description',
            'latitude',
            'longitude'
        ],
        item: $(template).html().trim()
    };
    return options;
}