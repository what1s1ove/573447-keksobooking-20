'use strict';

window.modals = (function () {
  var helpers = window.helpers;
  var successTemplate = document.querySelector('#success').content;
  var successElement = successTemplate.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content;
  var errorElement = errorTemplate.querySelector('.error');
  var openedModal = null;

  var closeModal = function () {
    openedModal.remove();
    openedModal = null;

    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onOverlayClick);
  };

  var onPopupEscPress = function (evt) {
    helpers.checkIsEscEvent(evt, closeModal);
  };

  var onOverlayClick = function () {
    closeModal();
  };


  var initModal = function (modal) {
    openedModal = modal;

    document.body.append(modal);

    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onOverlayClick);
  };

  var renderSuccessModal = function () {
    var modalSuccess = successElement.cloneNode(true);

    initModal(modalSuccess);
  };

  var renderErrorModal = function (message) {
    var modalError = errorElement.cloneNode(true);

    modalError.querySelector('.error__message').textContent = message;

    initModal(modalError);
  };

  return {
    renderSuccess: renderSuccessModal,
    renderError: renderErrorModal
  };
})();
