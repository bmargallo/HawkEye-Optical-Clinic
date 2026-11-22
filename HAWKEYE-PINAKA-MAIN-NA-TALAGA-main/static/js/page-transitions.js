(function () {
  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navigating = false;

  function sameOrigin(url) {
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin === window.location.origin;
  }

  if (!reducedMotion) {
    if (root.classList.contains('page-transition-enter')) {
      window.setTimeout(function () { root.classList.remove('page-transition-enter'); }, 320);
    }

    var arrivalCover = document.querySelector('.login-arrival-cover');
    if (root.classList.contains('login-arrival') && arrivalCover) {
      arrivalCover.addEventListener('animationend', function () {
        root.classList.remove('login-arrival');
      }, { once: true });
    }

    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.hasAttribute('download') || link.target && link.target !== '_self') return;
      if (link.matches('[data-login-transition], [data-staff-login-transition], [data-hawk-signup-transition], [data-no-page-transition]')) return;

      var destination;
      try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
      if (!sameOrigin(destination)) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      event.preventDefault();
      if (navigating) return;
      navigating = true;
      try { sessionStorage.setItem('hk-page-transition', 'enter'); } catch (_) {}
      root.classList.add('page-transition-leave');
      window.setTimeout(function () { window.location.assign(destination.href); }, 170);
    }, true);

    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || form.tagName !== 'FORM' || event.defaultPrevented) return;
      if (form.hasAttribute('data-no-page-transition') || form.hasAttribute('data-confirm') || form.target && form.target !== '_self') return;
      if ((form.method || 'get').toLowerCase() !== 'post') return;
      var action;
      try { action = new URL(form.action || window.location.href, window.location.href); } catch (_) { return; }
      if (!sameOrigin(action)) return;
      try { sessionStorage.setItem('hk-page-transition', 'enter'); } catch (_) {}
    });
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      root.classList.remove('page-transition-leave', 'page-transition-enter');
      try { sessionStorage.removeItem('hk-page-transition'); } catch (_) {}
      navigating = false;
    }
  });
})();
