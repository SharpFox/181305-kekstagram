
// ***********************************************
// * ИЗМЕНЯЕТ МАСШТАБ ИЗОБРАЖЕНИЯ
// ***********************************************

'use strict';

window.initializeScale = (function () {

  var elementOfScaleCurrentValue;
  var scaleElement;
  var scaleStep;
  var initialScaleValue;
  var scaleFunction;

  var scaleClassNames = {
    'dec': 'upload-resize-controls-button-dec',
    'inc': 'upload-resize-controls-button-inc',
    'value': 'upload-resize-controls-value'
  };

  var operationTypes = {
    'inc': 'inc',
    'dec': 'dec'
  };

 /**
  * Активируется по нажатию клавиши Enter или клику мыши.
  * После определения типа события (уменьшения/увеличения масштаба)
  * запускает метод по изменению масштаба.
  *
  * @param {object} evt
  */
  function scaleHandler(evt) {
    if (evt.keyCode !== window.utils.KEYS.ENTER && evt.type !== 'click') {
      return;
    }

    var operationType = getCurrentOperationType(evt.target);

    if (operationType !== null) {
      setScale(operationType);
    }
  }

  /**
   * Возвращает тип операции масштаба.
   * Если тип не найден, то возвращает null.
   *
   * @param {object} element
   * @return {object}
   */
  function getCurrentOperationType(element) {
    if (window.utils.isContainClass(element, scaleClassNames.dec) ? operationTypes.dec : false) {
      return operationTypes.dec;
    }
    if (window.utils.isContainClass(element, scaleClassNames.inc) ? operationTypes.inc : false) {
      return operationTypes.inc;
    }
    return null;
  }

  /**
   * Выполняет ряд операций по изменению масштаба согласно
   * типу операции (уменьшение/увеличение).
   *
   * @param {function} operationType
   */
  function setScale(operationType) {

    initialScaleValue = getNewScaleValue(operationType);

    scaleFunction(initialScaleValue);
    setupCurrentScaleValue(initialScaleValue);
  }

  /**
   * Возвращает новое значение масштаба согласно
   * переданного типа операции.
   *
   * @param {string} operationType
   * @return {number}
   */
  function getNewScaleValue(operationType) {
    switch (operationType) {
      case operationTypes.dec:
        return Math.max(initialScaleValue - scaleStep, window.utils.SCALE_VALUES.MIN);
      case operationTypes.inc:
        return Math.min(initialScaleValue + scaleStep, window.utils.SCALE_VALUES.MAX);
    }
    return window.utils.SCALE_VALUES.MAX;
  }

  /**
   * Заполняет элемент текущим значением масштаба.
   *
   * @param {number} currentScaleValue
   */
  function setupCurrentScaleValue(currentScaleValue) {
    var element = getElementOfScaleCurrentValue(scaleClassNames.value);
    element.value = currentScaleValue + '%';
  }

  /**
   * Возвращает элемент, в котором хранится значение текущего масштаба.
   *
   * @param {string} className
   * @return {object}
   */
  function getElementOfScaleCurrentValue(className) {
    if (typeof elementOfScaleCurrentValue === 'undefined') {
      elementOfScaleCurrentValue = scaleElement.querySelector('.' + className);
    }
    return elementOfScaleCurrentValue;
  }

  return function (element, step, scale, callback) {

    scaleElement = element;
    scaleStep = step;
    initialScaleValue = scale;
    scaleFunction = callback;

    if (typeof scaleFunction !== 'function') {
      return;
    }

    scaleElement.addEventListener('click', scaleHandler);
    scaleElement.addEventListener('onkeydown', scaleHandler);

    setupCurrentScaleValue(initialScaleValue);
  };
})();
