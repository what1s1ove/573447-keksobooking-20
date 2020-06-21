'use strict';

window.main = (function () {
  var toggleAppStatus = function (isActive) {
    window.map.toggleStatus(isActive);
    window.form.toggleStatus(isActive);
    window.pin.toggleStatus(isActive);
    window.card.toggleStatus(isActive);
  };

  var initApp = function () {
    window.map.init();
    window.form.init();
    window.pin.init();
  };

  initApp();

  return {
    toggleAppStatus: toggleAppStatus

  };
})();
