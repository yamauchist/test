import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import $ from 'jquery';


import "./uikit-theme/custom.less";

import { facilitiesMain } from "./facilitiesMain";
import { concerthallMain } from "./concerthallMain";

import "./css/main.css";

$(function () {
    if (location.pathname.includes('facilities')) {
        facilitiesMain();
    }

    if (location.pathname.includes('concerthall'))
        concerthallMain();
});


