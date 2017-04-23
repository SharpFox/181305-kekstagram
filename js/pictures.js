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

var FILTERS = {
  'none': 'filter-none',
  'chrome': 'filter-chrome',
  'sepia': 'filter-sepia',
  'marvin': 'filter-marvin',
  'phobos': 'filter-phobos',
  'heat': 'filter-heat',
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
var uploadFilterForm = uploadItem.querySelector('.upload-filter');
var uploadFilterControlsItem = uploadItem.querySelector('.upload-filter-controls');

var uploadFileItem = uploadItem.querySelector('.upload-file');
var uploadSelectImageItem = document.getElementById('upload-select-image');
var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
var uploadForm = uploadOverlayItem.querySelector('.upload-form');
var uploadResizeControlsValueItem = uploadForm.querySelector('.upload-resize-controls-value');
var uploadFormCancelItem = uploadForm.querySelector('.upload-form-cancel');
var uploadSubmitItem = uploadForm.querySelector('.upload-form-submit');
var uploadFormDescriptionItem = uploadForm.querySelector('.upload-form-description');

var filterImagePreviewItem = uploadForm.querySelector('.filter-image-preview');
var uploadResizeControlsBbuttonDecItem = uploadForm.querySelector('.upload-resize-controls-button-dec');
var uploadResizeControlsBbuttonIncItem = uploadForm.querySelector('.upload-resize-controls-button-inc');

var uploadFilterLabelItem = uploadFilterControlsItem.querySelector('.upload-filter-label');
var uploadFilterLabelAll = uploadFilterControlsItem.querySelectorAll('.upload-filter-label');

uploadFileItem.setAttribute('tabindex', 0);
uploadOverlayItem.setAttribute('tabindex', 0);
setAttributeTabIndexForDOMElement(uploadFilterLabelAll);

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

uploadFilterForm.addEventListener('click', choiceFilterClickHandler);
uploadFilterForm.addEventListener('keydown', choiceFilterPressEnterHandler);

uploadResizeControlsBbuttonDecItem.addEventListener('click', downScaleClickHandler);
uploadResizeControlsBbuttonDecItem.addEventListener('onkeydown', downScalePressEnterHandler);

uploadResizeControlsBbuttonIncItem.addEventListener('click', upScaleClickHandler);
uploadResizeControlsBbuttonIncItem.addEventListener('onkeydown', upScalePressEnterHandler);

/**
 * Присваивает tabindex = 0 вложенным элементам. 
 *
 * @param {object} uploadFilterLabelAll 
 */
function setAttributeTabIndexForDOMElement(uploadFilterLabelAll) {
  
  var length = uploadFilterLabelAll.length;
 
  for (var i = 0; i < length; i++) {
    uploadFilterLabelAll[i].setAttribute('tabindex', 0);
  }
}

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
  //evt.preventDefault();
  upScale(evt);
}

/**
 * Передаёт управление по клику методу по уменьшению масштаба
 * загружаемого изображения.
 *
 * @param {object} evt
 */
function downScaleClickHandler(evt) {
  //evt.preventDefault();
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
    //evt.preventDefault();
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
    //evt.preventDefault();
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
  evt.preventDefault();
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
  evt.preventDefault();
}

/**
 * Выставляет новый фильтр по клику мыши.
 *
 * @param {object} evt
 */
function choiceFilterClickHandler(evt) {
  //evt.preventDefault();
  doNewFilter(evt);
}

/**
 * Выставляет новый фильтр по нажатию на клавишу Enter.
 *
 * @param {object} evt
 */
function choiceFilterPressEnterHandler(evt) {
  if (evt.keyCode === KEYS.ENTER) {
    //evt.preventDefault();
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
  openFramingPopup();
  evt.preventDefault();
}

/**
 * Закрывает всплывающее окно кадрирования изображения по клику мыши.
 *
 * @param {object} evt
 */
function closeFramingPopupClickHandler(evt) {
  if (evt.currentTarget.className === 'upload-form-cancel') {
    evt.preventDefault();
  }
  else if (uploadFormDescriptionItem.validity.valueMissing || !checkFormDescriptionOnValidTextLength()) {
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
    //evt.preventDefault();
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
    //evt.preventDefault();
    if (uploadFormDescriptionItem.validity.valueMissing || checkFormDescriptionOnValidTextLength()) {
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
    evt.preventDefault();
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
  uploadFilterLabelItem.checked = true;
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
  var siblingTarget;

  while (target !== uploadFilterControlsItem) {
    siblingTarget = target.previousElementSibling;
    if (siblingTarget !== null && siblingTarget.tagName === 'INPUT') {
      siblingTarget.checked = true;
      classOflastSelectedFilter = FILTERS[siblingTarget.value];
      filterImagePreviewItem.classList.add(classOflastSelectedFilter);
    }
    target = target.parentElement;
  }
  evt.preventDefault();
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
  //evt.preventDefault();
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
   //evt.preventDefault();
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
    //evt.preventDefault();
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
  //evt.preventDefault();
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

  evt.preventDefault();
}

/**
 * Закрывает видимость элемента '.gallery-overlay'
 */
function closePopup() {
  galleryOverlayItem.classList.add('invisible');
  document.removeEventListener('keydown', closePopupEscPressHandler);
  evt.preventDefault();
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
