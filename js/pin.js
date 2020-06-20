'use strict';

window.pin = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mainPin = document.querySelector('.map__pin--main');

  var pinInitCoords = {
    x: mainPin.offsetTop - mainPin.offsetHeight / 2,
    y: mainPin.offsetLeft - mainPin.offsetWidth / 2
  };

  var onPinFirstClick = function (evt) {
    helpers.checkIsMainMouseBtnEvent(evt, window.main.activeApp);
  };

  var onPinEnterPress = function (evt) {
    helpers.checkIsEnterEvent(evt, window.main.activeApp);
  };

  var onMainPinMouseDown = function (downEvt) {
    downEvt.preventDefault();

    var startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };

    var onMouseTrack = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      var Border = {
        TOP: constants.ADS_LOCATION_COORDS.Y.MIN - constants.MARKER_SIZES.HEIGHT,
        BOTTOM: constants.ADS_LOCATION_COORDS.Y.MAX - constants.MARKER_SIZES.HEIGHT,
        LEFT: constants.ADS_LOCATION_COORDS.X.MIN - (constants.MARKER_SIZES.WIDTH / 2),
        RIGHT: constants.ADS_LOCATION_COORDS.X.MAX - (constants.MARKER_SIZES.WIDTH / 2)
      };

      if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
        mainPin.style.left = mainPinPosition.x + 'px';
      }

      if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
        mainPin.style.top = mainPinPosition.y + 'px';
      }

      var pinCoords = {
        x: mainPinPosition.x + (constants.MARKER_SIZES.WIDTH / 2),
        y: mainPinPosition.y + constants.MARKER_SIZES.HEIGHT
      };

      window.form.setAddressCoords(pinCoords.x, pinCoords.y);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseTrack);
      document.removeEventListener('mouseup', onMouseTrack);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseTrack);
    document.addEventListener('mouseup', onMouseTrack);
    document.addEventListener('mouseup', onMouseUp);
  };

  var activePin = function () {
    mainPin.removeEventListener('mousedown', onPinFirstClick);
    mainPin.removeEventListener('keydown', onPinEnterPress);
  };

  var initPin = function () {
    window.form.setAddressCoords(pinInitCoords.x, pinInitCoords.y);

    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('mousedown', onPinFirstClick);
    mainPin.addEventListener('keydown', onPinEnterPress);
  };

  return {
    init: initPin,
    active: activePin
  };
})();
