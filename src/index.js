import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import $ from 'jquery';


import "./uikit-theme/custom.less";

import { facilitiesMain } from "./facilitiesMain";
import { concerthallMain } from "./concerthallMain";

import "./css/main.css";

$(function () {

    $('.side-nav').find('a').each(function () {
        let result = location.pathname.split("/").filter(e => e);
        let page = result[result.length - 1];
        if ($(this).attr('href') == page) {
            $(this).parent().addClass('uk-active'); 
        }
    });

    if (location.pathname.includes('facilities')) {
        facilitiesMain();
    }

    if (location.pathname.includes('concerthall'))
        concerthallMain();
});


