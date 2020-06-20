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
  var localOffers = [];

  var renderPin = function (offerData, template) {
    var pin = template.cloneNode(true);

    var pinCoordsX = offerData.location.x - constants.PIN_SIZES.WIDTH / 2;
    var pinCoordsY = offerData.location.y - constants.PIN_SIZES.HEIGHT;

    pin.style.left = pinCoordsX + 'px';
    pin.style.top = pinCoordsY + 'px';

    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;

    pin.dataset.id = offerData.id;

    return pin;
  };

  var renderPins = function (offers, container) {
    var fragment = document.createDocumentFragment();

    offers.forEach(function (offer) {
      fragment.appendChild(renderPin(offer, pinElement));
    });

    container.appendChild(fragment);
  };

  var initMapPinsListeners = function (map) {
    map.addEventListener('click', function (evt) {
      var target = evt.target.closest('.map__pin');

      if (!target || !target.hasAttribute('data-id')) {
        return;
      }

      var activeOffer = helpers.getItemById(localOffers, target.getAttribute('data-id'));

      window.main.openAdPopup(activeOffer);
    });
  };

  var activeMap = function (offers) {
    mainMap.classList.remove('map--faded');

    localOffers = offers;

    renderPins(localOffers, mapPins);

    initMapPinsListeners(mapPins);

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
