
// ***********************************************
// * ОТРИСОВЫВАЕТ УВЕЛИЧЕННОЕ ИЗОБРАЖЕНИЕ
// ***********************************************

'use strict';

window.preview = (function () {

  var uploadSelectImageItem = document.getElementById('upload-select-image');

  uploadSelectImageItem.classList.remove('invisible');

  /**
   * Заполняет элемент свойствами.
   * @param {object} photo
   * @param {object} pictureItem
   */
  function fillPhoto(photo, pictureItem) {
    pictureItem.querySelector('.gallery-overlay-close').setAttribute('tabindex', 0);
    pictureItem.querySelector('img').src = photo.url;
    pictureItem.querySelector('.likes-count').textContent = photo.likes;
    pictureItem.querySelector('.comments-count').textContent = photo.comments.length;
  }

  return {
    'fillPhoto': fillPhoto
  };
})();
