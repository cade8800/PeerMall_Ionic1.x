(function () {

  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (isiOS) {
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
  }

})();

