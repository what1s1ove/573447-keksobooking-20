'use strict';

(function () {
  var helpers = window.helpers;
  var successTemplateNode = document.querySelector('#success').content;
  var successNode = successTemplateNode.querySelector('.success');
  var errorTemplateNode = document.querySelector('#error').content;
  var errorNode = errorTemplateNode.querySelector('.error');


  var initModal = function (modal, contentNode) {
    var closeModal = function () {
      modal.remove();

      document.removeEventListener('keydown', onPopupEscPress);
      document.removeEventListener('click', onOverlayClick);
    };

    var onPopupEscPress = function (evt) {
      helpers.checkIsEscEvent(evt, closeModal);
    };

    var onOverlayClick = function (evt) {

      if (evt.target !== contentNode) {
        closeModal();
      }
    };

    document.querySelector('main').append(modal);

    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onOverlayClick);
  };

  var renderSuccessModal = function () {
    var modalSuccess = successNode.cloneNode(true);
    var contentNode = modalSuccess.querySelector('.success__message');

    initModal(modalSuccess, contentNode);
  };

  var renderErrorModal = function (message) {
    var modalError = errorNode.cloneNode(true);
    var contentNode = modalError.querySelector('.error__message');

    contentNode.textContent = message;

    initModal(modalError, contentNode);
  };

  window.modals = {
    renderSuccess: renderSuccessModal,
    renderError: renderErrorModal
  };
})();
