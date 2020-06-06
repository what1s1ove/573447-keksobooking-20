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

var OFFER_TYPES = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pitTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
  var offerLocationX = getRandomNumber(OfferOptions.LOCATION.X.MIN, OfferOptions.LOCATION.X.MAX) - PIN_SIZE.WIDTH / 2;
  var offerLocationY = getRandomNumber(OfferOptions.LOCATION.Y.MIN, OfferOptions.LOCATION.Y.MAX) - PIN_SIZE.HEIGHT;

  var offer = {
    author: {
      avatar: 'img/avatars/user' + (offerIdx < 10 ? '0' : '') + offerNumber + '.png',
    },
    offer: {
      title: 'Offer #' + offerNumber,
      address: offerLocationX + ', ' + offerLocationY,
      price: getRandomNumber(OfferOptions.PRICE.MIN, OfferOptions.PRICE.MAX),
      type: OFFER_TYPES[OfferOptions.TYPES[getRandomNumber(0, OfferOptions.TYPES.length - 1)]],
      rooms: 2,
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

var renderPin = function (pin) {
  var pinElement = pitTemplate.cloneNode(true);

  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';

  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

var renderPins = function (offers) {
  var fragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    fragment.appendChild(renderPin(offer));
  });

  mapPins.appendChild(fragment);
};

var offers = getOffers(OFFERS_COUNT);

map.classList.remove('map--faded');

renderPins(offers);
