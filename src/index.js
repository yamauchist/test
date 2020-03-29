import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import $ from 'jquery';

import { initializeFacilitiesPage } from "./facilitiesMain";

import "../node_modules/uikit/custom/custom.less";

$(function () {
    if (location.pathname.includes('facilities'))
        initializeFacilitiesPage();
});


