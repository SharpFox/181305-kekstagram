// picture.js

// ***********************************************
// * ОТРИСОВЫВАЕТ МИНИАТЮРУ
// ***********************************************

'use strict';

window.pictures = (function () {

  var picturesItem = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture-template').content;

  /**
   * Создаёт новую фотографию из шаблона, заполняя её свойства.
   *
   * @param {array} arrayOfPhotos
   */
  function createPhotos(arrayOfPhotos) {

    if (arrayOfPhotos.length === 0) {
      return;
    }

    var newPhoto = document.createDocumentFragment();

    for (var i = 0; i < arrayOfPhotos.length; i++) {

      var pictureTemplateItem = pictureTemplate.cloneNode(true);

      pictureTemplateItem.querySelector('.picture').setAttribute('tabindex', 0);
      pictureTemplateItem.querySelector('.picture').setAttribute('data-photo-id', i);

      pictureTemplateItem.querySelector('img').src = arrayOfPhotos[i].url;
      pictureTemplateItem.querySelector('.picture-likes').textContent = arrayOfPhotos[i].likes;
      pictureTemplateItem.querySelector('.picture-comments').textContent = arrayOfPhotos[i].comments.length;

      newPhoto.appendChild(pictureTemplateItem);
    }

    picturesItem.appendChild(newPhoto);
  }

  return {
    'createPhotos': createPhotos
  };

})();
