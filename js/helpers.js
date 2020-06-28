'use strict';

window.helpers = (function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var MAIN_MOUSE_BTN_KEY = 0;

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

  var setImagePreview = function (control, imgPreview) {
    var file = control.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      imgPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  return {
    toggleElementsDisabled: toggleElementsDisabled,
    checkIsEscEvent: checkIsEscEvent,
    checkIsEnterEvent: checkIsEnterEvent,
    checkIsMainMouseBtnEvent: checkIsMainMouseBtnEvent,
    setImagePreview: setImagePreview
  };
})();
