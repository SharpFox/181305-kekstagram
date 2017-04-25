// form.js

// ***********************************************
// * РАБОТАЕТ С ФОРМОЙ РЕДАКТИРОВАНИЯ ИЗОБРАЖЕНИЯ
// ***********************************************

'use strict';

window.pictures = (function () {

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

  var stepValueOfFrameScale = 25;
  var minValueOfFrameScale = 25;
  var maxValueOfFrameScale = 100;
  var currentValueOfFrameScale = 100;

  var descriptionMinLength = 30;
  var descriptionMaxLength = 100;

  var uploadItem = document.querySelector('.upload');
  var uploadFileItem = uploadItem.querySelector('.upload-file');
  var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
  var uploadForm = uploadOverlayItem.querySelector('.upload-form');
  var uploadFormCancelItem = uploadForm.querySelector('.upload-form-cancel');
  var uploadSubmitItem = uploadForm.querySelector('.upload-form-submit');
  var uploadFormDescriptionItem = uploadForm.querySelector('.upload-form-description');
  var uploadResizeControlsValueItem = uploadForm.querySelector('.upload-resize-controls-value');
  var filterImagePreviewItem = uploadForm.querySelector('.filter-image-preview');
  var uploadFilterControlsItem = uploadItem.querySelector('.upload-filter-controls');
  var uploadFilterNoneId = document.getElementById('upload-filter-none');
  var uploadFilterForm = uploadItem.querySelector('.upload-filter');
  var uploadResizeControlsBbuttonDecItem = uploadForm.querySelector('.upload-resize-controls-button-dec');
  var uploadResizeControlsBbuttonIncItem = uploadForm.querySelector('.upload-resize-controls-button-inc');

  var uploadFilterLevelItem = document.querySelector('.upload-filter-level');
  var uploadFilterLevelPinItem = uploadFilterLevelItem.querySelector('.upload-filter-level-pin');
  var uploadFilterLevelValItem = uploadFilterLevelItem.querySelector('.upload-filter-level-val');
  var uploadFilterLevelLineItem = uploadFilterLevelItem.querySelector('.upload-filter-level-line');

  uploadFilterLevelItem.ondragstart = false;

  uploadResizeControlsValueItem.value = maxValueOfFrameScale + '%';
  var classOflastSelectedFilter;
  var lastSelectedFilter;

  doDefaultSettingOfFilter();

  uploadFileItem.addEventListener('click', openFramingPopupHandler);
  uploadFileItem.addEventListener('keydown', openFramingPopupHandler);

  uploadFormCancelItem.addEventListener('click', closeFramingPopupHandler);
  uploadSubmitItem.addEventListener('click', closeFramingPopupHandler);
  uploadSubmitItem.addEventListener('keydown', closeFramingPopupHandler);

  uploadFilterForm.addEventListener('click', choiceFilterHandler);
  uploadFilterForm.addEventListener('keydown', choiceFilterHandler);

  uploadResizeControlsBbuttonDecItem.addEventListener('click', downScaleHandler);
  uploadResizeControlsBbuttonDecItem.addEventListener('keydown', downScaleHandler);

  uploadResizeControlsBbuttonIncItem.addEventListener('click', upScaleHandler);
  uploadResizeControlsBbuttonIncItem.addEventListener('keydown', upScaleHandler);

  initializeFilters();

  /**
   * Инициализирует работу фильтра.
   */
  function initializeFilters() {

    uploadFilterLevelPinItem.addEventListener('mousedown', function () {

      var lineCoords = getCoords(uploadFilterLevelLineItem);

      function moveMouseHandler(evt) {

        var leftPositionOfPin = evt.pageX - lineCoords.left;
        var currentPositionOfPin = uploadFilterLevelLineItem.offsetWidth - (uploadFilterLevelPinItem.offsetWidth / 2);
        var percentValue = (leftPositionOfPin / currentPositionOfPin) * 100;

        if (percentValue < 0) {
          percentValue = 0;
        } else if (percentValue > 100) {
          percentValue = 100;
        }

        uploadFilterLevelPinItem.style.left = percentValue + '%';
        uploadFilterLevelValItem.style.width = percentValue + '%';

        applyCurrentFilterSelector(percentValue);
      }

      function upMouseHandler() {
        document.removeEventListener('mousemove', moveMouseHandler);
        document.removeEventListener('mouseup', upMouseHandler);
      }

      document.addEventListener('mousemove', moveMouseHandler);
      document.addEventListener('mouseup', upMouseHandler);

      return false;
    });
  }

  /**
   * Выбирает фильтр и степень насыщенности кадированного изображения.
   *
   * @param {number} percentFilterValue
   */
  function applyCurrentFilterSelector(percentFilterValue) {
    if (classOflastSelectedFilter === filters.chrome) {
      filterImagePreviewItem.style.filter = 'grayscale(' + percentFilterValue / 100 + ')';
    } else if (classOflastSelectedFilter === filters.sepia) {
      filterImagePreviewItem.style.filter = 'sepia(' + percentFilterValue / 100 + ')';
    } else if (classOflastSelectedFilter === filters.marvin) {
      filterImagePreviewItem.style.filter = 'invert(' + percentFilterValue + '%)';
    } else if (classOflastSelectedFilter === filters.phobos) {
      filterImagePreviewItem.style.filter = 'blur(' + (percentFilterValue / 100) * 3 + 'px)';
    } else if (classOflastSelectedFilter === filters.heat) {
      filterImagePreviewItem.style.filter = 'brightness(' + (percentFilterValue / 100) * 3 + ')';
    }
  }

  /**
   * Возвращает координаты.
   *
   * @param {object} elem
   * @return {object}
   */
  function getCoords(elem) {
    var coords = elem.getBoundingClientRect();

    return {
      top: coords.top + window.pageYOffset,
      left: coords.left + window.pageXOffset
    };
  }

  /**
   * Открывает всплывающее окно кадрирования изображения по клику мыши
   * или по нажатию на клавишу ENTER.
   *
   * @param {object} evt
   */
  function openFramingPopupHandler(evt) {
    if (evt.keyCode === KEYS.ENTER) {
      openFramingPopup(evt);
      return;
    }
    if (evt.type === 'click') {
      openFramingPopup(evt);
    }
  }

  /**
   * Закрывает всплывающее окно кадрирования изображения по клику мыши.
   *
   * @param {object} evt
   */
  function closeFramingPopupHandler(evt) {
    if (evt.keyCode === KEYS.ENTER) {
      if (uploadFormDescriptionItem.validity.valueMissing || checkFormDescriptionOnValidTextLength()) {
        return;
      }
      closeFramingPopup();
      return;
    }
    if (evt.currentTarget.className === 'upload-form-cancel') {
      evt.preventDefault();
      closeFramingPopup();
      return;
    }
    if (uploadFormDescriptionItem.validity.valueMissing || !checkFormDescriptionOnValidTextLength()) {
      return;
    }
    if (evt.type === 'click') {
      closeFramingPopup();
    }
  }

    /**
   * Закрывает всплывающее окно кадрирования изображения по нажатию
   * клавиши ESC.
   *
   * @param {object} evt
   */
  function closeFramingPopupPressEscHandler(evt) {
    if (evt.keyCode === KEYS.ESC) {
      if (evt.target.className === 'upload-form-description' && evt.target.tagName === 'TEXTAREA') {
        return;
      }
      closeFramingPopup();
    }
  }

  /**
   * Выставляет новый фильтр по клику мыши.
   *
   * @param {object} evt
   */
  function choiceFilterHandler(evt) {
    if (evt.keyCode === KEYS.ENTER) {
      doNewFilter(evt);
      return;
    }
    if (evt.type === 'click') {
      doNewFilter(evt);
    }
  }

  /**
   * Передаёт управление по нажатию клавиши ENTER или
   * клику методу по уменьшению масштаба загружаемого изображения.
   *
   * @param {object} evt
   */
  function downScaleHandler(evt) {
    if (evt.keyCode === KEYS.ENTER) {
      downScale(evt);
    }
    if (evt.type === 'click') {
      downScale(evt);
    }
  }

  /**
   * Передаёт управление по нажатию на клавишу ENTER или
   * по клику методу по увеличению масштаба
   * загружаемого изображения.
   *
   * @param {object} evt
   */
  function upScaleHandler(evt) {
    if (evt.keyCode === KEYS.ENTER) {
      upScale(evt);
    }
    if (evt.type === 'click') {
      upScale(evt);
    }
  }

  /**
   * Открывает видимость элемента '.upload-overlay'
   *
   * @param {object} evt
   */
  function openFramingPopup(evt) {
    if (typeof classOflastSelectedFilter === 'undefined' || classOflastSelectedFilter === filters.none) {
      uploadFilterLevelItem.classList.add('invisible');
    }
    uploadOverlayItem.classList.remove('invisible');
    document.addEventListener('keydown', closeFramingPopupPressEscHandler);
    evt.preventDefault();
  }

  /**
   * Закрывает видимость элемента '.upload-overlay'
   */
  function closeFramingPopup() {

    uploadResizeControlsValueItem.value = maxValueOfFrameScale + '%';

    if (typeof classOflastSelectedFilter !== 'undefined') {
      filterImagePreviewItem.classList.remove(classOflastSelectedFilter);
    }

    uploadFilterLevelItem.classList.add('invisible');

    filterImagePreviewItem.style.transform = 'scale(1.00)';
    if (typeof lastSelectedFilter !== 'undefined') {
      lastSelectedFilter.checked = false;
    }
    uploadFilterNoneId.checked = true;
    uploadOverlayItem.classList.add('invisible');
    uploadFormDescriptionItem.value = '';

    doDefaultSettingOfFilter();

    document.removeEventListener('keydown', closeFramingPopupPressEscHandler);
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
   * Выставляет новый фильтр, при необходимости удаляя старый.
   *
   * @param {object} evt
   */
  function doNewFilter(evt) {

    if (evt.target.className !== 'upload-filter-preview' && evt.target.tagName !== 'LABEL') {
      return;
    }

    doDefaultSettingOfFilter();

    if (typeof classOflastSelectedFilter !== 'undefined') {
      filterImagePreviewItem.classList.remove(classOflastSelectedFilter);
    }

    var target = evt.target;
    var siblingTarget;

    while (target !== uploadFilterControlsItem) {
      siblingTarget = target.previousElementSibling;
      if (siblingTarget !== null && siblingTarget.tagName === 'INPUT') {
        siblingTarget.checked = true;
        lastSelectedFilter = siblingTarget;
        classOflastSelectedFilter = filters[siblingTarget.value];
        filterImagePreviewItem.classList.add(classOflastSelectedFilter);
      }
      target = target.parentElement;
    }

    if (classOflastSelectedFilter === filters.none) {
      uploadFilterLevelItem.classList.add('invisible');
      return;
    }
    uploadFilterLevelItem.classList.remove('invisible');
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
   * Делает настройки фильтра по умолчанию.
   */
  function doDefaultSettingOfFilter() {
    uploadFilterLevelValItem.style.width = '100%';
    uploadFilterLevelPinItem.style.left = '100%';
    filterImagePreviewItem.style.filter = '';
  }


})();
