'use strict';

(function () {
  var offerTypesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70,
  };

  var MarkerSize = {
    WIDTH: 66,
    HEIGHT: 80,
  };

  var AdsLocationCoord = {
    X: {
      MIN: 0,
      MAX: 1200
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  window.common = {
    PinSize: PinSize,
    MarkerSize: MarkerSize,
    AdsLocationCoord: AdsLocationCoord,
    offerTypesMap: offerTypesMap
  };
})();
