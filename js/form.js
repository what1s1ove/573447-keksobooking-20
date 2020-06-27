'use strict';

window.form = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('fieldset');
  var adAddressInput = adForm.querySelector('#address');
  var adTypeSelect = document.querySelector('#type');
  var adPriceInput = document.querySelector('#price');
  var adTimeInInput = adForm.querySelector('#timein');
  var adTimeOutInput = adForm.querySelector('#timeout');
  var adRoomNumberSelect = adForm.querySelector('#room_number');
  var adCapacitySelect = adForm.querySelector('#capacity');
  var adFormResetBtn = adForm.querySelector('.ad-form__reset');
  var cleanUpAdForm = null;

  var roomsToGuestsMap = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var getPinCoords = function (x, y) {
    var pinCoords = x.toFixed() + ', ' + y.toFixed();

    return pinCoords;
  };

  var setAddressCoords = function (x, y) {
    var coords = getPinCoords(x, y);

    adAddressInput.value = coords;
  };

  var changeAdType = function () {
    switch (constants.offerTypesMap[adTypeSelect.value]) {
      case constants.offerTypesMap.flat:
        adPriceInput.min = 1000;
        adPriceInput.placeholder = '1000';
        break;
      case constants.offerTypesMap.house:
        adPriceInput.min = 5000;
        adPriceInput.placeholder = '5000';
        break;
      case constants.offerTypesMap.palace:
        adPriceInput.min = 10000;
        adPriceInput.placeholder = '10000';
        break;
      default:
        adPriceInput.min = 0;
        adPriceInput.placeholder = '0';
    }
  };

  var changeAdTime = function (evt) {
    var timeValue = evt.target.value;

    adTimeInInput.value = timeValue;
    adTimeOutInput.value = timeValue;
  };

  var changeCapacity = function () {
    var roomGuests = roomsToGuestsMap[adRoomNumberSelect.value];
    var isAllow = roomGuests.includes(Number(adCapacitySelect.value));

    adCapacitySelect.setCustomValidity(
        isAllow
          ? ''
          : 'Чувак, слишком много людей для такого типа помещения... Think about it!🤔'
    );
  };

  var onFormSendSuccess = function () {
    window.modals.renderSuccess();
    window.main.toggleAppStatus(false);
  };

  var onFormSendFailure = function (message) {
    window.modals.renderError(message);
  };


  var onAdFormSubmit = function (evt) {
    var formData = new FormData(adForm);

    window.api.sendAd(onFormSendSuccess, onFormSendFailure, formData);

    evt.preventDefault();
  };

  var onAdFormChange = function (evt) {
    var target = evt.target;

    switch (target.name) {
      case adTimeInInput.name:
      case adTimeOutInput.name:
        changeAdTime(evt);
        break;
      case adCapacitySelect.name:
      case adRoomNumberSelect.name:
        changeCapacity();
        break;
      case adTypeSelect.name:
        changeAdType();
        break;
    }
  };

  var onAdFormReset = function (evt) {
    evt.preventDefault();

    window.main.toggleAppStatus(false);
  };

  var setAdFromListeners = function () {
    adForm.addEventListener('submit', onAdFormSubmit);
    adForm.addEventListener('change', onAdFormChange);
    adFormResetBtn.addEventListener('click', onAdFormReset);

    return function () {
      adForm.removeEventListener('submit', onAdFormSubmit);
      adForm.removeEventListener('change', onAdFormChange);
      adFormResetBtn.removeEventListener('click', onAdFormReset);
    };
  };

  var toggleFormStatus = function (isActive) {
    adForm.classList.toggle('ad-form--disabled');

    helpers.toggleElementsDisabled(adFormElements, !isActive);

    if (isActive) {
      cleanUpAdForm = setAdFromListeners();
    } else {
      cleanUpAdForm();

      adForm.reset();
    }
  };

  var initForm = function () {
    helpers.toggleElementsDisabled(adFormElements, true);
  };

  return {
    init: initForm,
    toggleStatus: toggleFormStatus,
    setAddressCoords: setAddressCoords
  };
})();
