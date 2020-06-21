'use strict';

window.map = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mainMap = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.querySelector('.map__pin');
  var filterForm = document.querySelector('.map__filters');
  var filterFormElements = filterForm.querySelectorAll('select, fieldset');

  var renderPin = function (offerData, offerIdx, template) {
    var pin = template.cloneNode(true);

    var pinCoordsX = offerData.location.x - constants.PIN_SIZES.WIDTH / 2;
    var pinCoordsY = offerData.location.y - constants.PIN_SIZES.HEIGHT;

    pin.style.left = pinCoordsX + 'px';
    pin.style.top = pinCoordsY + 'px';

    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;

    pin.dataset.id = offerIdx;

    return pin;
  };

  var renderPins = function (offers, container) {
    var fragment = document.createDocumentFragment();

    offers.forEach(function (offer, idx) {
      fragment.appendChild(renderPin(offer, idx, pinElement));
    });

    container.appendChild(fragment);
  };

  var initMapPinsListeners = function (map, offers) {
    map.addEventListener('click', function (evt) {
      var target = evt.target.closest('.map__pin');

      if (!target || !target.hasAttribute('data-id')) {
        return;
      }

      var offerId = target.getAttribute('data-id');
      var activeOffer = offers[offerId];

      window.card.openPopup(activeOffer);
    });
  };

  var onLoadOfferSuccess = function (offers) {
    renderPins(offers, mapPins);

    initMapPinsListeners(mapPins, offers);
  };

  var onLoadOfferFailure = function () {};

  var activeMap = function () {
    mainMap.classList.remove('map--faded');

    window.api.getOffers(onLoadOfferSuccess, onLoadOfferFailure);

    helpers.toggleElementsDisabled(filterFormElements, false);
  };

  var initMap = function () {
    helpers.toggleElementsDisabled(filterFormElements, true);
  };

  return {
    init: initMap,
    active: activeMap
  };
})();
