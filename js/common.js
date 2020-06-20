'use strict';

window.common = (function () {
  var offerTypesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var PIN_SIZES = {
    WIDTH: 50,
    HEIGHT: 70,
    TAIL_HEIGHT: 16
  };

  var ADS_LOCATION_COORDS = {
    X: {
      MIN: 0,
      MAX: 1200
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  return {
    PIN_SIZES: PIN_SIZES,
    ADS_LOCATION_COORDS: ADS_LOCATION_COORDS,
    offerTypesMap: offerTypesMap
  };
})();
