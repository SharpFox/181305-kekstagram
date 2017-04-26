
// ***********************************************
// * РАБОТАЕТ С ГАЛЕРЕЕЙ ИЗОБРАЖЕНИЙ
// ***********************************************

'use strict';

(function () {

  var bodyItem = document.querySelector('body');
  var pictureItem = bodyItem.querySelector('picture');
  var galleryOverlayItem = bodyItem.querySelector('.gallery-overlay');
  var galleryOverlayCloseItem = galleryOverlayItem.querySelector('.gallery-overlay-close');

  window.pictures.createPhotos(window.data.arrayOfPhotos);
  window.preview.fillPhoto(getPhotoByIndex(0), galleryOverlayItem);

  bodyItem.addEventListener('click', openPopupHandler);
  bodyItem.addEventListener('keydown', openPopupHandler);
  galleryOverlayCloseItem.addEventListener('click', closePopupHandler);
  galleryOverlayCloseItem.addEventListener('keydown', closePopupHandler);

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

    window.preview.fillPhoto(window.data.arrayOfPhotos[photoId], galleryOverlayItem);
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

  /**
   * Возвращает объект с данными фотографии согласно переданному индексу.
   *
   * @param {number} index
   * @return {object}
   */
  function getPhotoByIndex(index) {
    if (index < 0) {
      return window.data.arrayOfPhotos[0];
    }
    return window.data.arrayOfPhotos[index];
  }
})();
