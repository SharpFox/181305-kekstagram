'use strict';

var ARRAY_OF_PHOTOS_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

var PHOTOS_COUNT = 25;

var KEYS = {
  'ESC': 27,
  'ENTER': 13
};

var bodyItem = document.querySelector('body');
var picturesItem = bodyItem.querySelector('.pictures');
var pictureTemplate = bodyItem.querySelector('#picture-template').content;

var galleryOverlayItem = bodyItem.querySelector('.gallery-overlay');
var galleryOverlayCloseItem = galleryOverlayItem.querySelector('.gallery-overlay-close');

var uploadItem = bodyItem.querySelector('.upload');
var uploadFileItem = uploadItem.querySelector('.upload-file');
var uploadSelectImage = document.getElementById('upload-select-image');
var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
var uploadFormCancelItem = uploadOverlayItem.querySelector('.upload-form-cancel');
var uploadSubmitItem = uploadOverlayItem.querySelector('.upload-form-submit');

var arrayOfPhotosUrls = [];
createArrayOfPhotosUrls('photos', 'jpg');

var arrayOfPhotosLikes = [];
createArrayOfPhotosLikes(15, 200);

var arrayOfPhotosComments = [];
createArrayOfPhotosComments();

var arrayOfPhotos = [];
createArrayOfPhotos();

createPhotos(picturesItem, pictureTemplate);

uploadOverlayItem.classList.add('invisible');
galleryOverlayItem.classList.remove('invisible');
uploadSelectImage.classList.remove('invisible');

fillPhoto(getPhotoByIndex(0), galleryOverlayItem);

bodyItem.addEventListener('click', openPopupClickHandler);
bodyItem.addEventListener('keydown', openPopupEnterPressHandler);
galleryOverlayCloseItem.addEventListener('click', closePopupHandler);

uploadFileItem.addEventListener('click', openFramingPopupClickHandler);
uploadFormCancelItem.addEventListener('click', closeFramingPopupClickHandler);
uploadFileItem.addEventListener('keydown', openFramingPopupEnterPressHandler);
uploadSubmitItem.addEventListener('click', closeFramingPopupClickHandler);
uploadSubmitItem.addEventListener('keydown', closeFramingPopupEnterPressHandler);

/**
* ОБРАБОТЧИКИ И МЕТОДЫ РАБОТЫ С КАДРИРОВАНИЕМ ИЗОБРАЖЕНИЯ.
*/

/**
 * Открывает всплывающее окно кадрирования изображения по клику мыши.
 *
 * @param {object} evt
 */
function openFramingPopupClickHandler(evt) {
  evt.preventDefault();
  openFramingPopup();
}

/**
 * Закрывает всплывающее окно кадрирования изображения по клику мыши.
 *
 * @param {object} evt
 */
function closeFramingPopupClickHandler(evt) {
  evt.preventDefault();
  closeFramingPopup();
}

/**
 * Закрывает всплывающее окно кадрирования изображения, если нажата клавиша ESC.
 *
 * @param {object} evt
 */
function closeFramingPopupEscPressHandler(evt) {
  if (evt.keyCode === KEYS.ESC) {
    if (evt.target.className === 'upload-form-description') {
      return;
    }
    closeFramingPopup();
  }
}

/**
 * Закрывает всплывающее окно кадрирования изображения, если нажата клавиша ENTER.
 *
 * @param {object} evt
 */
function closeFramingPopupEnterPressHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    closeFramingPopup();
  }
}

/**
 * Открывает всплывающее окно кадрирования изображения, если нажата клавиша ENTER.
 *
 * @param {object} evt
 */
function openFramingPopupEnterPressHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    evt.preventDefault();
    openFramingPopup();
  }
}

/**
 * Открывает видимость элемента '.upload-overlay'
 *
 * @param {object} evt
 */
function openFramingPopup() {
  uploadOverlayItem.classList.remove('invisible');
  document.addEventListener('keydown', closeFramingPopupEscPressHandler);
}

/**
 * Закрывает видимость элемента '.upload-overlay'
 *
 * @param {object} evt
 */
function closeFramingPopup() {
  uploadOverlayItem.classList.add('invisible');
  document.removeEventListener('keydown', closeFramingPopupEscPressHandler);
}

/**
* ОБРАБОТЧИКИ И МЕТОДЫ РАБОТЫ С ПОДРОБНЫМ ОПИСАНИЕМ КАРТИНКИ.
*/

/**
 * Открывает вплывающее окно при клике на нопку мыши,
 * заполняя содержимым фотографии.
 *
 * @param {object} evt
 */
function openPopupClickHandler(evt) {
  evt.preventDefault();
  openPopup(evt);
}

/**
 * Открывает вплывающее окно по нажатию клавишы ENTER,
 * заполняя содержимым фотографии.
 *
 * @param {object} evt
 */
function openPopupEnterPressHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    if (evt.target.className === 'gallery-overlay-close') {
      closePopup();
    }
    evt.preventDefault();
    openPopup(evt);
  }
}

/**
 * Закрывает всплывающее окно, если нажама клавиша ESC.
 *
 * @param {object} evt
 */
function closePopupEscPressHandler(evt) {
  if (evt.keyCode === KEYS.ESC) {
    closePopup();
  }
}

/**
 * Возвращает объект с данными фотографии, выделеной ранее.
 *
 * @param {object} evt
 * @return {number}
 */
function getPhotoId(evt) {
  if (evt.target.localName === 'img') {
    return evt.target.parentElement.getAttribute('data-photo-id');
  }
  return evt.target.getAttribute('data-photo-id');
}

/**
 * Обработчик, закрывающий всплывающее окно.
 *
 * @param {object} evt
 */
function closePopupHandler(evt) {
  evt.preventDefault();
  closePopup();
}

/**
 * Открывает видимость элемента '.gallery-overlay'
 *
 * @param {object} evt
 */
function openPopup(evt) {

  var photoId = getPhotoId(evt);
  if (photoId === null || photoId < 0) {
    return;
  }
  fillPhoto(arrayOfPhotos[photoId], galleryOverlayItem);
  galleryOverlayItem.classList.remove('invisible');
  document.addEventListener('keydown', closePopupEscPressHandler);
}

/**
 * Закрывает видимость элемента '.gallery-overlay'
 */
function closePopup() {
  galleryOverlayItem.classList.add('invisible');
  document.removeEventListener('keydown', closePopupEscPressHandler);
}

/**
 * Возвращает объект с данными фотографии согласно переданному индексу.
 *
 * @param {number} index
 * @return {object}
 */
function getPhotoByIndex(index) {
  if (index < 0) {
    return arrayOfPhotos[0];
  }
  return arrayOfPhotos[index];
}

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
 * Заполняет массив, содержащий адреса фотографий.
 *
 * @param {string} path
 * @param {string} extension
 */
function createArrayOfPhotosUrls(path, extension) {

  var photoUrl;

  for (var i = 1; i < PHOTOS_COUNT + 1; i++) {

    do {
      photoUrl = path + '/' + getRandomNumber(1, PHOTOS_COUNT) + '.' + extension;
    } while (arrayOfPhotosUrls.indexOf(photoUrl) !== -1);

    arrayOfPhotosUrls.push(photoUrl);
  }
}

/**
 * Заполняет массив, содержащий случайное кол-во лайков для каждой фотографии.
 *
 * @param {number} minCountLikes
 * @param {number} maxCountLikes
 */
function createArrayOfPhotosLikes(minCountLikes, maxCountLikes) {
  for (var i = 0; i < PHOTOS_COUNT; i++) {
    arrayOfPhotosLikes.push(getRandomNumber(minCountLikes, maxCountLikes));
  }
}

/**
 * Заполняет массив, содержащий массивы со случайным кол-вом комментариев для каждой фотографии.
 */
function createArrayOfPhotosComments() {

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
    arrayOfPhotosComments.push(arrayOfOnePhotoComments);
  }
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

/**
 * Заполняет массив объектов, каждый из которого включает в себя
 */
function createArrayOfPhotos() {
  for (var i = 0; i < PHOTOS_COUNT; i++) {
    arrayOfPhotos.push(createPhoto(i));
  }
}

/**
 * Создаёт новую фотографию из шаблона, заполняя её свойства.
 */
function createPhotos() {

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
