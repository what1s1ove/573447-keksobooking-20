'use strict';

(function () {
  var toggleAppStatus = function (isActive) {
    window.map.toggleStatus(isActive);
    window.form.toggleStatus(isActive);
    window.pin.toggleStatus(isActive);
  };

  var initApp = function () {
    window.map.init();
    window.form.init();
    window.pin.init();
  };

  initApp();

  window.main = {
    toggleAppStatus: toggleAppStatus
  };
})();
