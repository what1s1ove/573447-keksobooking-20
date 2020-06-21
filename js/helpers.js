'use strict';

window.helpers = (function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var MAIN_MOUSE_BTN_KEY = 0;

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

  var toggleElementsDisabled = function (elements, isDisabled) {
    elements.forEach(function (it) {
      it.disabled = isDisabled;
    });
  };

  var checkIsEscEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };

  var checkIsEnterEvent = function (evt, action) {
    if (evt.key === ENTER_KEY) {
      action();
    }
  };

  var checkIsMainMouseBtnEvent = function (evt, action) {
    if (evt.button === MAIN_MOUSE_BTN_KEY) {
      action();
    }
  };

  return {
    getShuffledArray: getShuffledArray,
    getRandomNumber: getRandomNumber,
    getRandomItems: getRandomItems,
    toggleElementsDisabled: toggleElementsDisabled,
    checkIsEscEvent: checkIsEscEvent,
    checkIsEnterEvent: checkIsEnterEvent,
    checkIsMainMouseBtnEvent: checkIsMainMouseBtnEvent
  };
})();
