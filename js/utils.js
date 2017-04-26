
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

  var SCALE_VALUES = {
    'MIN': 25,
    'MAX': 100
  };

  return {
    'KEYS': KEYS,
    'filters': filters,
    'SCALE_VALUES': SCALE_VALUES,

    /**
     * Возвращает факт того, содержит ли элемент указанный класс.
     *
     * @param {object} element
     * @param {string} className
     * @return {boolean}
     */
    'isContainClass': function (element, className) {
      return element.classList.contains(className);
    }
  };
})();
