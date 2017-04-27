
// ***********************************************
// * РАБОТАЕТ С ГАЛЕРЕЕЙ ИЗОБРАЖЕНИЙ
// ***********************************************

'use strict';

(function () {

  var bodyItem = document.querySelector('body');
  var pictureItem = bodyItem.querySelector('picture');
  var galleryOverlayItem = bodyItem.querySelector('.gallery-overlay');
  var galleryOverlayCloseItem = galleryOverlayItem.querySelector('.gallery-overlay-close');

  var arrayOfPhotos;
  var url = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';

  bodyItem.addEventListener('click', openPopupHandler);
  bodyItem.addEventListener('keydown', openPopupHandler);
  galleryOverlayCloseItem.addEventListener('click', closePopupHandler);
  galleryOverlayCloseItem.addEventListener('keydown', closePopupHandler);

  window.load(url, onLoad, onError);

  /**
   * Обрабатывает загруженный файл с данными по фотографиям.
   *
   * @param {string} dataFromServer
   */
  function onLoad(dataFromServer) {
    arrayOfPhotos = dataFromServer;
    window.pictures.createPhotos(arrayOfPhotos);
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
   * Показывает увеличенное изображение, предварительно наполняя
   * его и удаляя класс 'invisible' у класса 'gallery-overlay'.
   *
   * @param {object} evt
   */
  function openPopup(evt) {

    var photoId = getPhotoId(evt.target);

    if (photoId === null || photoId < 0) {
      return;
    }

    window.preview.fillPhoto(arrayOfPhotos[photoId], galleryOverlayItem);
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
