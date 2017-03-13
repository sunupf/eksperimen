var exist = function(param){

  var callback = function(param,value){
    var parameters = param.ruleParam.split(",")
    if(parameters.length!=2){
      throw new Error("wrong format parameters")
    }

    var table = parameters[0]
    var column = parameters[1]

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var email = false;
    var code = false;

    var indexNotRequiredEmail = _.findIndex(param.validations, function(validation) { return validation == "^required_email"; });
    var indexNotRequiredCode = _.findIndex(param.validations, function(validation) { return validation == "^required_code"; });
    var indexNotEmail = _.findIndex(param.validations, function(validation) { return validation == "^email"; });

    var indexEncoded = _.findIndex(param.validations, function(validation) { return validation == "urlencoded"; });
    var indexNotMatch = _.findIndex(param.validations, function(validation) { return validation == "^match"; });
    var indexActive = _.findIndex(param.validations, function(validation) { return validation == "^not_active"; });

    var client = new Client();
    client.connectSync();

    value = value.replace(/[()'"]/g,"");

    var data = client.querySync("SELECT "+column+" FROM "+table+" WHERE email = '"+value+"' and active = '0'")
    var allUser = client.querySync("SELECT "+column+",activation_code FROM "+table+" WHERE active= '0'")
    var activeUser = client.querySync("SELECT "+column+",activation_code FROM "+table+" WHERE active= '1'")
    client.end()

    if(param.negation === false){
      // kalau sudah ada seharusnya index > 0 jadi kalau dari 0 karena butuh yang sudah ada ambilkan saja secara random
      if(data.length < 1){
        var i = Math.floor(Math.random() * (data.length) );
        email = allUser[i][column]
        code = allUser[i]['activation_code']
      }else{
        email = data[0][column]
        code = data[0]['activation_code']
      }
    }else{
      // butuh yang tidak exist
      if(data.length < 1 || !data){
        email = value;
        var i = Math.floor(Math.random() * (allUser.length) );
        code = allUser[i]['activation_code']
      }else{
        return false;
      }
    }

    if(indexActive>=0){
      var i = Math.floor(Math.random() * (activeUser.length) );
      email = activeUser[i][column]
      code = activeUser[i]['activation_code']
    }

    if(indexNotMatch>=0){
      code = code.replace(/[0-9a-z]/g,"a");
    }

    if(indexEncoded>=0){
      code = encodeURIComponent(code)
    }

    if(indexNotEmail >=0 ){
      email = value;
    }

    if(indexNotRequiredEmail>=0){
      email = ""
    }
    if(indexNotRequiredCode>=0){
      code = ""
    }

    return "http://todo.app/useractivation/"+email+"/code/"+code
  }

  return callback;
}

module.exports = exist;
