import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import $ from 'jquery';

import { facilitiesMain } from "./facilitiesMain";
import { concerthallMain } from "./concerthallMain";

import "../node_modules/uikit/custom/custom.less";
import "./css/main.css";

$(function () {
    console.log(location.pathname)
    if (location.pathname.includes('facilities')) {
        console.log('enter facilities main');
        facilitiesMain();
    }

    if (location.pathname.includes('concerthall'))
        concerthallMain();
});


