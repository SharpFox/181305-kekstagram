'use strict';

window.load = (function () {

  return function (url, loadHandler, errorHandler) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          loadHandler(xhr.response);
          break;
        case 404:
          errorHandler('Страница не найдена: ' + xhr.status);
          break;
        default:
          errorHandler('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();
  };
})();
