// Use this when you want test using JS
// Update your config to change language you used

var customTest = function(testSuite){
  var data = testSuite.data;
  var coba = testSuite.coba;
  var driver = coba.driver;

  coba.fillInputForm(data.testCases, driver);

}

module.exports = customTest
