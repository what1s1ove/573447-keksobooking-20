'use strict';

window.api = (function () {
  var BASE_URL = 'https://javascript.pages.academy/keksobooking';
  var MS_TIMEOUT = 10000;
  var StatusCode = {
    OK: 200
  };

  var sendRequest = function (method, path, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    var url = BASE_URL + path;

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = MS_TIMEOUT;

    xhr.open(method, url);

    xhr.send(data || null);
  };

  return {
    getOffers: function (onSuccess, onError) {
      sendRequest('GET', '/data', onSuccess, onError);
    },
    sendAd: function (onSuccess, onError, data) {
      sendRequest('POST', '', onSuccess, onError, data);
    }
  };
})();
