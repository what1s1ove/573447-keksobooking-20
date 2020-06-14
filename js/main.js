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

var roomsToGuestsMap = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

var MAIN_MOUSE_BTN_KEY = 0;

var mainMap = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var mapFilter = document.querySelector('.map__filters-container');
var pinTemplate = document.querySelector('#pin').content;
var pinElement = pinTemplate.querySelector('.map__pin');
var popupOfferTemplate = document.querySelector('#card').content;
var popupOfferElement = popupOfferTemplate.querySelector('.map__card');
var popupOfferElementPhoto = popupOfferTemplate.querySelector('.popup__photo');
var adForm = document.querySelector('.ad-form');
var adFormElements = adForm.querySelectorAll('fieldset');
var adTypeSelect = document.querySelector('#type');
var adPriceInput = document.querySelector('#price');
var adAddressInput = adForm.querySelector('#address');
var adTimeInInput = adForm.querySelector('#timein');
var adTimeOutInput = adForm.querySelector('#timeout');
var adRoomNumberSelect = adForm.querySelector('#room_number');
var adCapacitySelect = adForm.querySelector('#capacity');
var filterForm = document.querySelector('.map__filters');
var filterFormElements = filterForm.querySelectorAll('select, fieldset');
var popupOffer;
var popupOfferCloseBtn;

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

var getItemById = function (arr, id) {
  var itemById = arr.find(function (it) {
    return it.id === id;
  });

  return itemById;
};

var getOffer = function (offerIdx) {
  var offerNumber = offerIdx + 1;
  var offerLocationX = getRandomNumber(OfferOptions.LOCATION.X.MIN, OfferOptions.LOCATION.X.MAX);
  var offerLocationY = getRandomNumber(OfferOptions.LOCATION.Y.MIN, OfferOptions.LOCATION.Y.MAX);

  var offer = {
    id: offerNumber.toString(),
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
  var pin = template.cloneNode(true);

  var pinCoordsX = offerData.location.x - PIN_SIZE.WIDTH / 2;
  var pinCoordsY = offerData.location.y - PIN_SIZE.HEIGHT;

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
  var offerAd = getOfferAd(offer, popupOfferElement);

  container.insertAdjacentElement('beforebegin', offerAd);

  return offerAd;
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
  var pinCoords = x.toFixed() + ', ' + y.toFixed();

  return pinCoords;
};

var onChangeAdType = function (evt) {
  switch (offerTypesMap[evt.target.value]) {
    case offerTypesMap.flat:
      adPriceInput.min = 1000;
      adPriceInput.placeholder = '1000';
      break;
    case offerTypesMap.house:
      adPriceInput.min = 5000;
      adPriceInput.placeholder = '5000';
      break;
    case offerTypesMap.palace:
      adPriceInput.min = 10000;
      adPriceInput.placeholder = '10000';
      break;
    default:
      adPriceInput.min = 0;
      adPriceInput.placeholder = '0';
  }
};

var onChangeAdTime = function (evt) {
  var timeValue = evt.target.value;

  adTimeInInput.value = timeValue;
  adTimeOutInput.value = timeValue;
};

var onChangeCapacity = function () {
  var roomGuests = roomsToGuestsMap[adRoomNumberSelect.value];
  var isAllow = roomGuests.includes(Number(adCapacitySelect.value));

  adCapacitySelect.setCustomValidity(isAllow ? '' : 'Чувак, слишком много людей для такого типа помещения... Think about it!🤔');
};

var setAdFromListeners = function () {
  adTypeSelect.addEventListener('change', onChangeAdType);
  adTimeInInput.addEventListener('change', onChangeAdTime);
  adTimeOutInput.addEventListener('change', onChangeAdTime);
  adCapacitySelect.addEventListener('change', onChangeCapacity);
  adRoomNumberSelect.addEventListener('change', onChangeCapacity);
};

var onPopupEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();

    closePopup();
  }
};

var closePopup = function () {
  popupOffer.remove();

  popupOfferCloseBtn.removeEventListener('click', popupOfferCloseBtn);
  document.removeEventListener('keydown', onPopupEscPress);
};

var openPopup = function (offer) {
  popupOffer = renderOfferPopup(offer, mapFilter);

  popupOfferCloseBtn = popupOffer.querySelector('.popup__close');

  popupOfferCloseBtn.addEventListener('click', closePopup);
  document.addEventListener('keydown', onPopupEscPress);
};

var initMapPinsListeners = function (map) {
  map.addEventListener('click', function (evt) {
    var target = evt.target.closest('.map__pin');

    if (!target || !target.hasAttribute('data-id')) {
      return;
    }

    var activeOffer = getItemById(offers, target.getAttribute('data-id'));

    if (popupOffer) {
      closePopup();
    }

    openPopup(activeOffer);
  });
};

var initMap = function (mapOffers) {
  var currentPinCoords = getPinCoords(mainPin.offsetTop + PIN_SIZE.HEIGHT, mainPin.offsetLeft + PIN_SIZE.WIDTH / 2);

  mainMap.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  renderPins(mapOffers, mapPins);

  initMapPinsListeners(mapPins);

  adAddressInput.value = currentPinCoords;

  toggleActiveFormsStatus(true);

  setAdFromListeners();

  mainPin.removeEventListener('mousedown', onMainPinFirstClick);
  mainPin.removeEventListener('keydown', onMainPinEnterPress);
};

var initApp = function () {
  var defaultPinCoords = getPinCoords(mainPin.offsetTop - mainPin.offsetHeight / 2, mainPin.offsetLeft - mainPin.offsetWidth / 2);

  toggleActiveFormsStatus(false);

  mainPin.addEventListener('mousedown', onMainPinFirstClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);

  adAddressInput.value = defaultPinCoords;
};

initApp();
