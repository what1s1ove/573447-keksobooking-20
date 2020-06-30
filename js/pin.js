'use strict';

(function () {
  var constants = window.common;
  var helpers = window.helpers;
  var mainPinNode = document.querySelector('.map__pin--main');
  var cleanUpMainPin = null;

  var pinInitCoords = {
    x: mainPinNode.offsetLeft,
    y: mainPinNode.offsetTop,
  };

  var activeApp = function () {
    window.main.toggleAppStatus(true);
  };

  var setDefaultCoords = function () {
    mainPinNode.style.top = pinInitCoords.y + 'px';
    mainPinNode.style.left = pinInitCoords.x + 'px';

    window.form.setAddressCoords(pinInitCoords.x + (mainPinNode.offsetWidth / 2), pinInitCoords.y + (mainPinNode.offsetHeight / 2));
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

    var trackMouse = function (evt) {
      evt.preventDefault();

      var shift = {
        x: startCoords.x - evt.clientX,
        y: startCoords.y - evt.clientY
      };

      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var mainPinPosition = {
        x: mainPinNode.offsetLeft - shift.x,
        y: mainPinNode.offsetTop - shift.y
      };

      var Border = {
        TOP: constants.AdsLocationCoord.Y.MIN - constants.MarkerSize.HEIGHT,
        BOTTOM: constants.AdsLocationCoord.Y.MAX - constants.MarkerSize.HEIGHT,
        LEFT: constants.AdsLocationCoord.X.MIN - (constants.MarkerSize.WIDTH / 2),
        RIGHT: constants.AdsLocationCoord.X.MAX - (constants.MarkerSize.WIDTH / 2)
      };

      if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
        mainPinNode.style.left = mainPinPosition.x + 'px';
      }

      if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
        mainPinNode.style.top = mainPinPosition.y + 'px';
      }

      var pinCoords = {
        x: mainPinPosition.x + (constants.MarkerSize.WIDTH / 2),
        y: mainPinPosition.y + constants.MarkerSize.HEIGHT
      };

      window.form.setAddressCoords(pinCoords.x, pinCoords.y);
    };

    var onMouseTrackMove = function (moveEvt) {
      trackMouse(moveEvt);
    };

    var onMouseTrackUp = function (upEvt) {
      trackMouse(upEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseTrackMove);
      document.removeEventListener('mouseup', onMouseTrackUp);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseTrackMove);
    document.addEventListener('mouseup', onMouseTrackUp);
    document.addEventListener('mouseup', onMouseUp);
  };

  var setPinInitListeners = function () {
    mainPinNode.addEventListener('mousedown', onPinFirstClick);
    mainPinNode.addEventListener('keydown', onPinEnterPress);

    return function () {
      mainPinNode.removeEventListener('mousedown', onPinFirstClick);
      mainPinNode.removeEventListener('keydown', onPinEnterPress);
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
    mainPinNode.addEventListener('mousedown', onMainPinMouseDown);

    cleanUpMainPin = setPinInitListeners();

    setDefaultCoords();
  };

  window.pin = {
    init: initPin,
    toggleStatus: togglePinStatus
  };
})();
