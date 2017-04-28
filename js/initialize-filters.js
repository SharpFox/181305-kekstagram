'use strict';

window.initializeFilters = (function () {

  var filterElement;
  var applyFilter;
  var newFilter;
  var oldFilter;

  var uploadFilterControlsItem = document.querySelector('.upload-filter-controls');

   /**
   * Выставляет новый фильтр по клику мыши.
   *
   * @param {object} evt
   */
  function choiceFilterHandler(evt) {
    if (evt.keyCode !== window.utils.KEYS.ENTER && evt.type !== 'click') {
      return;
    }

    if (!window.utils.isContainClass(evt.target, 'upload-filter-preview')
      && evt.target.tagName !== 'LABEL') {
      return;
    }

    getCurrentFilter(evt.target);
    applyFilter(newFilter, oldFilter);
  }

  /**
   * ВОзвращает текущий класс фильтра.
   *
   * @param {object} target
   */
  function getCurrentFilter(target) {

    var siblingTarget;
    oldFilter = newFilter;

    while (target !== uploadFilterControlsItem) {
      siblingTarget = target.previousElementSibling;
      if (siblingTarget !== null && siblingTarget.tagName === 'INPUT') {
        siblingTarget.checked = true;
        newFilter = window.utils.filters[siblingTarget.value];
      }
      target = target.parentElement;
    }
  }

  return function (element, callback) {

    filterElement = element;
    applyFilter = callback;

    if (typeof applyFilter !== 'function') {
      return;
    }

    filterElement.addEventListener('click', choiceFilterHandler);
    filterElement.addEventListener('keydown', choiceFilterHandler);
  };
})();
