'use strict';

window.pictures = (function () {

  var picturesItem = document.querySelector('.pictures');
  var pictureTemplateItem = document.querySelector('#picture-template');
  var pictureItem = pictureTemplateItem.content.querySelector('.picture');

  /**
   * Добавляет нового ребенка в '.pictures'.
   *
   * @param {object} newPhotoFrigment
   */
  function appendNewChild(newPhotoFrigment) {
    picturesItem.appendChild(newPhotoFrigment);
  }

  /**
   * Создаёт новые фотографии из шаблона, заполняя её свойства.
   *
   * @param {array} arrayOfPhotos
   */
  function createPhotos(arrayOfPhotos) {

    if (arrayOfPhotos.length === 0) {
      return;
    }

    var newPhotoFragment = document.createDocumentFragment();

    arrayOfPhotos.forEach(function (photo, i) {
      createPhoto(photo, i, newPhotoFragment);
    });

    appendNewChild(newPhotoFragment);
  }

  /**
   * Возвращает фрагмент, заполненный новой фотографией.
   *
   * @param {object} photo
   * @param {number} idNumber
   * @param {object} newPhotoFragment
   */
  function createPhoto(photo, idNumber, newPhotoFragment) {

    var newPictureItem = pictureItem.cloneNode(true);

    newPictureItem.setAttribute('tabindex', 0);
    newPictureItem.setAttribute('data-photo-id', idNumber);

    newPictureItem.querySelector('img').src = photo.url;
    newPictureItem.querySelector('.picture-likes').textContent = photo.likes;
    newPictureItem.querySelector('.picture-comments').textContent = photo.comments.length;

    newPhotoFragment.appendChild(newPictureItem);
  }

  return {
    'createPhotos': createPhotos,
    'createPhoto': createPhoto,
    'appendNewChild': appendNewChild
  };
})();
