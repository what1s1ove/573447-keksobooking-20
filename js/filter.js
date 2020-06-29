'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var CONTROL_DEFAULT_VALUE = 'any';

  var helpers = window.helpers;
  var filterNode = document.querySelector('.map__filters');
  var filterNodes = filterNode.querySelectorAll('select, fieldset');
  var typeControlNode = filterNode.querySelector('#housing-type');
  var priceControlNode = filterNode.querySelector('#housing-price');
  var roomsControlNode = filterNode.querySelector('#housing-rooms');
  var guestsControlNode = filterNode.querySelector('#housing-guests');
  var featuresFieldsetNode = filterNode.querySelector('#housing-features');
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
      var isSuitable = checkControlInterrelation(typeControlNode, offer.type === typeControlNode.value);

      return isSuitable;
    },
    checkPrice: function (offer) {
      var controlValue = priceControlNode.value;
      var filteringPrice = priceRangeMap[controlValue];
      var isSuitable = controlValue === CONTROL_DEFAULT_VALUE || offer.price >= filteringPrice.MIN && offer.price <= filteringPrice.MAX;

      return isSuitable;
    },
    checkRooms: function (offer) {
      var isSuitable = checkControlInterrelation(roomsControlNode, offer.rooms === Number(roomsControlNode.value));

      return isSuitable;
    },
    checkGuests: function (offer) {
      var isSuitable = checkControlInterrelation(guestsControlNode, offer.guests === Number(guestsControlNode.value));

      return isSuitable;
    },
    checkFeatures: function (offer) {
      var checkedFeatures = featuresFieldsetNode.querySelectorAll('input:checked');
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

  var onChangeForm = helpers.debounce(function () {
    window.map.updatePins();
  }, DEBOUNCE_INTERVAL);

  var initFormListeners = function () {
    filterNode.addEventListener('change', onChangeForm);

    return function () {
      filterNode.removeEventListener('change', onChangeForm);
    };
  };

  var toggleFilterStatus = function (isActive) {
    helpers.toggleNodesDisabled(filterNodes, !isActive);

    if (isActive) {
      cleanUpFilter = initFormListeners();
    } else {
      cleanUpFilter();

      filterNode.reset();
    }
  };

  var initFilter = function () {
    helpers.toggleNodesDisabled(filterNodes, true);
  };

  window.filter = {
    init: initFilter,
    toggleStatus: toggleFilterStatus,
    getFilteredOffers: getFilteredOffers
  };
})();
