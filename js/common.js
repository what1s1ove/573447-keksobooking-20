'use strict';

window.common = (function () {
  var offerTypesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
  };

  return {
    offerTypesMap: offerTypesMap,
    PIN_SIZE: PIN_SIZE
  };
})();
