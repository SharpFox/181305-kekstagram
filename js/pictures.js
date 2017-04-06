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

var getUrlPhoto = function (path, extension, startNumber, finishNumber) {

    var arrayUrl = [];

    for ( var i = startNumber - 1; i < finishNumber; i++) {
        arrayUrl.push(path + i + extension);
    }

};


