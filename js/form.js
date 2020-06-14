'use strict';

window.form = (function () {
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  var adAddressInput = adForm.querySelector('#address');
  var adTypeSelect = document.querySelector('#type');
  var adPriceInput = document.querySelector('#price');
  var adTimeInInput = adForm.querySelector('#timein');
  var adTimeOutInput = adForm.querySelector('#timeout');
  var adRoomNumberSelect = adForm.querySelector('#room_number');
  var adCapacitySelect = adForm.querySelector('#capacity');

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

  var onChangeAdType = function (evt) {
    switch (window.common.offerTypesMap[evt.target.value]) {
      case window.common.offerTypesMap.flat:
        adPriceInput.min = 1000;
        adPriceInput.placeholder = '1000';
        break;
      case window.common.offerTypesMap.house:
        adPriceInput.min = 5000;
        adPriceInput.placeholder = '5000';
        break;
      case window.common.offerTypesMap.palace:
        adPriceInput.min = 10000;
        adPriceInput.placeholder = '10000';
        break;
      default:
        adPriceInput.min = 0;
        adPriceInput.placeholder = '0';
    }
  };

  var onChangeAdTime = function (evt) {
    var timeValue = evt.target.value;

    adTimeInInput.value = timeValue;
    adTimeOutInput.value = timeValue;
  };

  var onChangeCapacity = function () {
    var roomGuests = roomsToGuestsMap[adRoomNumberSelect.value];
    var isAllow = roomGuests.includes(Number(adCapacitySelect.value));

    adCapacitySelect.setCustomValidity(isAllow ? '' : 'Чувак, слишком много людей для такого типа помещения... Think about it!🤔');
  };

  var setAdFromListeners = function () {
    adTypeSelect.addEventListener('change', onChangeAdType);
    adTimeInInput.addEventListener('change', onChangeAdTime);
    adTimeOutInput.addEventListener('change', onChangeAdTime);
    adCapacitySelect.addEventListener('change', onChangeCapacity);
    adRoomNumberSelect.addEventListener('change', onChangeCapacity);
  };

  var activeForm = function () {
    var currentPinCoords = getPinCoords(mainPin.offsetTop + window.common.PIN_SIZE.HEIGHT, mainPin.offsetLeft + window.common.PIN_SIZE.WIDTH / 2);

    adForm.classList.remove('ad-form--disabled');

    setAdFromListeners();

    window.helpers.toggleElementsDisabled(adFormElements, false);

    adAddressInput.value = currentPinCoords;
  };

  var initForm = function () {
    var defaultPinCoords = getPinCoords(mainPin.offsetTop - mainPin.offsetHeight / 2, mainPin.offsetLeft - mainPin.offsetWidth / 2);

    window.helpers.toggleElementsDisabled(adFormElements, true);

    adAddressInput.value = defaultPinCoords;
  };

  return {
    initForm: initForm,
    activeForm: activeForm
  };
})();
