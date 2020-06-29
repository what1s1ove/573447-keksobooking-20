'use strict';

(function () {
  var OFFERS_COUNT = 5;
  var ACTIVE_PIN_CLASS = 'map__pin--active';
  var constants = window.common;
  var helpers = window.helpers;
  var mainMap = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.querySelector('.map__pin');
  var localOffers = [];

  var getTruthOffers = function (offers) {
    var truthOffers = offers.filter(function (it) {
      var isTruth = Boolean(it.offer);

      return isTruth;
    });

    return truthOffers;
  };

  var getMappedOffers = function (offers) {
    var mappedOffers = offers.map(function (it, idx) {
      var mappedOffer = Object.assign(it, {id: idx.toString()});

      return mappedOffer;
    });

    return mappedOffers;
  };

  var renderPin = function (offerData, template) {
    var pin = template.cloneNode(true);

    var pinCoordsX = offerData.location.x - constants.PinSize.WIDTH / 2;
    var pinCoordsY = offerData.location.y - constants.PinSize.HEIGHT;

    pin.style.left = pinCoordsX + 'px';
    pin.style.top = pinCoordsY + 'px';

    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;

    pin.dataset.id = offerData.id;

    return pin;
  };

  var renderPins = function (offers) {
    var fragment = document.createDocumentFragment();

    offers.forEach(function (offer) {
      fragment.appendChild(renderPin(offer, pinElement));
    });

    mapPins.appendChild(fragment);
  };

  var removeActivePinClass = function () {
    var pin = mapPins.querySelector('.' + ACTIVE_PIN_CLASS);

    if (pin) {
      pin.classList.remove(ACTIVE_PIN_CLASS);
    }
  };

  var removePins = function (pins) {
    pins.forEach(function (it) {
      if (it.hasAttribute('data-id')) {
        it.remove();
      }
    });
  };

  var clearMap = function () {
    var pins = mapPins.querySelectorAll('.map__pin');

    removePins(pins);

    window.card.close();
  };

  var updatePins = function () {
    clearMap();

    var filteredOffers = window.filter.getFilteredOffers(localOffers);

    var cutOffers = filteredOffers.slice(0, OFFERS_COUNT);

    renderPins(cutOffers);
  };

  var onMapPinsClick = function (evt) {
    var target = evt.target.closest('.map__pin');

    if (!target || !target.hasAttribute('data-id')) {
      return;
    }

    var offerId = target.getAttribute('data-id');
    var activeOffer = helpers.getItemById(localOffers, offerId);

    window.card.open(activeOffer);

    target.classList.add(ACTIVE_PIN_CLASS);
  };

  var onLoadOfferSuccess = function (offers) {
    var truthOffers = getTruthOffers(offers);
    var mappedOffers = getMappedOffers(truthOffers);

    localOffers = mappedOffers;

    updatePins();

    mapPins.addEventListener('click', onMapPinsClick);

    window.filter.toggleStatus(true);
  };

  var onLoadOfferFailure = function (message) {
    window.modals.renderError(message);
  };

  var toggleMapStatus = function (isActive) {
    mainMap.classList.toggle('map--faded');

    if (isActive) {
      window.api.getOffers(onLoadOfferSuccess, onLoadOfferFailure);
    } else {
      clearMap();

      mapPins.removeEventListener('click', onMapPinsClick);

      window.filter.toggleStatus(isActive);
    }
  };

  var initMap = function () {
    window.filter.init();
  };

  window.map = {
    init: initMap,
    toggleStatus: toggleMapStatus,
    updatePins: updatePins,
    removeActivePinClass: removeActivePinClass
  };
})();
