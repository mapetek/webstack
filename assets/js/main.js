// Copyright (C) 2017 Mehmet Akif Petek
// 
// This file is part of webstack.
// 
// webstack is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// webstack is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with webstack.  If not, see <http://www.gnu.org/licenses/>.
// 


var previousPage = 0;
var currentPage = 0;
var totalPages = 0;
var isDelayMode = false;
var SCROLL_TRESHOLD = 300;
var KEYBOARD_SCROLL_AMOUNT = 50;
var TRANSITION = "fade";

// Functions
function defaultScroll(margin) {
    $("section.active").css("marginTop", margin);
    // $("section.active").stop().animate({
    //     marginTop: margin + "px"
    // }, 500);
}

function prevPage() {

    if(currentPage === 0) { 
        return; 
    }

    previousPage = currentPage;

    currentPage--;
    currentPage = currentPage < 0 ? totalPages - 1 : currentPage;

    showActivePage();
    delayScroll();
}

function nextPage() {

    if(currentPage === totalPages - 1) { 
        return; 
    }

    previousPage = currentPage;

    currentPage++;
    currentPage = currentPage > totalPages - 1 ? 0 : currentPage;

    showActivePage();
    delayScroll();
}

function showActivePage() {
    var $oldPage, newPage;
    $oldPage = $($("section").get(previousPage));
    $newPage = $($("section").get(currentPage));

    orderPages()
    $newPage.css("marginTop", 0);
    $newPage.css("zIndex", 100);

    $oldPage.animate({
        opacity: 0
    }, 500);
    $oldPage.removeClass("active");
    $newPage.animate({
        opacity: 1
    }, 500);
    $newPage.addClass("active");
}

function orderPages() {
    $("section").each(function(index) {
        $(this).css("zIndex", 99 - index);
    })
}

function delayScroll() {
    isDelayMode = true;
    setTimeout(function() {
        isDelayMode = false;
    }, 1000);
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// =========

//$(document).ready(function() {
//Short of document ready
$(function() {

    totalPages = $("section").length;
    orderPages();
    showActivePage();

    var $html = $("html");

    //Test Device
    window.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.isMobile = true;
    }

    //Detect Mobile
    if (window.isMobile) {
        $html.addClass("mobile");
    }

    //Detect Browser
    window.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    window.isSafari = /^((?!chrome).)*safari/i.test(navigator.userAgent);
    window.isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
    window.isChromeiOS = navigator.userAgent.match("CriOS");
    window.isMSIE = navigator.userAgent.match("MSIE");
    window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    window.isiPad = navigator.userAgent.match(/iPad/i) !== null;

    //Detect OS
    window.isWindows = navigator.platform.toUpperCase().indexOf("WIN") !== -1;
    window.isOSX = navigator.platform.toUpperCase().indexOf("MAC") !== -1;
    window.isLinux = navigator.platform.toUpperCase().indexOf("LINUX") !== -1;

    //Prepare for CSS Fixes
    if (window.isSafari) {
        $html.addClass("safari");
    }
    if (window.isFirefox) {
        $html.addClass("firefox");
    }
    if (window.isChrome) {
        $html.addClass("chrome");
    }
    if (window.isMSIE) {
        $html.addClass("msie");
    }
    if (window.isAndroid) {
        $html.addClass("android");
    }
    if (window.isWindows) {
        $html.addClass("windows");
    }
    if (window.isOSX) {
        $html.addClass("osx");
    }
    if (window.isLinux) {
        $html.addClass("linux");
    }

    //Retina
    window.isRetina = ((window.matchMedia && (window.matchMedia("only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)").matches || window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)").matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

    if (window.isRetina){$html.addClass("retina");}
    //=======

    if(window.isOSX)
    {
        SCROLL_TRESHOLD = 200;
    }


    $("body").on("keydown", function(event) {

        if (isDelayMode) {
            return;
        }

        var keyCode = event.which,
            viewHeight = parseInt($("html, body").css("height")),
            activePageHeight = parseInt($("section.active").css("height")),
            activePageMargin = parseInt($("section.active").css("marginTop"));

        if (activePageHeight <= viewHeight)
        {
            switch (keyCode) {
                case 40:
                    nextPage();
                    break;
                case 38:
                    prevPage();
                    break;
                default:
                    break;
            }

            delayScroll();

        } else {

            switch (keyCode) {
                case 38:
                    if (activePageMargin + KEYBOARD_SCROLL_AMOUNT <= 0)
                    {
                        defaultScroll(activePageMargin + KEYBOARD_SCROLL_AMOUNT);
                    }
                    else if(activePageMargin === 0)
                    {
                        prevPage();
                    }
                    else
                    {
                        defaultScroll(0);
                    }
                    break;
                case 40:
                    if ((activePageMargin + activePageHeight - KEYBOARD_SCROLL_AMOUNT) > viewHeight)
                    {
                        defaultScroll(activePageMargin - KEYBOARD_SCROLL_AMOUNT);
                    }
                    else if (activePageMargin + activePageHeight > viewHeight)
                    {
                        nextPage();
                    }
                    else
                    {
                        defaultScroll(viewHeight - activePageHeight);
                    }
                    break;
                default:
                    break;
            }
        }
    });

    $(window).resize(function() {

        var viewHeight = parseInt($("html, body").css("height")),
            activePageHeight = parseInt($("section.active").css("height")),
            activePageMargin = parseInt($("section.active").css("marginTop"));

        if (activePageMargin > 0) {
            defaultScroll(0);
        }

        if ((activePageMargin + activePageHeight) <= viewHeight) {
            defaultScroll(viewHeight - activePageHeight);

        }
    })

    //var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn"t recognize mousewheel as of FF3.x

    $("html, body").on("DOMMouseScroll mousewheel scroll touchmove", function(event) {

        var normalizedWheel = normalizeWheel(event);

        if (isDelayMode == true)
        {
            event.preventDefault()
            return;
        }

        var scrollsize = Math.ceil(Math.abs(event.deltaY) * event.deltaFactor),
            browserScrollRate = (window.isFirefox) ? 2 : 1,
            OSScrollRate = (window.isWindows) ? browserScrollRate * 2 : browserScrollRate,
            wheelDelta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : event.deltaY * event.deltaFactor,
            energy = wheelDelta * browserScrollRate * OSScrollRate,
            scrollDirection = (event.deltaY >= 0) ? "up" : "down",
            curSecScrolltop = $(currentSection).scrollTop(),
            currentSectionHeight = $(currentSection).find(".container").outerHeight(),
            minScrollToSlide = (window.isFirefox && window.isWindows) ? 200 : window.minScrollToSlide;

        var scrollAmount = 0,
            scrollDirection = "";

        var currentSection = $(".page.current .content"),
            scrollAmount = Math.abs(Math.round(event.originalEvent.deltaY)),
            scrollDirection = (event.originalEvent.deltaY >= 0) ? -1 : 1;

        if ((window.isWindows) || (window.isLinux)) {
            scrollAmount = Math.abs(event.originalEvent.deltaY) * event.originalEvent.deltaFactor;
        }

        if(window.isFirefox) {
            scrollAmount = Math.abs(normalizedWheel.pixelY)
            scrollDirection = normalizedWheel.pixelY < 0 ? 1 : -1
        }

        var scrollDelta = scrollAmount * scrollDirection;

        var viewHeight = parseInt($("html, body").css("height")),
            activePageHeight = parseInt($("section.active").css("height")),
            activePageMargin = parseInt($("section.active").css("marginTop"));

        if (activePageHeight <= viewHeight) {
            event.preventDefault();

            if (scrollAmount > SCROLL_TRESHOLD) {
                if (scrollDirection == 1) {
                    prevPage();
                } else {
                    nextPage();
                }
            }
        } else {

            if (scrollDirection == 1) {
                if (activePageMargin + scrollDelta <= 0) {
                    defaultScroll(activePageMargin + scrollDelta);

                } else {

                    event.preventDefault();
                    defaultScroll(0);

                    if (scrollAmount > SCROLL_TRESHOLD) {
                        prevPage();
                    }
                }
            } else {

                if ((activePageMargin + activePageHeight + scrollDelta) > viewHeight) {
                    defaultScroll(activePageMargin + scrollDelta);

                } else {
                    event.preventDefault();
                    defaultScroll(viewHeight - activePageHeight);

                    if (scrollAmount > SCROLL_TRESHOLD) {
                        nextPage();
                    }
                }
            }
        }
    });
});
