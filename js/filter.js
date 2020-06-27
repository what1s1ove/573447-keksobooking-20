'use strict';

window.filter = (function () {
  var CONTROL_DEFAULT_VALUE = 'any';
  var helpers = window.helpers;
  var filter = document.querySelector('.map__filters');
  var filterFormElements = filter.querySelectorAll('select, fieldset');
  var typeControl = filter.querySelector('#housing-type');
  var priceControl = filter.querySelector('#housing-price');
  var roomsControl = filter.querySelector('#housing-rooms');
  var guestsControl = filter.querySelector('#housing-guests');
  var featuresFieldset = filter.querySelector('#housing-features');
  var cleanUpFilter = null;

  var priceRangeMap = {
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'low': {
      MIN: 0,
      MAX: 10000
    },
    'high': {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var checkControlInterrelation = function (control, checker) {
    var isInterrelation = control.value === CONTROL_DEFAULT_VALUE || checker;

    return isInterrelation;
  };

  var offerFilterValidations = {
    checkType: function (offer) {
      var isSuitable = checkControlInterrelation(typeControl, offer.type === typeControl.value);

      return isSuitable;
    },
    checkPrice: function (offer) {
      var controlValue = priceControl.value;
      var filteringPrice = priceRangeMap[controlValue];
      var isSuitable = controlValue === CONTROL_DEFAULT_VALUE || offer.price >= filteringPrice.MIN && offer.price <= filteringPrice.MAX;

      return isSuitable;
    },
    checkRooms: function (offer) {
      var isSuitable = checkControlInterrelation(roomsControl, offer.rooms === Number(roomsControl.value));

      return isSuitable;
    },
    checkGuests: function (offer) {
      var isSuitable = checkControlInterrelation(guestsControl, offer.guests === Number(guestsControl.value));

      return isSuitable;
    },
    checkFeatures: function (offer) {
      var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');
      var isSuitable = Array.from(checkedFeatures).every(function (checkbox) {
        return offer.features.includes(checkbox.value);
      });

      return isSuitable;
    }
  };

  var getFilteredOffers = function (offers) {
    var filteredOffers = offers.filter(function (offerData) {
      var isSuitable = Object.keys(offerFilterValidations).every(function (key) {
        var currentValidation = offerFilterValidations[key];

        return currentValidation(offerData.offer);
      });

      return isSuitable;
    });

    return filteredOffers;
  };

  var onChangeForm = function () {
    window.map.updatePins();
  };

  var initFormListeners = function () {
    filter.addEventListener('change', onChangeForm);

    return function () {
      filter.removeEventListener('change', onChangeForm);

      filter.reset();
    };
  };

  var toggleFilterStatus = function (isActive) {
    helpers.toggleElementsDisabled(filterFormElements, !isActive);

    if (isActive) {
      cleanUpFilter = initFormListeners();
    } else {
      cleanUpFilter();
    }
  };

  var initFilter = function () {
    helpers.toggleElementsDisabled(filterFormElements, true);
  };

  return {
    init: initFilter,
    toggleStatus: toggleFilterStatus,
    getFilteredOffers: getFilteredOffers
  };
})();
