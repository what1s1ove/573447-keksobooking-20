'use strict';

window.pin = (function () {
  var mainPin = document.querySelector('.map__pin--main');

  var onMainPinFirstClick = function (evt) {
    window.helpers.checkIsMainMouseBtnEvent(evt, window.main.activeApp);
  };

  var onMainPinEnterPress = function (evt) {
    window.helpers.checkIsEnterEvent(evt, window.main.activeApp);
  };

  var activePin = function () {
    mainPin.removeEventListener('mousedown', onMainPinFirstClick);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  var initPin = function () {
    mainPin.addEventListener('mousedown', onMainPinFirstClick);
    mainPin.addEventListener('keydown', onMainPinEnterPress);
  };

  return {
    initPin: initPin,
    activePin: activePin
  };
})();
