'use strict';

window.main = (function () {
  var OFFERS_COUNT = 8;
  var offers = window.data.getOffers(OFFERS_COUNT);

  var openAdPopup = function (offer) {
    window.card.openPopup(offer);
  };

  var activeApp = function () {
    window.map.activeMap(offers);
    window.form.activeForm();
    window.pin.activePin();
  };

  var initApp = function () {
    window.map.initMap();
    window.form.initForm();
    window.pin.initPin();
  };

  initApp();

  return {
    activeApp: activeApp,
    openAdPopup: openAdPopup
  };
})();
