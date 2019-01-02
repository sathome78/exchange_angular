function sendRegistrationGtag() {
  gtag('event', 'sent-form', {'event_category': 'registration-form', 'event_label': 'successe-form-sent'});
}

function sendConfirmationPasswordGtag() {
  gtag('event', 'password-correct', {'event_category': 'password-confirm', 'event_label': 'finish-registration'});
}

function sendLoginSuccessGtag() {
  gtag('event', 'login-success', {'event_category': 'login-form', 'event_label': 'login-success'});
}

function sendRecoveryPasswordGtag() {
  gtag('event', 'pass-recovered', {'event_category': 'recovered-pass', 'event_label': 'recovered-success'});
}

function sendGenerateWalletGtag(id) {
  gtag('event', 'recharge-ballance', {'event_category': 'recharge-ballance', 'event_label': id});
}


(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src =
    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-TZTXSSP');

window.dataLayer = window.dataLayer || [];

gtag('js', new Date());

gtag('config', 'GTM-TZTXSSP');

function gtag() {
  dataLayer.push(arguments);
}
