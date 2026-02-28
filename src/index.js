require('./styles.scss');

var Flickity = require('flickity');
require('flickity-imagesloaded');

var $carousels = new Array();

function isDebugEnabled() {
    try {
        return localStorage.getItem('debug') === '1';
    } catch (error) {
        return false;
    }
}

function auditLog(eventName, payload) {
    if (!isDebugEnabled()) {
        return;
    }

    var timestamp = new Date().toISOString();
    if (typeof payload === 'undefined') {
        console.info('[portfolio][' + timestamp + '] ' + eventName);
        return;
    }

    console.info('[portfolio][' + timestamp + '] ' + eventName, payload);
}

window.addEventListener('error', function (event) {
    auditLog('runtime:error', {
        message: event.message,
        file: event.filename,
        line: event.lineno,
        column: event.colno
    });
});

window.addEventListener('unhandledrejection', function (event) {
    auditLog('runtime:unhandledrejection', {
        reason: event.reason
    });
});

// Modals

var rootEl = document.documentElement;
var $modals = getAll('.modal');
var $modalTriggers = getAll('.modal-trigger');
var $modalCloses = getAll('.modal-card-head .delete, .modal-card-foot .button');

if ($modalTriggers.length > 0) {
    $modalTriggers.forEach(function ($el) {
        $el.addEventListener('click', function () {
            var target = $el.dataset.target;
            openModal(target);
        });
    });
}

if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
        $el.addEventListener('click', function () {
            closeModals();
        });
    });
}

function openModal(target) {
    var $target = document.getElementById(target);
    if (!$target) {
        auditLog('modal:missing-target', { target: target });
        return;
    }

    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
    auditLog('modal:open', { target: target });
    var carouselId = target + '-carousel';

    if (document.querySelector('#' + carouselId)) {
        // Initialize each carousel one time only
        if ($carousels.length === 0) {
            $carousels.push(initCarousel(carouselId));
        }
        else {
            var index = $carousels.findIndex(c => c.element.id == carouselId);
            if (index === -1) {
                $carousels.push(initCarousel(carouselId));
            }
        }
    }
}

function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
        $el.classList.remove('is-active');
    });
    auditLog('modal:close-all');
}

// Functions

function initCarousel(id) {
    return new Flickity('#' + id, {
        imagesLoaded: true,
        adaptiveHeight: true // https://github.com/metafizzy/flickity/issues/11
    });
}

function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}