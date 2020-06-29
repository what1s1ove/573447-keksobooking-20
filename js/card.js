'use strict';

(function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mapFilterNode = document.querySelector('.map__filters-container');
  var popupOfferTemplateNode = document.querySelector('#card').content;
  var popupOfferNode = popupOfferTemplateNode.querySelector('.map__card');
  var popupImgNode = popupOfferTemplateNode.querySelector('.popup__photo');
  var renderedPopupNode = null;
  var popupCloseBtnNode = null;

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
      var image = popupImgNode.cloneNode(true);

      image.src = it;

      fragment.appendChild(image);
    });

    return fragment;
  };

  var getOfferAd = function (adData, popupTemplateNode) {
    var popupNode = popupTemplateNode.cloneNode(true);

    var offerAdFeatures = getOfferAdFeatures(adData.offer.features);
    var offerAdPhotos = getOfferAdPhotos(adData.offer.photos);

    popupNode.querySelector('.popup__avatar').src = adData.author.avatar;
    popupNode.querySelector('.popup__title').textContent = adData.offer.title;
    popupNode.querySelector('.popup__text--address').textContent = adData.offer.address;
    popupNode.querySelector('.popup__text--price').textContent = adData.offer.price + '₽/ночь';
    popupNode.querySelector('.popup__type').textContent = constants.offerTypesMap[adData.offer.type];
    popupNode.querySelector('.popup__text--capacity').textContent = adData.offer.rooms + ' комнаты для ' + adData.offer.guests + ' гостей';
    popupNode.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
    popupNode.querySelector('.popup__features').innerHTML = '';
    popupNode.querySelector('.popup__features').appendChild(offerAdFeatures);
    popupNode.querySelector('.popup__description').textContent = adData.offer.description;
    popupNode.querySelector('.popup__photos').innerHTML = '';
    popupNode.querySelector('.popup__photos').appendChild(offerAdPhotos);

    return popupNode;
  };

  var renderOfferPopup = function (offer, container) {
    var offerAd = getOfferAd(offer, popupOfferNode);

    container.insertAdjacentElement('beforebegin', offerAd);

    return offerAd;
  };

  var onPopupEscPress = function (evt) {
    helpers.checkIsEscEvent(evt, closePopup);
  };

  var onClosePopupClick = function () {
    closePopup();
  };

  var closePopup = function () {
    if (renderedPopupNode) {
      renderedPopupNode.remove();

      window.map.removeActivePinClass();

      popupCloseBtnNode.removeEventListener('click', onClosePopupClick);
      document.removeEventListener('keydown', onPopupEscPress);

      renderedPopupNode = null;
      popupCloseBtnNode = null;
    }
  };

  var openPopup = function (offer) {
    closePopup();

    renderedPopupNode = renderOfferPopup(offer, mapFilterNode);

    popupCloseBtnNode = renderedPopupNode.querySelector('.popup__close');

    popupCloseBtnNode.addEventListener('click', onClosePopupClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  window.card = {
    open: openPopup,
    close: closePopup
  };
})();
