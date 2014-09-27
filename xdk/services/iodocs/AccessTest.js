(function (credentials, helpers) {
  var exports = {};
  
  /* Data Feed Function */
  exports.geddit = function (params) {
    var webAppId = "AKfycbzcyIFwXpZPi5KPgah2m5_qlhBDm6aBx3SyzBeAfy9UpiJTCiY";
    var url = "https://script.google.com/macros/s/" + webAppId + "/exec";
    return $.ajax({url: url});
  };
     
  return exports;
})
