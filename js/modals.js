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

  var onCloseClick = function (evt) {
    evt.target.removeEventListener('click', onCloseClick);

    closeModal();
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
    var errorMessage = modalError.querySelector('.error__message');
    var closeBtn = modalError.querySelector('.error__button');

    errorMessage.textContent = message;
    closeBtn.addEventListener('click', onCloseClick);

    initModal(modalError);
  };

  return {
    renderSuccess: renderSuccessModal,
    renderError: renderErrorModal
  };
})();
