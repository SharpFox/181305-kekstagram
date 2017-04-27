
// ***********************************************
// * РАБОТАЕТ С ГАЛЕРЕЕЙ ИЗОБРАЖЕНИЙ
// ***********************************************

'use strict';

(function () {

  var bodyItem = document.querySelector('body');
  var filtersForm = bodyItem.querySelector('.filters');
  var pictureItem = bodyItem.querySelector('.picture');
  var picturesItem = bodyItem.querySelector('.pictures');
  var galleryOverlayItem = bodyItem.querySelector('.gallery-overlay');
  var galleryOverlayCloseItem = galleryOverlayItem.querySelector('.gallery-overlay-close');

  var arrayOfPhotos = [];
  var sortedArrayOfPhotos = [];
  var url = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
  var lastTimeout;

  bodyItem.addEventListener('click', openPopupHandler);
  bodyItem.addEventListener('keydown', openPopupHandler);
  galleryOverlayCloseItem.addEventListener('click', closePopupHandler);
  galleryOverlayCloseItem.addEventListener('keydown', closePopupHandler);
  filtersForm.addEventListener('click', sortPhotosHandler);
  filtersForm.addEventListener('keydown', sortPhotosHandler);

  window.load(url, onLoad, onError);

  /**
   * Обрабатывает загруженный файл с данными по фотографиям.
   *
   * @param {string} dataFromServer
   */
  function onLoad(dataFromServer) {
    arrayOfPhotos = dataFromServer;
    window.pictures.createPhotos(arrayOfPhotos);
    filtersForm.classList.remove('hidden');
  }

  /**
   * Выводит сообщение об ошибке.
   *
   * @param {string} answer
   */
  function onError(answer) {

    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: #CC6633;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '20px';
    node.style.color = '#CCCCCC';

    node.textContent = answer;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  /**
   * Обработчик, открывающий всплывающее окно по клику
   * или нажатию клавиши Enter, предварительно наполняя
   * фотографию.
   *
   * @param {object} evt
   */
  function openPopupHandler(evt) {
    if (evt.keyCode === window.utils.KEYS.ENTER || evt.type === 'click') {
      openPopup(evt);
    }
  }

  /**
   * Обработчик, закрывающий всплывающее окно по клику
   * или нажатию клавиши Enter.
   *
   * @param {object} evt
   */
  function closePopupHandler(evt) {
    if (evt.keyCode !== window.utils.KEYS.ENTER && evt.type !== 'click') {
      return;
    }
    if (!window.utils.isContainClass(evt.target, 'gallery-overlay-close') && evt.target.tagName !== 'SPAN') {
      return;
    }
    closePopup(evt);
  }

  /**
   * Обработчик, закрывающий всплывающее окно по нажатию
   * клавишы ESC.
   *
   * @param {object} evt
   */
  function closePopupPressEscHandler(evt) {
    if (evt.keyCode === window.utils.KEYS.ESC) {
      closePopup(evt);
    }
  }

  /**
   * Выбирает тип сортировки согласно выбранному элементу.
   *
   * @param {object} evt
   */
  function sortPhotosHandler(evt) {
    if (evt.keyCode !== window.utils.KEYS.ENTER && evt.type !== 'click') {
      return;
    }
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    debounce(function () {
      sortPhotos(evt.target.value);
    });
  }

  /**
   * Сортирует фотографии согласно выбранного фильтра.
   *
   * @param {string} filter
   */
  function sortPhotos(filter) {

    var newPhotoFragment = window.pictures.createNewFragment();
    picturesItem.innerHTML = null;

    switch (filter) {
      case window.utils.sortFilters.new: {
        sortPhotosByNew(arrayOfPhotos);
        createSortPhotos(sortedArrayOfPhotos);
        break;
      }
      case window.utils.sortFilters.discussed: {
        sortImagesByComments(arrayOfPhotos);
        createSortPhotos(sortedArrayOfPhotos);
        break;
      }
      case window.utils.sortFilters.popular: {
        createSortPhotos(arrayOfPhotos);
        break;
      }
    }
    window.pictures.appendNewChild(newPhotoFragment);
  }

  /**
   * Возвращает 10 различных фотографий из массива, полученного с сервера.
   *
   * @param {object} currentArray
   * @return {object}
   */
  function sortPhotosByNew(currentArray) {
    var currentArrayCopy = currentArray.slice();
    sortedArrayOfPhotos = [];

    for (var i = 0; i < 10; i++) {
      var randomIndex = window.utils.getRandomArrayIndex(currentArrayCopy);
      sortedArrayOfPhotos.push(currentArrayCopy[randomIndex]);
      currentArrayCopy.splice(randomIndex, 1);
    }

    return sortedArrayOfPhotos;
  }

  /**
   * Сортирует полученный с сервера массив фотографий по количеству комментариев в порядке убывания.
   *
   * @param {object} currentArray
   * @return {object}
   */
  function sortImagesByComments(currentArray) {

    var currentArrayCopy = currentArray.slice();

    currentArrayCopy.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });

    sortedArrayOfPhotos = currentArrayCopy;
    return sortedArrayOfPhotos;
  }

  /**
   * Добавляет в разметку полученные с сервера отсортированные фотографии.
   *
   * @param {array} currentPhotosArray
   */
  function createSortPhotos(currentPhotosArray) {

    var newPhotoFragment = window.pictures.createNewFragment();
    var idNumber = 0;

    currentPhotosArray.forEach(function (photo) {
      window.pictures.createPhoto(photo, idNumber, newPhotoFragment);
      idNumber += 1;
    });
    window.pictures.appendNewChild(newPhotoFragment);
  }

  /**
   * Превратить несколько вызовов функции в течение определенного времени в один вызов.
   *
   * @param {function} func
   */
  function debounce(func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, 500);
  }

  /**
   * Показывает увеличенное изображение, предварительно наполняя
   * его и удаляя класс 'invisible' у класса 'gallery-overlay'.
   *
   * @param {object} evt
   */
  function openPopup(evt) {

    var photoId = getPhotoId(evt.target);

    if (photoId === null || photoId < 0 || typeof photoId === 'undefined') {
      return;
    }

    if (typeof arrayOfPhotos !== 'undefined') {
      window.preview.fillPhoto(arrayOfPhotos[photoId], galleryOverlayItem);
    }
    galleryOverlayItem.classList.remove('invisible');
    document.addEventListener('keydown', closePopupPressEscHandler);

    evt.preventDefault();
  }

  /**
   * Закрывает увеличенное изображение, предварительно
   * добавляя класс 'invisible' классу 'gallery-overlay'.
   *
   * @param {object} evt
   */
  function closePopup(evt) {
    galleryOverlayItem.classList.add('invisible');
    document.removeEventListener('keydown', closePopupPressEscHandler);
    evt.preventDefault();
  }

  /**
   * Возвращает объект с данными фотографии, выделеной ранее.
   *
   * @param {object} target
   * @return {number}
   */
  function getPhotoId(target) {
    while (target !== pictureItem) {
      if (target !== null && target.tagName === 'A') {
        var currentPhotoId = target.getAttribute('data-photo-id');
      }
      target = target.parentElement;
    }
    return currentPhotoId;
  }
})();
