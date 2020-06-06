'use strict';

var OFFERS_COUNT = 8;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_COORDS_MIN = 130;
var LOCATION_COORDS_MAX = 630;


var getRandomNumber = function (min, max) {
  var randomNumber = Math.round(min - 0.5 + Math.random() * (max - min + 1));

  return randomNumber;
};

var getRandomItem = function (arr) {
  var randomItem = arr[Math.floor(Math.random() * arr.length)];

  return randomItem;
};

var getRandomItems = function (arr) {
  var min = 0;
  var max = arr.length - 1;
  var shuffledArray = arr.slice().sort(function () {

    return 0.5 - Math.random();
  });

  var randomIndex = getRandomNumber(min, max);

  return shuffledArray.splice(0, randomIndex);
};

var getOffer = function (offerIdx) {
  var offerNumber = offerIdx + 1;

  var offer = {
    author: {
      avatar: 'img/avatars/user0' + offerNumber,
    },
    offer: {
      title: 'Offer #' + offerNumber,
      address: getRandomNumber(LOCATION_COORDS_MIN, LOCATION_COORDS_MAX) + ', ' + getRandomNumber(LOCATION_COORDS_MIN, LOCATION_COORDS_MAX),
      price: 599,
      type: getRandomItem(OFFER_TYPES),
      rooms: 2,
      checkin: getRandomItem(OFFER_CHECKS),
      checkout: getRandomItem(OFFER_CHECKS),
      features: getRandomItems(OFFER_FEATURES),
      description: 'Simple description of offer #' + offerNumber,
      photos: getRandomItems(OFFER_PHOTOS),
    },
    location: {
      x: getRandomNumber(LOCATION_COORDS_MIN, LOCATION_COORDS_MAX),
      y: getRandomNumber(LOCATION_COORDS_MIN, LOCATION_COORDS_MAX)
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

var offers = getOffers(OFFERS_COUNT);

console.log(offers);
