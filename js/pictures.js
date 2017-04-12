'use strict';

var ARRAY_OF_PHOTOS_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

var PHOTOS_COUNT = 25;

/**
 * Возвращает случайное значение согласно заданному диапазону и округлению.
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
var getRandomNumber = function (min, max) {
  var roundingRatio = 0;
  var randomNumber = Math.random() * (max - min) + min;
  return parseFloat(randomNumber.toFixed(roundingRatio));
};

/**
 * Возвращает массив, содержащий адреса фотографий.
 *
 * @param {string} path
 * @param {string} extension
 * @return {array}
 */
var getArrayOfPhotosUrls = function (path, extension) {

  var arrayOfPhotosUrls = [];
  var photoUrl;

  for (var i = 1; i < PHOTOS_COUNT + 1; i++) {

    do {
      photoUrl = path + '/' + getRandomNumber(1, PHOTOS_COUNT) + '.' + extension;
    } while (arrayOfPhotosUrls.indexOf(photoUrl) !== -1);

    arrayOfPhotosUrls.push(photoUrl);
  }
  return arrayOfPhotosUrls;
};

/**
 * Возвращает массив, содержащий случайное кол-во лайков для каждой фотографии.
 *
 * @param {number} minCountLikes
 * @param {number} maxCountLikes
 * @return {array}
 */
var getArrayOfPhotosLikes = function (minCountLikes, maxCountLikes) {

  var arrayOfPhotosLikes = [];

  for (var i = 0; i < PHOTOS_COUNT; i++) {
    arrayOfPhotosLikes.push(getRandomNumber(minCountLikes, maxCountLikes));
  }

  return arrayOfPhotosLikes;
};

/**
 * Возвращает массив, содержащий случайное кол-во комментариев для каждой фотографии.
 *
 * @return {array}
 */
var getArrayOfPhotosComments = function () {

  var arrayOfPhotosComments = [];

  for (var i = 0; i < PHOTOS_COUNT; i++) {

    var commentsCount = getRandomNumber(1, 2);
    var firstCommentItem = getRandomNumber(1, ARRAY_OF_PHOTOS_COMMENTS.length);
    var commentText = ARRAY_OF_PHOTOS_COMMENTS[firstCommentItem - 1];
    var secondCommentItem;

    if (commentsCount === 2) {

      do {
        secondCommentItem = getRandomNumber(1, ARRAY_OF_PHOTOS_COMMENTS.length);
      } while (secondCommentItem === firstCommentItem);

      commentText += ARRAY_OF_PHOTOS_COMMENTS[secondCommentItem - 1];
    }

    arrayOfPhotosComments[i] = [];
    arrayOfPhotosComments[i][0] = commentsCount;
    arrayOfPhotosComments[i][1] = commentText;
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
 * @param {array} arrayOfPhotosUrls
 * @param {array} arrayOfPhotosLikes
 * @param {array} arrayOfPhotosComments
 * @return {array}
 */
var getArrayOfPhotos = function (arrayOfPhotosUrls, arrayOfPhotosLikes, arrayOfPhotosComments) {

  var arrayOfPhotos = [];
  for (var i = 0; i < PHOTOS_COUNT; i++) {
    arrayOfPhotos.push(getPhoto(arrayOfPhotosUrls[i], arrayOfPhotosLikes[i], arrayOfPhotosComments[i]));
  }

  return arrayOfPhotos;
};

/**
 * Создаёт новую фотографию из шаблона, заполняя её свойства.
 *
 * @param {array} arrayOfPhotos
 * @param {object} picturesItem
 * @param {object} pictureTemplate
 */
var createPhotos = function (arrayOfPhotos, picturesItem, pictureTemplate) {

  if (arrayOfPhotos.length === 0) {
    return;
  }

  var newPhoto = document.createDocumentFragment();

  for (var i = 0; i < arrayOfPhotos.length; i++) {

    var pictureTemplateItem = pictureTemplate.cloneNode(true);

    pictureTemplateItem.querySelector('img').src = arrayOfPhotos[i].url;
    pictureTemplateItem.querySelector('.picture-likes').textContent = arrayOfPhotos[i].likes;
    pictureTemplateItem.querySelector('.picture-comments').textContent = arrayOfPhotos[i].comments[0];

    newPhoto.appendChild(pictureTemplateItem);
  }

  picturesItem.appendChild(newPhoto);
};

/**
 * Заполняет элемент свойствами.
 *
 * @param {array} arrayOfPhotos
 * @param {object} galleryOverlayItem
 */
var fillPhoto = function (arrayOfPhotos, galleryOverlayItem) {

  if (arrayOfPhotos.length === 0) {
    return;
  }

  galleryOverlayItem.querySelector('img').src = arrayOfPhotos[0].url;
  galleryOverlayItem.querySelector('.likes-count').textContent = arrayOfPhotos[0].likes;
  galleryOverlayItem.querySelector('.comments-count').textContent = arrayOfPhotos[0].comments[0];
};

var path = 'photos';
var extension = 'jpg';

var arrayOfPhotosUrls = getArrayOfPhotosUrls(path, extension);

var minCountLikes = 15;
var maxCountLikes = 200;

var arrayOfPhotosLikes = getArrayOfPhotosLikes(minCountLikes, maxCountLikes);
var arrayOfPhotosComments = getArrayOfPhotosComments();

var arrayOfPhotos = getArrayOfPhotos(arrayOfPhotosUrls, arrayOfPhotosLikes, arrayOfPhotosComments);

var picturesItem = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture-template').content;
createPhotos(arrayOfPhotos, picturesItem, pictureTemplate);

document.querySelector('.upload-overlay').classList.add('invisible');

var galleryOverlayItem = document.querySelector('.gallery-overlay');
galleryOverlayItem.classList.remove('invisible');

fillPhoto(arrayOfPhotos, galleryOverlayItem);
