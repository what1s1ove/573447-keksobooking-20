'use strict';

window.data = (function () {
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

  var getOffer = function (offerIdx) {
    var offerNumber = offerIdx + 1;
    var offerLocationX = window.helpers.getRandomNumber(OfferOptions.LOCATION.X.MIN, OfferOptions.LOCATION.X.MAX);
    var offerLocationY = window.helpers.getRandomNumber(OfferOptions.LOCATION.Y.MIN, OfferOptions.LOCATION.Y.MAX);

    var offer = {
      id: offerNumber.toString(),
      author: {
        avatar: 'img/avatars/user' + (offerIdx < 10 ? '0' : '') + offerNumber + '.png',
      },
      offer: {
        title: 'Offer #' + offerNumber,
        address: offerLocationX + ', ' + offerLocationY,
        price: window.helpers.getRandomNumber(OfferOptions.PRICE.MIN, OfferOptions.PRICE.MAX),
        type: OfferOptions.TYPES[window.helpers.getRandomNumber(0, OfferOptions.TYPES.length - 1)],
        guests: window.helpers.getRandomNumber(OfferOptions.GUESTS.MIN, OfferOptions.GUESTS.MAX),
        rooms: window.helpers.getRandomNumber(OfferOptions.ROOMS.MIN, OfferOptions.ROOMS.MAX),
        checkin: OfferOptions.CHECKINS[window.helpers.getRandomNumber(0, OfferOptions.CHECKINS.length - 1)],
        checkout: OfferOptions.CHECKOUTS[window.helpers.getRandomNumber(0, OfferOptions.CHECKOUTS.length - 1)],
        features: window.helpers.getRandomItems(OfferOptions.FEATURES),
        description: 'Simple description of offer #' + offerNumber,
        photos: window.helpers.getRandomItems(OfferOptions.PHOTOS),
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

  return {
    getOffers: getOffers
  };
}());

