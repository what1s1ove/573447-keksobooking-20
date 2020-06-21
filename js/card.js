'use strict';

window.card = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mapFilter = document.querySelector('.map__filters-container');
  var popupOfferTemplate = document.querySelector('#card').content;
  var popupOfferElement = popupOfferTemplate.querySelector('.map__card');
  var popupOfferElementPhoto = popupOfferTemplate.querySelector('.popup__photo');
  var popupOffer = null;
  var popupOfferCloseBtn = null;

  var getOfferAdFeatures = function (features) {
    var fragment = document.createDocumentFragment();

    features.forEach(function (it) {
      var li = document.createElement('li');

      li.className = 'popup__feature popup__feature--' + it;

      fragment.appendChild(li);
    });

    return fragment;
  };

  var getOfferAdPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (it) {
      var image = popupOfferElementPhoto.cloneNode(true);

      image.src = it;

      fragment.appendChild(image);
    });

    return fragment;
  };

  var getOfferAd = function (adData, popupTemplate) {
    var offerAdElement = popupTemplate.cloneNode(true);

    var offerAdFeatures = getOfferAdFeatures(adData.offer.features);
    var offerAdPhotos = getOfferAdPhotos(adData.offer.photos);

    offerAdElement.querySelector('.popup__avatar').src = adData.author.avatar;
    offerAdElement.querySelector('.popup__title').textContent = adData.offer.title;
    offerAdElement.querySelector('.popup__text--address').textContent = adData.offer.address;
    offerAdElement.querySelector('.popup__text--price').textContent = adData.offer.price + '₽/ночь';
    offerAdElement.querySelector('.popup__type').textContent = constants.offerTypesMap[adData.offer.type];
    offerAdElement.querySelector('.popup__text--capacity').textContent = adData.offer.rooms + ' комнаты для ' + adData.offer.guests + ' гостей';
    offerAdElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
    offerAdElement.querySelector('.popup__features').innerHTML = '';
    offerAdElement.querySelector('.popup__features').appendChild(offerAdFeatures);
    offerAdElement.querySelector('.popup__description').textContent = adData.offer.description;
    offerAdElement.querySelector('.popup__photos').innerHTML = '';
    offerAdElement.querySelector('.popup__photos').appendChild(offerAdPhotos);

    return offerAdElement;
  };

  var renderOfferPopup = function (offer, container) {
    var offerAd = getOfferAd(offer, popupOfferElement);

    container.insertAdjacentElement('beforebegin', offerAd);

    return offerAd;
  };

  var onPopupEscPress = function (evt) {
    helpers.checkIsEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    popupOffer.remove();

    popupOfferCloseBtn.removeEventListener('click', popupOfferCloseBtn);
    document.removeEventListener('keydown', onPopupEscPress);

    popupOffer = null;
    popupOfferCloseBtn = null;
  };

  var openPopup = function (offer) {
    if (popupOffer) {
      closePopup();
    }

    popupOffer = renderOfferPopup(offer, mapFilter);

    popupOfferCloseBtn = popupOffer.querySelector('.popup__close');

    popupOfferCloseBtn.addEventListener('click', closePopup);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var toggleCardStatus = function (isActive) {
    if (!isActive && popupOffer) {
      closePopup();
    }
  };

  return {
    toggleStatus: toggleCardStatus,
    openPopup: openPopup
  };
})();
