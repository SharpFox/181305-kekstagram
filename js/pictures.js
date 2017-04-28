'use strict';

window.pictures = (function () {

  var picturesItem = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture-template').content;

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

    var pictureTemplateItem = pictureTemplate.cloneNode(true);

    pictureTemplateItem.querySelector('.picture').setAttribute('tabindex', 0);
    pictureTemplateItem.querySelector('.picture').setAttribute('data-photo-id', idNumber);

    pictureTemplateItem.querySelector('img').src = photo.url;
    pictureTemplateItem.querySelector('.picture-likes').textContent = photo.likes;
    pictureTemplateItem.querySelector('.picture-comments').textContent = photo.comments.length;

    newPhotoFragment.appendChild(pictureTemplateItem);
  }

  return {
    'createPhotos': createPhotos,
    'createPhoto': createPhoto,
    'appendNewChild': appendNewChild
  };
})();
