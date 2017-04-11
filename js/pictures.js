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
 * @param {number} lowerLimit
 * @param {number} upperLimit
 * @param {number} roundingRatio
 * @return {number}
 */
var getRandomNumber = function (lowerLimit, upperLimit, roundingRatio) {
  var randomNumber = Math.random() * (upperLimit - lowerLimit) + lowerLimit;
  return parseFloat(randomNumber.toFixed(roundingRatio));
};

/**
 * Возвращает массив, содержащий адреса фотографий.
 *
 * @param {string} path
 * @param {string} extension
 * @param {number} photosCount
 * @return {array}
 */
var getArrayOfPhotosUrls = function (path, extension, photosCount) {

  var arrayOfPhotosUrls = [];

  for (var i = 1; i < photosCount + 1; i++) {
    arrayOfPhotosUrls.push(path + '/' + i + '.' + extension);
  }
  return arrayOfPhotosUrls;
};

/**
 * Возвращает массив, содержащий случайное кол-во лайков для каждой фотографии.
 *
 * @param {number} lowerLimitOfRandomNumber
 * @param {number} upperLimitOfRandomNumber
 * @param {number} photosCount
 * @return {array}
 */
var getArrayOfPhotosLikes = function (lowerLimitOfRandomNumber, upperLimitOfRandomNumber, photosCount) {

  var arrayOfPhotosLikes = [];
  var roundingRatio = 0;

  for (var i = 0; i < photosCount; i++) {
    arrayOfPhotosLikes.push(getRandomNumber(lowerLimitOfRandomNumber, upperLimitOfRandomNumber, roundingRatio));
  }

  return arrayOfPhotosLikes;
};

/**
 * Возвращает массив, содержащий случайное кол-во комментариев для каждой фотографии.
 *
 * @param {array} arrayOfConstantsPhotosComments
 * @param {number} photosCount
 * @return {array}
 */
var getArrayOfPhotosComments = function (arrayOfConstantsPhotosComments, photosCount) {

  var arrayOfPhotosComments = [];
  var roundingRatio = 0;
  var lowerLimitOfRandomNumber = 1;
  var upperLimitOfRandomNumber = arrayOfConstantsPhotosComments.length;

  for (var i = 0; i < photosCount; i++) {

    var commentsCount = getRandomNumber(1, 2);
    var firstCommentItem = getRandomNumber(lowerLimitOfRandomNumber, upperLimitOfRandomNumber, roundingRatio);
    var commentText = arrayOfConstantsPhotosComments[firstCommentItem - 1];

    if (commentsCount === 2) {

      do {
        var secondCommentItem = getRandomNumber(lowerLimitOfRandomNumber, upperLimitOfRandomNumber);
      } while (secondCommentItem === firstCommentItem);

      commentText += '\n' + arrayOfConstantsPhotosComments[secondCommentItem - 1];
    }
    arrayOfPhotosComments.push(commentText);
  }

  return arrayOfPhotosComments;
};

/**
 * Возвращает объект, с заполненными свойствами фотографии.
 *
 * @param {string} url
 * @param {number} likesCount
 * @param {string} comment
 * @return {object}
 */
var getPhoto = function (url, likesCount, comment) {

  var newObject = {};

  newObject.url = url;
  newObject.likes = likesCount;
  newObject.comments = comment;

  return newObject;
};

/**
 *
 * Возвращает массив объектов, каждый из которого включает в себя
 * url фотографии, кол-во лайков и текст комментария.
 *
 * @param {number} photosCount
 * @param {array} arrayOfPhotosUrls
 * @param {array} arrayOfPhotosLikes
 * @param {array} arrayOfPhotosComments
 * @return {array}
 */
var getArrayOfPhotos = function (photosCount, arrayOfPhotosUrls, arrayOfPhotosLikes, arrayOfPhotosComments) {

  var arrayOfPhotos = [];
  for (var i = 0; i < photosCount; i++) {
    arrayOfPhotos.push(getPhoto(arrayOfPhotosUrls[i], arrayOfPhotosLikes[i], arrayOfPhotosComments[i]));
  }

  return arrayOfPhotos;
};

/**
 * Создаёт новую фотографию из шаблона, заполняя её свойства.
 *
 * @param {array} arrayOfPhotos
 */
var createPhotos = function (arrayOfPhotos) {

  var similarPictureTemplate = document.querySelector('#picture-template').content;
  var similarListElement = document.querySelector('.pictures');

  var newPhoto = document.createDocumentFragment();

  for (var i = 0; i < arrayOfPhotos.length; i++) {

    var pictureTemplateItem = similarPictureTemplate.cloneNode(true);

    pictureTemplateItem.querySelector('img').setAttribute('src', arrayOfPhotos[i].url);
    pictureTemplateItem.querySelector('.picture-likes').textContent = arrayOfPhotos[i].likes;
    pictureTemplateItem.querySelector('.picture-comments').textContent = arrayOfPhotos[i].comments;

    newPhoto.appendChild(pictureTemplateItem);
  }

  similarListElement.appendChild(newPhoto);
};

/**
 * Заполняет элемент свойствами.
 *
 * @param {array} arrayOfPhotos
 */
var fillPhoto = function (arrayOfPhotos) {

  var galleryOverlayItem = document.body.querySelector('.gallery-overlay');

  if (arrayOfPhotos.length === 0) {
    return;
  }

  galleryOverlayItem.querySelector('img').setAttribute('src', arrayOfPhotos[0].url);
  galleryOverlayItem.querySelector('.likes-count').textContent = arrayOfPhotos[0].likes;
  galleryOverlayItem.querySelector('.comments-count').textContent = arrayOfPhotos[0].comments;
};

var path = 'photos';
var extension = 'jpg';
var photosCount = 25;

var arrayOfPhotosUrls = getArrayOfPhotosUrls(path, extension, photosCount);

var lowerLimitOfRandomNumber = 15;
var upperLimitOfRandomNumber = 200;

var arrayOfPhotosLikes = getArrayOfPhotosLikes(lowerLimitOfRandomNumber, upperLimitOfRandomNumber, photosCount);
var arrayOfPhotosComments = getArrayOfPhotosComments(PHOTO_COMMENTS, photosCount);

var arrayOfPhotos = getArrayOfPhotos(photosCount, arrayOfPhotosUrls, arrayOfPhotosLikes, arrayOfPhotosComments);

createPhotos(arrayOfPhotos);

document.body.querySelector('.upload-overlay').classList.add('invisible');
document.body.querySelector('.gallery-overlay').classList.remove('invisible');

fillPhoto(arrayOfPhotos);
