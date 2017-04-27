
// **************************************************
// * СОДЕРЖИТ ЗНАЧЕНИЯ ЧАСТО ИСПОЛЬЗУЕМЫХ ПЕРЕМЕННЫХ
// **************************************************

'use strict';

window.utils = (function () {

  var KEYS = {
    'ESC': 27,
    'ENTER': 13
  };

  var filters = {
    'none': 'filter-none',
    'chrome': 'filter-chrome',
    'sepia': 'filter-sepia',
    'marvin': 'filter-marvin',
    'phobos': 'filter-phobos',
    'heat': 'filter-heat',
  };

  var sortFilters = {
    'new': 'new',
    'discussed': 'discussed',
    'popular': 'popular'
  };

  var SCALE_VALUES = {
    'MIN': 25,
    'MAX': 100
  };

  return {
    'KEYS': KEYS,
    'filters': filters,
    'SCALE_VALUES': SCALE_VALUES,
    'sortFilters': sortFilters,

    /**
     * Возвращает факт того, содержит ли элемент указанный класс.
     *
     * @param {object} element
     * @param {string} className
     * @return {boolean}
     */
    'isContainClass': function (element, className) {
      return element.classList.contains(className);
    },

   /**
    * Возвращает случайное значение согласно заданному диапазону и округлению.
    *
    * @param {number} min
    * @param {number} max
    * @return {number}
    */
    'getRandomNumber': function (min, max) {
      var roundingRatio = 0;
      var randomNumber = Math.random() * (max - min) + min;
      return parseFloat(randomNumber.toFixed(roundingRatio));
    },

    /**
     * Возвращает случайный индекс элемента массива.
     *
     * @param {array} currentArray
     * @return {number}
     */
    'getRandomArrayIndex': function (currentArray) {
      return Math.floor(Math.random() * currentArray.length);
    }
  };
})();
