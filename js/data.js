
// ***********************************************
// * СОЗДАЕТ ДАННЫЕ
// ***********************************************

'use strict';

window.data = (function () {

  var ARRAY_OF_PHOTOS_COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var PHOTOS_COUNT = 25;

  var uploadItem = document.querySelector('.upload');
  var uploadFilterControlsItem = uploadItem.querySelector('.upload-filter-controls');
  var uploadFileItem = uploadItem.querySelector('.upload-file');
  var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
  var uploadFilterLabelAll = uploadFilterControlsItem.querySelectorAll('.upload-filter-label');

  uploadOverlayItem.classList.add('invisible');
  setAttributeTabIndexForDOMElement(uploadFilterLabelAll);
  uploadFileItem.setAttribute('tabindex', 0);
  uploadOverlayItem.setAttribute('tabindex', 0);

  var arrayOfPhotosUrls = createArrayOfPhotosUrls('photos', 'jpg');
  var arrayOfPhotosLikes = createArrayOfPhotosLikes(15, 200);
  var arrayOfPhotosComments = createArrayOfPhotosComments();
  var arrayOfPhotos = createArrayOfPhotos();

  /**
   * Возвращает случайное значение согласно заданному диапазону и округлению.
   *
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function getRandomNumber(min, max) {
    var roundingRatio = 0;
    var randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(roundingRatio));
  }

  /**
   * Возвращает массив, содержащий адреса фотографий.
   *
   * @param {string} path
   * @param {string} extension
   * @return {object}
   */
  function createArrayOfPhotosUrls(path, extension) {

    var localArray = [];
    var photoUrl;

    for (var i = 1; i < PHOTOS_COUNT + 1; i++) {

      do {
        photoUrl = path + '/' + getRandomNumber(1, PHOTOS_COUNT) + '.' + extension;
      } while (localArray.indexOf(photoUrl) !== -1);

      localArray.push(photoUrl);
    }

    return localArray;
  }

  /**
   * Присваивает tabindex = 0 вложенным элементам.
   *
   * @param {object} elementAll
   */
  function setAttributeTabIndexForDOMElement(elementAll) {

    var length = elementAll.length;

    for (var i = 0; i < length; i++) {
      elementAll[i].setAttribute('tabindex', 0);
    }
  }

  /**
   * Возвращает массив, содержащий случайное кол-во лайков для каждой фотографии.
   *
   * @param {number} minCountLikes
   * @param {number} maxCountLikes
   * @return {object}
   */
  function createArrayOfPhotosLikes(minCountLikes, maxCountLikes) {

    var localArray = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {
      localArray.push(getRandomNumber(minCountLikes, maxCountLikes));
    }
    return localArray;
  }

  /**
   * Возвращает массив, содержащий массивы со случайным кол-вом комментариев для каждой фотографии.
   *
   * @return {array}
   */
  function createArrayOfPhotosComments() {

    var localArray = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {

      var commentsCount = getRandomNumber(1, ARRAY_OF_PHOTOS_COMMENTS.length);
      var arrayOfOnePhotoComments = [];
      var sentencesCount;
      var secondSentence;
      var jointSentence;
      var numberOfFirstSentence;
      var numberOfSecondSentence;

      for (var j = 0; j < commentsCount; j++) {
        numberOfFirstSentence = getRandomNumber(1, ARRAY_OF_PHOTOS_COMMENTS.length);
        jointSentence = ARRAY_OF_PHOTOS_COMMENTS[numberOfFirstSentence - 1];

        sentencesCount = getRandomNumber(1, 2);

        if (sentencesCount === 2) {

          do {
            numberOfSecondSentence = getRandomNumber(1, ARRAY_OF_PHOTOS_COMMENTS.length);
          } while (numberOfSecondSentence === numberOfFirstSentence);

          secondSentence = ARRAY_OF_PHOTOS_COMMENTS[numberOfSecondSentence - 1];
          jointSentence += ' ' + secondSentence;
        }

        arrayOfOnePhotoComments.push(jointSentence);
      }
      localArray.push(arrayOfOnePhotoComments);
    }

    return localArray;
  }

  /**
   * Заполняет массив объектов, каждый из которых представляет собой
   * фотографию.
   *
   * @return {object}
   */
  function createArrayOfPhotos() {

    var localArray = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {
      localArray.push(createPhoto(i));
    }

    return localArray;
  }

  /**
   * Возвращает объект, заполненный свойствами фотографии.
   *
   * @param {number} index
   * @return {object}
   */
  function createPhoto(index) {

    var newObject = {};

    newObject.url = arrayOfPhotosUrls[index];
    newObject.likes = arrayOfPhotosLikes[index];
    newObject.comments = arrayOfPhotosComments[index];

    return newObject;
  }
  return {
    'arrayOfPhotos': arrayOfPhotos
  };

})();
