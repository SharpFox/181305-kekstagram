'use strict';

var PHOTO_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

/**
 * Возвращает случайное значение согласно заданному диапазону и округлению.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} coffRounding
 * @return {number}
 */
var getRandomNumber = function (min, max, coffRounding) {
  var rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(coffRounding));
};

/**
 * Возвращает массив адресов к фотографиям.
 *
 * @param {string} path
 * @param {string} extension
 * @param {number} startNumber
 * @param {number} finishNumber
 * @return {array}
 */
var getUrlPhoto = function (path, extension, startNumber, finishNumber) {

  var arrayUrlPhoto = [];

  for (var i = startNumber; i < finishNumber + 1; i++) {
    arrayUrlPhoto.push(path + '/' + i + '.' + extension);
  }

  return arrayUrlPhoto;
};

/**
 * Возвращает массив случайного кол-ва лайков для каждой фотографии.
 *
 * @param {number} finishNumber
 * @param {number} minRandomNumber
 * @param {number} maxRandonNumber
 * @return {array}
 */
var getLikesPhoto = function (finishNumber, minRandomNumber, maxRandonNumber) {

  var arrayLikesPhoto = [];

  for (var i = 0; i < finishNumber; i++) {
    arrayLikesPhoto.push(getRandomNumber(minRandomNumber, maxRandonNumber, 0));
  }

  return arrayLikesPhoto;
};

/**
 * Возвращает массив случайных комментариев.
 *
 * @param {number} finishNumber
 * @param {array} commentsPhoto
 * @return {array}
 */
var getPhotoComments = function (finishNumber, commentsPhoto) {

  var arrayCommentsPhoto = [];
  var minRandomNumber = 1;

  for (var i = 0; i < finishNumber; i++) {

    var randNumberComments = getRandomNumber(1, 2);
    var randNumberFirstComment = getRandomNumber(minRandomNumber, commentsPhoto.length);
    var textComment = commentsPhoto[randNumberFirstComment - 1];

    if (randNumberComments === 2) {

      do {
        var randNumberSecondComment = getRandomNumber(minRandomNumber, commentsPhoto.length);
      } while (randNumberSecondComment === randNumberFirstComment);

      textComment += '\n' + commentsPhoto[randNumberSecondComment - 1];
    }
    arrayCommentsPhoto.push(textComment);
  }

  return arrayCommentsPhoto;
};

/**
 *
 * Возвращает массив JS объектов, каждый из которого включает в себя
 * url фотографии, кол-во лайков и кол-во и текст комментария.
 *
 * @param {number} numberObject
 * @param {array} arrayUrlPhoto
 * @param {array} arrayLikesPhoto
 * @param {array} arrayCommentsPhoto
 * @return {array}
 */
var getObject = function (numberObject, arrayUrlPhoto, arrayLikesPhoto, arrayCommentsPhoto) {

  var arrayJsObject = [];
  for (var i = 0; i < numberObject; i++) {

    var jsObject = {};

    jsObject.url = arrayUrlPhoto[i];
    jsObject.likes = arrayLikesPhoto[i];
    jsObject.comments = arrayCommentsPhoto[i];

    arrayJsObject.push(jsObject);
  }

  return arrayJsObject;
};

/**
 * Возвращает наполненный элемент свойством объекта.
 *
 * @param {object} jsObject
 * @param {object} jsObjectProperty
 * @param {object} ElementDOM
 * @param {object} pictureElement
 * @return {object}
 */
var contentPictureElement = function (jsObject, jsObjectProperty, ElementDOM, pictureElement) {
  pictureElement.querySelector(ElementDOM).textContent = jsObject[jsObjectProperty];
  return pictureElement;
};

/**
 * Возвращает наполненный элемент свойством объекта.
 *
 * @param {object} jsObject
 * @param {object} jsObjectProperty
 * @param {object} ElementDOM
 * @param {object} pictureElement
 * @return {object}
 */
var setAttributePictureElement = function (jsObject, jsObjectProperty, ElementDOM, pictureElement) {
  var imgTag = pictureElement.querySelector('img');
  imgTag.setAttribute(ElementDOM, jsObject[jsObjectProperty]);

  return pictureElement;
};

/**
 * Создаёт фрагмент.
 *
 * @param {array} arrayJsObject
 * @param {array} arrayStringElementDOM
 * @param {array} arrayStringJsObjectProperty
 * @param {object} similarPictureTemplate
 * @param {object} similarListElement
 */
var createFragment = function (arrayJsObject, arrayStringElementDOM, arrayStringJsObjectProperty, similarPictureTemplate, similarListElement) {

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayJsObject.length; i++) {

    var pictureElement = similarPictureTemplate.cloneNode(true);

    for (var j = 0; j < arrayStringElementDOM.length; j++) {
      if (arrayStringElementDOM[j].indexOf('.') === -1) {
        setAttributePictureElement(arrayJsObject[i], arrayStringJsObjectProperty[j], arrayStringElementDOM[j], pictureElement);
        continue;
      }
      contentPictureElement(arrayJsObject[i], arrayStringJsObjectProperty[j], arrayStringElementDOM[j], pictureElement);
    }
    fragment.appendChild(pictureElement);
  }
  similarListElement.appendChild(fragment);
};

var fillExistingElement = function (arrayJsObject, arrayStringElementDOM, arrayStringJsObjectProperty, SelectedExistingElement) {

  for (var i = 0; i < arrayJsObject.length; i++) {

    for (var j = 0; j < arrayStringElementDOM.length; j++) {
      if (arrayStringElementDOM[j].indexOf('.') === -1) {
        setAttributePictureElement(arrayJsObject[i], arrayStringJsObjectProperty[j], arrayStringElementDOM[j], SelectedExistingElement);
        continue;
      }
      contentPictureElement(arrayJsObject[i], arrayStringJsObjectProperty[j], arrayStringElementDOM[j], SelectedExistingElement);
    }
    break;
  }
};

var path = 'photos';
var extension = 'jpg';
var startNumber = 1;
var finishNumber = 25;

var arrayUrlPhoto = getUrlPhoto(path, extension, startNumber, finishNumber);

var minRandomNumber = 15;
var maxRandonNumber = 200;

var arrayLikesPhoto = getLikesPhoto(finishNumber, minRandomNumber, maxRandonNumber);

var arrayCommentsPhoto = getPhotoComments(finishNumber, PHOTO_COMMENTS);

var numberObject = 25;

var arrayJsObject = getObject(numberObject, arrayUrlPhoto, arrayLikesPhoto, arrayCommentsPhoto);

var similarPictureTemplate = document.querySelector('#picture-template').content;

var picturesElement = document.querySelector('.pictures');

var arrayStringElementDOM = ['src', '.picture-likes', '.picture-comments'];
var arrayStringJsObjectProperty = ['url', 'likes', 'comments'];

createFragment(arrayJsObject, arrayStringElementDOM, arrayStringJsObjectProperty, similarPictureTemplate, picturesElement);

var divTag = document.body.querySelector('.upload-overlay');
divTag.classList.add('invisible');

var galleryOverlayElement = document.body.querySelector('.gallery-overlay');
galleryOverlayElement.classList.remove('invisible');

arrayStringElementDOM.length = 0;
arrayStringElementDOM = ['src', '.likes-count', '.comments-count'];
arrayStringJsObjectProperty.length = 0;
arrayStringJsObjectProperty = ['url', 'likes', 'comments'];

fillExistingElement(arrayJsObject, arrayStringElementDOM, arrayStringJsObjectProperty, galleryOverlayElement);
