(function () {
  var password = document.getElementById('password');
  var component = document.querySelector('[data-password-strength]');
  if (!password || !component) return;

  var meter = component.querySelector('[data-strength-meter]');
  var bar = component.querySelector('[data-strength-bar]');
  var label = component.querySelector('[data-strength-label]');
  var rules = Array.prototype.slice.call(component.querySelectorAll('[data-rule]'));
  var levels = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong'];
  var checks = {
    length: function (value) { return value.length >= 8; },
    upper: function (value) { return /[A-Z]/.test(value); },
    lower: function (value) { return /[a-z]/.test(value); },
    number: function (value) { return /[0-9]/.test(value); },
    symbol: function (value) { return /[^A-Za-z0-9]/.test(value); }
  };
  var strength = [
    { name: 'Weak', width: 25 },
    { name: 'Fair', width: 48 },
    { name: 'Good', width: 74 },
    { name: 'Strong', width: 100 }
  ];

  function update() {
    var value = password.value;
    var score = 0;

    rules.forEach(function (item) {
      var ruleName = item.getAttribute('data-rule');
      var met = checks[ruleName] ? checks[ruleName](value) : false;
      var state = item.querySelector('[data-rule-state]');
      item.classList.toggle('is-met', met);
      if (state) state.textContent = met ? 'met' : 'not met';
      if (met) score += 1;
    });

    if (!value.length) {
      meter.hidden = true;
      component.classList.remove.apply(component.classList, levels);
      bar.setAttribute('aria-valuenow', '0');
      bar.setAttribute('aria-valuetext', 'No strength indicator');
      label.textContent = '';
      return;
    }

    var index = score <= 1 ? 0 : score === 2 ? 1 : score === 3 ? 2 : 3;
    // Do not present a password as good/strong while it misses the server's 8-char minimum.
    if (!checks.length(value) && index > 1) index = 1;
    var current = strength[index];
    meter.hidden = false;
    component.classList.remove.apply(component.classList, levels);
    component.classList.add(levels[index]);
    label.textContent = current.name;
    bar.setAttribute('aria-valuenow', String(current.width));
    bar.setAttribute('aria-valuetext', current.name);
  }

  password.addEventListener('input', update);
  update();
})();
