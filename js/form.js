
// ***********************************************
// * РАБОТАЕТ С ФОРМОЙ РЕДАКТИРОВАНИЯ ИЗОБРАЖЕНИЯ
// ***********************************************

'use strict';

(function () {

  var uploadItem = document.querySelector('.upload');
  var uploadFileItem = uploadItem.querySelector('.upload-file');
  var uploadOverlayItem = uploadItem.querySelector('.upload-overlay');
  var uploadForm = uploadOverlayItem.querySelector('.upload-form');
  var uploadFormCancelItem = uploadForm.querySelector('.upload-form-cancel');
  var uploadSubmitItem = uploadForm.querySelector('.upload-form-submit');
  var uploadFormDescriptionItem = uploadForm.querySelector('.upload-form-description');
  var uploadFilter = uploadItem.querySelector('.upload-filter');

  var uploadResizeControlsItem = uploadForm.querySelector('.upload-resize-controls');
  var uploadResizeControlsValueItem = uploadResizeControlsItem.querySelector('.upload-resize-controls-value');

  var filterImagePreviewItem = uploadForm.querySelector('.filter-image-preview');
  var uploadFilterNoneId = document.getElementById('upload-filter-none');

  var uploadFilterLevelItem = document.querySelector('.upload-filter-level');
  var uploadFilterLevelPinItem = uploadFilterLevelItem.querySelector('.upload-filter-level-pin');
  var uploadFilterLevelValItem = uploadFilterLevelItem.querySelector('.upload-filter-level-val');
  var uploadFilterLevelLineItem = uploadFilterLevelItem.querySelector('.upload-filter-level-line');

  uploadFilterLevelItem.ondragstart = false;
  var lastFilter;
  var setepScaleValueForFramingPhoto = 25;

  doDefaultSettingsOfFilter();

  uploadFileItem.addEventListener('click', openFramingPopupHandler);
  uploadFileItem.addEventListener('keydown', openFramingPopupHandler);

  uploadFormCancelItem.addEventListener('click', closeFramingPopupHandler);
  uploadSubmitItem.addEventListener('click', closeFramingPopupHandler);
  uploadSubmitItem.addEventListener('keydown', closeFramingPopupHandler);

  window.initializeScale(uploadResizeControlsItem, setepScaleValueForFramingPhoto, window.utils.SCALE_VALUES.MAX, changeScale);
  window.initializeFilters(uploadFilter, applyFilter);

  initializeFilters();

  /**
   * Инициализирует изменение насыщенности примененного к фотографии фильтра.
   */
  function initializeFilters() {

    uploadFilterLevelPinItem.addEventListener('mousedown', function () {

      var lineCoords = getCoords(uploadFilterLevelLineItem);

      function moveMouseHandler(evt) {

        var leftPositionOfPin = evt.pageX - lineCoords.left;
        var currentPositionOfPin = uploadFilterLevelLineItem.offsetWidth - (uploadFilterLevelPinItem.offsetWidth / 2);
        var percentValue = (leftPositionOfPin / currentPositionOfPin) * 100;

        percentValue = (percentValue < 0) ? 0 : percentValue;
        percentValue = (percentValue > 100) ? 100 : percentValue;

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
   * Выбирает фильтр и степень насыщенности кадированной фотографии.
   *
   * @param {number} percentFilterValue
   */
  function applyCurrentFilterSelector(percentFilterValue) {
    switch (lastFilter) {
      case window.utils.filters.chrome: filterImagePreviewItem.style.filter = 'grayscale(' + percentFilterValue / 100 + ')';
        break;
      case window.utils.filters.sepia: filterImagePreviewItem.style.filter = 'sepia(' + percentFilterValue / 100 + ')';
        break;
      case window.utils.filters.marvin: filterImagePreviewItem.style.filter = 'invert(' + percentFilterValue + '%)';
        break;
      case window.utils.filters.phobos: filterImagePreviewItem.style.filter = 'blur(' + (percentFilterValue / 100) * 3 + 'px)';
        break;
      case window.utils.filters.heat: filterImagePreviewItem.style.filter = 'brightness(' + (percentFilterValue / 100) * 3 + ')';
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
   * Открывает окно кадрирования фотографии по клику мыши
   * или по нажатию на клавишу ENTER.
   *
   * @param {object} evt
   */
  function openFramingPopupHandler(evt) {
    if (evt.keyCode === window.utils.KEYS.ENTER || evt.type === 'click') {
      openFramingPopup(evt);
    }
  }

  /**
   * Закрывает окно кадрирования фотографии по клику мыши.
   *
   * @param {object} evt
   */
  function closeFramingPopupHandler(evt) {
    if (evt.keyCode !== window.utils.KEYS.ENTER && evt.type !== 'click') {
      return;
    }
    if (window.utils.isContainClass(evt.currentTarget, 'upload-form-cancel')) {
      evt.preventDefault();
      closeFramingPopup();
    }
    if (!uploadFormDescriptionItem.checkValidity()) {
      return;
    }
    evt.preventDefault();
    closeFramingPopup();
  }

    /**
   * Закрывает окно кадрирования фотографии по нажатию
   * клавиши ESC.
   *
   * @param {object} evt
   */
  function closeFramingPopupPressEscHandler(evt) {
    if (evt.keyCode === window.utils.KEYS.ESC) {
      if (!window.utils.isContainClass(evt.target, 'upload-form-description') && evt.target.tagName !== 'TEXTAREA') {
        closeFramingPopup();
      }
    }
  }

  /**
   * Открывает форму кадрирования фотографии.
   *
   * @param {object} currentEvent
   */
  function openFramingPopup(currentEvent) {
    if (typeof lastFilter === 'undefined' || lastFilter === window.utils.filters.none) {
      uploadFilterLevelItem.classList.add('invisible');
    }
    uploadOverlayItem.classList.remove('invisible');
    document.addEventListener('keydown', closeFramingPopupPressEscHandler);
    currentEvent.preventDefault();
  }

  /**
   * Закрывает форму кадрирования фотографии.
   */
  function closeFramingPopup() {
    doDefaultSettingsOfFilter();
    document.removeEventListener('keydown', closeFramingPopupPressEscHandler);
  }

  /**
   * Редактирует масштаб фотографии.
   *
   * @param {number} currentScale
   */
  function changeScale(currentScale) {
    filterImagePreviewItem.style.transform = 'scale(' + currentScale * 0.01 + ')';
  }

  /**
   * Применяет новый фильтр, при необходимости удаляя старый.
   *
   * @param {string} newFilter
   * @param {string} oldFilter
   */
  function applyFilter(newFilter, oldFilter) {

    lastFilter = newFilter;

    if (typeof oldFilter !== 'undefined') {
      filterImagePreviewItem.classList.remove(oldFilter);
    }
    filterImagePreviewItem.classList.add(newFilter);

    doDefaultSettingsOfFulterForScroll();
  }

  /**
   * Задает настройки формы кадрирования изображения по умолчанию.
   */
  function doDefaultSettingsOfFilter() {
    doDefaultSettingsOfFulterForScroll();

    uploadOverlayItem.classList.add('invisible');
    uploadFormDescriptionItem.value = '';
    uploadFilterNoneId.checked = true;

    if (typeof lastFilter !== 'undefined') {
      filterImagePreviewItem.classList.remove(lastFilter);
    }
    uploadFilterLevelItem.classList.add('invisible');
  }

  /**
   * Задает необходимые настройки формы кадрирования изображения по умолчанию,
   * если был использован скролл.
   */
  function doDefaultSettingsOfFulterForScroll() {
    filterImagePreviewItem.style.transform = 'scale(1.00)';
    uploadResizeControlsValueItem.value = window.utils.SCALE_VALUES.MAX + '%';
    uploadFilterLevelValItem.style.width = '100%';
    uploadFilterLevelPinItem.style.left = '100%';
    filterImagePreviewItem.style.filter = '';

    window.initializeScale(uploadResizeControlsItem, setepScaleValueForFramingPhoto, window.utils.SCALE_VALUES.MAX, changeScale);

    if (lastFilter === window.utils.filters.none) {
      uploadFilterLevelItem.classList.add('invisible');
    } else {
      uploadFilterLevelItem.classList.remove('invisible');
    }
  }
})();
