'use strict';

var OFFERS_COUNT = 8;
var OfferOptions = {
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  CHECKINS: [
    '12:00',
    '13:00',
    '14:00'
  ],
  CHECKOUTS: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  GUESTS: {
    MIN: 1,
    MAX: 15
  },
  ROOMS: {
    MIN: 1,
    MAX: 5
  },
  PRICE: {
    MIN: 1000,
    MAX: 1000000
  },
  LOCATION: {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  }
};

var PIN_SIZE = {
  WIDTH: 50,
  HEIGHT: 70
};

var offerTypesMap = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var MAIN_MOUSE_BTN_KEY = 0;

var map = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var mapFilter = document.querySelector('.map__filters-container');
var pinTemplate = document.querySelector('#pin').content;
var pin = pinTemplate.querySelector('.map__pin');
var popupOfferTemplate = document.querySelector('#card').content;
var popupOffer = popupOfferTemplate.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var addressInput = adForm.querySelector('#address');
var adFormElements = adForm.querySelectorAll('fieldset');
var filterForm = document.querySelector('.map__filters');
var filterFormElements = filterForm.querySelectorAll('select, fieldset');
var popupOfferPhoto = popupOfferTemplate.querySelector('.popup__photo');

var getShuffledArray = function (arr) {
  var copiedArray = arr.slice();

  var shuffledArray = copiedArray.sort(function () {

    return 0.5 - Math.random();
  });

  return shuffledArray;
};

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
};

var getRandomItems = function (arr) {
  var randomIndex = getRandomNumber(0, arr.length);

  var shuffledArray = getShuffledArray(arr);

  return shuffledArray.splice(0, randomIndex);
};

var getOffer = function (offerIdx) {
  var offerNumber = offerIdx + 1;
  var offerLocationX = getRandomNumber(OfferOptions.LOCATION.X.MIN, OfferOptions.LOCATION.X.MAX);
  var offerLocationY = getRandomNumber(OfferOptions.LOCATION.Y.MIN, OfferOptions.LOCATION.Y.MAX);

  var offer = {
    author: {
      avatar: 'img/avatars/user' + (offerIdx < 10 ? '0' : '') + offerNumber + '.png',
    },
    offer: {
      title: 'Offer #' + offerNumber,
      address: offerLocationX + ', ' + offerLocationY,
      price: getRandomNumber(OfferOptions.PRICE.MIN, OfferOptions.PRICE.MAX),
      type: OfferOptions.TYPES[getRandomNumber(0, OfferOptions.TYPES.length - 1)],
      guests: getRandomNumber(OfferOptions.GUESTS.MIN, OfferOptions.GUESTS.MAX),
      rooms: getRandomNumber(OfferOptions.ROOMS.MIN, OfferOptions.ROOMS.MAX),
      checkin: OfferOptions.CHECKINS[getRandomNumber(0, OfferOptions.CHECKINS.length - 1)],
      checkout: OfferOptions.CHECKOUTS[getRandomNumber(0, OfferOptions.CHECKOUTS.length - 1)],
      features: getRandomItems(OfferOptions.FEATURES),
      description: 'Simple description of offer #' + offerNumber,
      photos: getRandomItems(OfferOptions.PHOTOS),
    },
    location: {
      x: offerLocationX,
      y: offerLocationY
    }
  };

  return offer;
};

var getOffers = function (count) {
  var offers = [];

  for (var i = 0; i < count; i++) {
    var offer = getOffer(i);

    offers.push(offer);
  }

  return offers;
};

var renderPin = function (offerData, template) {
  var pinElement = template.cloneNode(true);

  var pinCoordsX = offerData.location.x - PIN_SIZE.WIDTH / 2;
  var pinCoordsY = offerData.location.y - PIN_SIZE.HEIGHT;

  pinElement.style.left = pinCoordsX + 'px';
  pinElement.style.top = pinCoordsY + 'px';

  pinElement.querySelector('img').src = offerData.author.avatar;
  pinElement.querySelector('img').alt = offerData.offer.title;

  return pinElement;
};

var renderPins = function (offers, container) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    fragment.appendChild(renderPin(offer, pin));
  });

  container.appendChild(fragment);
};

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
    var image = popupOfferPhoto.cloneNode(true);

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
  offerAdElement.querySelector('.popup__type').textContent = offerTypesMap[adData.offer.type];
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
  var offerAd = getOfferAd(offer, popupOffer);

  container.insertAdjacentElement('beforebegin', offerAd);
};

var toggleElementsDisabled = function (elements, isDisabled) {
  elements.forEach(function (it) {
    it.disabled = isDisabled;
  });
};

var toggleActiveFormsStatus = function (isActive) {
  toggleElementsDisabled(adFormElements, !isActive);
  toggleElementsDisabled(filterFormElements, !isActive);
};

var offers = getOffers(OFFERS_COUNT);

var onMainPinFirstClick = function (evt) {
  if (evt.button === MAIN_MOUSE_BTN_KEY) {
    initMap(offers);
  }
};

var onMainPinEnterPress = function (evt) {
  if (evt.key === 'Enter') {
    initMap(offers);
  }
};

var getPinCoords = function (x, y) {
  var pinCoords = x + ', ' + y;

  return pinCoords;
};

var initMap = function (mapOffers) {
  var defaultOffer = offers[0];
  var currentPinCoords = getPinCoords(mainPin.offsetTop + PIN_SIZE.HEIGHT, mainPin.offsetLeft + PIN_SIZE.WIDTH / 2);

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  renderPins(mapOffers, mapPins);
  renderOfferPopup(defaultOffer, mapFilter);

  addressInput.value = currentPinCoords;

  toggleActiveFormsStatus(true);

  mainPin.removeEventListener('mousedown', onMainPinFirstClick);
  mainPin.removeEventListener('keydown', onMainPinEnterPress);
};

var initApp = function () {
  var defaultPinCoords = getPinCoords(mainPin.offsetTop - mainPin.offsetHeight / 2, mainPin.offsetLeft - mainPin.offsetWidth / 2);

  toggleActiveFormsStatus(false);

  mainPin.addEventListener('mousedown', onMainPinFirstClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  addressInput.value = defaultPinCoords;
};

initApp();
