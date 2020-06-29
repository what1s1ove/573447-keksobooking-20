'use strict';

(function () {
  var helpers = window.helpers;
  var successTemplate = document.querySelector('#success').content;
  var successElement = successTemplate.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content;
  var errorElement = errorTemplate.querySelector('.error');


  var initModal = function (modal, content) {
    var closeModal = function () {
      modal.remove();

      document.removeEventListener('keydown', onPopupEscPress);
      document.removeEventListener('click', onOverlayClick);
    };

    var onPopupEscPress = function (evt) {
      helpers.checkIsEscEvent(evt, closeModal);
    };

    var onOverlayClick = function (evt) {

      if (evt.target !== content) {
        closeModal();
      }
    };

    document.querySelector('main').append(modal);

    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onOverlayClick);
  };

  var renderSuccessModal = function () {
    var modalSuccess = successElement.cloneNode(true);
    var contentElement = modalSuccess.querySelector('.success__message');

    initModal(modalSuccess, contentElement);
  };

  var renderErrorModal = function (message) {
    var modalError = errorElement.cloneNode(true);
    var contentElement = modalError.querySelector('.error__message');

    contentElement.textContent = message;

    initModal(modalError, contentElement);
  };

  window.modals = {
    renderSuccess: renderSuccessModal,
    renderError: renderErrorModal
  };
})();
