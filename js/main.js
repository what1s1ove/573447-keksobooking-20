'use strict';

window.main = (function () {
  var activeApp = function () {
    window.map.active();
    window.form.active();
    window.pin.active();
  };

  var initApp = function () {
    window.map.init();
    window.form.init();
    window.pin.init();
  };

  initApp();

  return {
    activeApp: activeApp,

  };
})();
