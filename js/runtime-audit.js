(function () {
  var DEBUG_KEY = 'debug';

  function isDebugEnabled() {
    try {
      return localStorage.getItem(DEBUG_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  function auditLog(eventName, payload) {
    if (!isDebugEnabled()) {
      return;
    }

    var timestamp = new Date().toISOString();
    if (typeof payload === 'undefined') {
      console.info('[portfolio][' + timestamp + '] ' + eventName);
      return;
    }

    console.info('[portfolio][' + timestamp + '] ' + eventName, payload);
  }

  window.addEventListener('error', function (event) {
    auditLog('runtime:error', {
      message: event.message,
      file: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  window.addEventListener('unhandledrejection', function (event) {
    auditLog('runtime:unhandledrejection', {
      reason: event.reason
    });
  });

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('.modal-trigger');
    if (trigger) {
      auditLog('modal:open', { target: trigger.dataset.target || null });
      return;
    }

    var closeControl = event.target.closest('.modal-card-head .delete, .modal-card-foot .button');
    if (closeControl) {
      auditLog('modal:close-all');
    }
  });
})();
