'use strict';

window.form = (function () {
  var constants = window.common;
  var helpers = window.helpers;
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('fieldset');
  var adAvatar = adForm.querySelector('#avatar');
  var adAvatarImg = adForm.querySelector('.ad-form-header__preview img');
  var adAddressInput = adForm.querySelector('#address');
  var adTypeSelect = document.querySelector('#type');
  var adPriceInput = document.querySelector('#price');
  var adTimeInInput = adForm.querySelector('#timein');
  var adTimeOutInput = adForm.querySelector('#timeout');
  var adRoomNumberSelect = adForm.querySelector('#room_number');
  var adCapacitySelect = adForm.querySelector('#capacity');
  var adHousingImgLoader = adForm.querySelector('#images');
  var adHousingImgContainer = adForm.querySelector('.ad-form__photo');
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

  var clearAvatar = function () {
    var defaultAvatarPath = 'img/muffin-grey.svg';

    adAvatarImg.src = defaultAvatarPath;
  };

  var clearHousingImg = function () {
    adHousingImgContainer.innerHTML = '';
  };

  var clearFormImages = function () {
    clearAvatar();
    clearHousingImg();
  };

  var outputHousingImg = function () {
    var img = document.createElement('img');

    clearHousingImg();

    helpers.setImagePreview(adHousingImgLoader, img);

    adHousingImgContainer.append(img);
  };

  var validateFormElements = function () {
    var elements = Array.from(adForm.elements);

    elements.forEach(function (it) {
      it.style.borderColor = (!it.validity.valid || it.validity.customError) ? 'red' : '';
    });
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

    validateFormElements();

    window.api.sendAd(onFormSendSuccess, onFormSendFailure, formData);

    evt.preventDefault();
  };

  var onAdFormReset = function (evt) {
    evt.preventDefault();

    window.main.toggleAppStatus(false);
  };

  var inAdFormInvalid = function () {
    validateFormElements();
  };

  var onAdFormChange = function (evt) {
    switch (evt.target.name) {
      case adAvatar.name:
        helpers.setImagePreview(adAvatar, adAvatarImg);
        break;
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
      case adHousingImgLoader.name:
        outputHousingImg();
    }
  };

  var setAdFromListeners = function () {
    adForm.addEventListener('submit', onAdFormSubmit);
    adForm.addEventListener('reset', onAdFormReset);
    adForm.addEventListener('change', onAdFormChange);
    adForm.addEventListener('invalid', inAdFormInvalid, true);

    return function () {
      adForm.removeEventListener('submit', onAdFormSubmit);
      adForm.removeEventListener('reset', onAdFormReset);
      adForm.removeEventListener('change', onAdFormChange);
      adForm.removeEventListener('invalid', inAdFormInvalid, true);
    };
  };

  var toggleFormStatus = function (isActive) {
    adForm.classList.toggle('ad-form--disabled');

    helpers.toggleElementsDisabled(adFormElements, !isActive);

    if (isActive) {
      cleanUpAdForm = setAdFromListeners();
    } else {
      cleanUpAdForm();

      clearFormImages();

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
