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

    var client = new Client();
    client.connectSync();


    var indexNotEmail = _.findIndex(param.validations, function(validation) { return validation == "^email"; });

    if(indexNotEmail > -1){
      return true;
    }

    value = value.replace(/[()'"]/g,"");

    var data = client.querySync("SELECT "+column+" FROM "+table+" WHERE email = '"+value+"'")
    var allUser = client.querySync("SELECT "+column+" FROM "+table)
    client.end()

    if(param.negation === false){
      // kalau sudah ada seharusnya index > 0 jadi kalau dari 0 karena butuh yang sudah ada ambilkan saja secara random
      if(data.length < 1){
        var i = Math.floor(Math.random() * (data.length) );
        return allUser[i][column]
      }else{
        return true;
      }
    }else{
      // butuh yang tidak exist
      if(data.length < 1){
        return true;
      }else{
        // ketemu yang sudah ada, ya sudah berarti return false saja
        return false;
      }
    }
  }

  return callback;
}

module.exports = exist;
