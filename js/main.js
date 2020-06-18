'use strict';

window.main = (function () {
  var OFFERS_COUNT = 8;
  var offers = window.data.getOffers(OFFERS_COUNT);

  var openAdPopup = function (offer) {
    window.card.openPopup(offer);
  };

  var activeApp = function () {
    window.map.active(offers);
    window.form.active();
    window.pin.active();
  };

  var initApp = function () {
    window.map.init();
    window.form.init();
    window.pin.init();
  };

  initApp();

  return {
    activeApp: activeApp,
    openAdPopup: openAdPopup
  };
})();
