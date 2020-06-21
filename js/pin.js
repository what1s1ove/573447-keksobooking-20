'use strict';

window.pin = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mainPin = document.querySelector('.map__pin--main');
  var cleanUpMainPin = null;

  var pinInitCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop,
  };

  var activeApp = function () {
    window.main.toggleAppStatus(true);
  };

  var setDefaultCoords = function () {
    mainPin.style.top = pinInitCoords.y + 'px';
    mainPin.style.left = pinInitCoords.x + 'px';

    window.form.setAddressCoords(pinInitCoords.x + (mainPin.offsetWidth / 2), pinInitCoords.y + (mainPin.offsetHeight / 2));
  };

  var onPinFirstClick = function (evt) {
    helpers.checkIsMainMouseBtnEvent(evt, activeApp);
  };

  var onPinEnterPress = function (evt) {
    helpers.checkIsEnterEvent(evt, activeApp);
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

  var setPinInitListeners = function () {
    mainPin.addEventListener('mousedown', onPinFirstClick);
    mainPin.addEventListener('keydown', onPinEnterPress);

    return function () {
      mainPin.removeEventListener('mousedown', onPinFirstClick);
      mainPin.removeEventListener('keydown', onPinEnterPress);
    };
  };

  var togglePinStatus = function (isActive) {
    if (isActive) {
      cleanUpMainPin();
    } else {
      cleanUpMainPin = setPinInitListeners();

      setDefaultCoords();
    }
  };

  var initPin = function () {
    mainPin.addEventListener('mousedown', onMainPinMouseDown);

    cleanUpMainPin = setPinInitListeners();

    setDefaultCoords();
  };

  return {
    init: initPin,
    toggleStatus: togglePinStatus
  };
})();
