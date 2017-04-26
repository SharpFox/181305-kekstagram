
'use strict';

window.load = (function () {

  return function (url, onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 404:
          onError('Страница не найдена: ' + xhr.status);
          break;
        default:
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();
  };
})();
