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

var stepValueOfFrameScale = 25;
var minValueOfFrameScale = 25;
var maxValueOfFrameScale = 100;
var currentValueOfFrameScale = 100;

var descriptionMinLength = 30;
var descriptionMaxLength = 100;

var classOflastSelectedFilter;
var lastSelectedFilter;

var bodyItem = document.querySelector('body');
var picturesItem = bodyItem.querySelector('.pictures');
var pictureTemplate = bodyItem.querySelector('#picture-template').content;

var galleryOverlayItem = bodyItem.querySelector('.gallery-overlay');
var galleryOverlayCloseItem = galleryOverlayItem.querySelector('.gallery-overlay-close');

var uploadItem = bodyItem.querySelector('.upload');
var uploadFilterItem = uploadItem.querySelector('.upload-filter');

var uploadFileItem = uploadItem.querySelector('.upload-file');
var uploadSelectImageItem = document.getElementById('upload-select-image');
var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
var uploadFormItem = uploadOverlayItem.querySelector('.upload-form');
// var uploadFilterLabelItem = uploadFormItem.querySelector('.upload-filter-label');
var uploadResizeControlsValueItem = uploadFormItem.querySelector('.upload-resize-controls-value');
var uploadFormCancelItem = uploadFormItem.querySelector('.upload-form-cancel');
var uploadSubmitItem = uploadFormItem.querySelector('.upload-form-submit');
var uploadFormDescriptionItem = uploadFormItem.querySelector('.upload-form-description');

var filterImagePreviewItem = uploadFormItem.querySelector('.filter-image-preview');
var uploadResizeControlsBbuttonDecItem = uploadFormItem.querySelector('.upload-resize-controls-button-dec');
var uploadResizeControlsBbuttonIncItem = uploadFormItem.querySelector('.upload-resize-controls-button-inc');

uploadFileItem.setAttribute('tabindex', 0);
uploadOverlayItem.setAttribute('tabindex', 0);
document.getElementById('upload-filter-none').nextElementSibling.setAttribute('tabindex', 0);
document.getElementById('upload-filter-chrome').nextElementSibling.setAttribute('tabindex', 0);
document.getElementById('upload-filter-sepia').nextElementSibling.setAttribute('tabindex', 0);
document.getElementById('upload-filter-marvin').nextElementSibling.setAttribute('tabindex', 0);
document.getElementById('upload-filter-phobos').nextElementSibling.setAttribute('tabindex', 0);
document.getElementById('upload-filter-heat').nextElementSibling.setAttribute('tabindex', 0);

uploadResizeControlsValueItem.value = maxValueOfFrameScale + '%';

var arrayOfPhotosUrls = createArrayOfPhotosUrls('photos', 'jpg');
var arrayOfPhotosLikes = createArrayOfPhotosLikes(15, 200);
var arrayOfPhotosComments = createArrayOfPhotosComments();
var arrayOfPhotos = createArrayOfPhotos();
createPhotos(picturesItem, pictureTemplate);
fillPhoto(getPhotoByIndex(0), galleryOverlayItem);

uploadOverlayItem.classList.add('invisible');
uploadSelectImageItem.classList.remove('invisible');

bodyItem.addEventListener('click', openPopupClickHandler);
bodyItem.addEventListener('keydown', openPopupEnterPressHandler);
galleryOverlayCloseItem.addEventListener('click', closePopupHandler);

uploadFileItem.addEventListener('click', openFramingPopupClickHandler);
uploadFileItem.addEventListener('keydown', openFramingPopupEnterPressHandler);
uploadFormCancelItem.addEventListener('click', closeFramingPopupClickHandler);

uploadSubmitItem.addEventListener('click', closeFramingPopupClickHandler);
uploadSubmitItem.addEventListener('keydown', closeFramingPopupEnterPressHandler);

uploadFilterItem.addEventListener('click', choiceFilterClickHandler);
uploadFilterItem.addEventListener('keydown', choiceFilterPressEnterHandler);

uploadResizeControlsBbuttonDecItem.addEventListener('click', downScaleClickHandler);
uploadResizeControlsBbuttonDecItem.addEventListener('onkeydown', downScalePressEnterHandler);

uploadResizeControlsBbuttonIncItem.addEventListener('click', upScaleClickHandler);
uploadResizeControlsBbuttonIncItem.addEventListener('onkeydown', upScalePressEnterHandler);

/**
* МЕТОДЫ ВАЛИДАЦИИ ФОРМЫ КАДРИРОВАНИЯ.
*/

/**
 * Передаёт управление по клику методу по увеличению масштаба
 * загружаемого изображения.
 *
 * @param {object} evt
 */
function upScaleClickHandler(evt) {
  evt.preventDefault();
  upScale(evt);
}

/**
 * Передаёт управление по клику методу по уменьшению масштаба
 * загружаемого изображения.
 *
 * @param {object} evt
 */
function downScaleClickHandler(evt) {
  evt.preventDefault();
  downScale(evt);
}

/**
 * Передаёт управление по нажатию на ENTER методу по увеличению масштаба
 * загружаемого изображения.
 *
 * @param {object} evt
 */
function upScalePressEnterHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    upScale(evt);
  }
}

/**
 * Передаёт управление по клику методу по уменьшению масштаба
 * загружаемого изображения.
 *
 * @param {object} evt
 */
function downScalePressEnterHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    upScale(evt);
  }
}

/**
 * Увеличивает масштаб выбранного изображения.
 *
 * @param {object} evt
 */
function upScale(evt) {
  if (uploadResizeControlsValueItem.value === maxValueOfFrameScale + '%') {
    return;
  }
  currentValueOfFrameScale = currentValueOfFrameScale + stepValueOfFrameScale;
  uploadResizeControlsValueItem.value = currentValueOfFrameScale + '%';
  filterImagePreviewItem.style.transform = 'scale(' + currentValueOfFrameScale * 0.01 + ')';
}

/**
 * Уменьшает масштаб выбранного изображения.
 *
 * @param {object} evt
 */
function downScale(evt) {
  if (uploadResizeControlsValueItem.value === minValueOfFrameScale + '%') {
    return;
  }
  currentValueOfFrameScale = currentValueOfFrameScale - stepValueOfFrameScale;
  uploadResizeControlsValueItem.value = currentValueOfFrameScale + '%';
  filterImagePreviewItem.style.transform = 'scale(' + currentValueOfFrameScale * 0.01 + ')';
}

/**
 * Выставляет новый фильтр по клику мыши.
 *
 * @param {object} evt
 */
function choiceFilterClickHandler(evt) {
  evt.preventDefault();
  doNewFilter(evt);
}

/**
 * Выставляет новый фильтр по нажатию на клавишу Enter.
 *
 * @param {object} evt
 */
function choiceFilterPressEnterHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    doNewFilter(evt);
  }
}

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
  if (checkFormDescriptionOnValueMissing() || !checkFormDescriptionOnValidTextLength()) {
    return;
  }
  closeFramingPopup();
}

/**
 * Закрывает всплывающее окно кадрирования изображения, если нажата клавиша ESC.
 *
 * @param {object} evt
 */
function closeFramingPopupEscPressHandler(evt) {
  if (evt.keyCode === KEYS.ESC) {
    if (evt.target.className === 'upload-form-description' && evt.target.tagName === 'textarea') {
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
    if (checkFormDescriptionOnValueMissing() || checkFormDescriptionOnValidTextLength()) {
      return;
    }
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
    openFramingPopup();
  }
}

/**
 * Открывает видимость элемента '.upload-overlay'
 *
 * @param {object} evt
 */
function openFramingPopup(evt) {
  uploadOverlayItem.classList.remove('invisible');
  document.addEventListener('keydown', closeFramingPopupEscPressHandler);
}

/**
 * Закрывает видимость элемента '.upload-overlay'
 */
function closeFramingPopup() {
  uploadResizeControlsValueItem.value = maxValueOfFrameScale + '%';
  if (typeof classOflastSelectedFilter !== 'undefined') {
    filterImagePreviewItem.classList.remove(classOflastSelectedFilter);
  }
  filterImagePreviewItem.style.transform = 'scale(1.00)';
  if (typeof lastSelectedFilter !== 'undefined') {
    lastSelectedFilter.checked = false;
  }
  // uploadFilterLabelItem.checked = false;
  uploadOverlayItem.classList.add('invisible');
  uploadFormDescriptionItem.value = '';
  document.removeEventListener('keydown', closeFramingPopupEscPressHandler);
}

/**
 * Выставляет новый фильтр, при необходимости удаляя старый.
 *
 * @param {object} evt
 */
function doNewFilter(evt) {

  if (evt.target.className !== 'upload-filter-preview' && evt.target.tagName !== 'LABEL') {
    return;
  }

  if (typeof classOflastSelectedFilter !== 'undefined') {
    filterImagePreviewItem.classList.remove(classOflastSelectedFilter);
  }

  var target = evt.target;
  var search = true;

  while (search) {
    if (target.tagName === 'LABEL') {
      lastSelectedFilter = target.control;
      var currentInputItem = target.control;
      currentInputItem.checked = true;
      classOflastSelectedFilter = 'filter-' + currentInputItem.value;
      filterImagePreviewItem.classList.add(classOflastSelectedFilter);
      search = false;
    }
    if (!search) {
      return;
    }
    target = target.parentElement;
  }
}

/**
 * Возвращает факт наличия или отсутствия обязательного значения
 * в комментарии формы.
 *
 * @return {boolean}
 */
function checkFormDescriptionOnValueMissing() {
  return uploadFormDescriptionItem.validity.valueMissing;
}

/**
 * Возвращает факт не соответствия введённого значения заданным
 * пределам длины в комментарии формы.
 *
 * @return {boolean}
 */
function checkFormDescriptionOnValidTextLength() {

  var result = false;

  if (uploadFormDescriptionItem.textLength >= descriptionMinLength
    && uploadFormDescriptionItem.textLength <= descriptionMaxLength) {
    result = true;
    return result;
  }

  return result;
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
    if (evt.target.className === 'gallery-overlay-close' && evt.target.tagname === 'span') {
      closePopup();
    }
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
