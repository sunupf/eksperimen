var active = function(param){

  var callback = function(param,value){

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var client = new Client();
    client.connectSync();

    value = value.replace(/[()'"]/g,"");

    var indexNotExist = _.findIndex(param.validations, function(validation) { return validation == "^exist:users,email"; });

    if(indexNotExist > -1){
      return true;
    }

    var indexNotEmail = _.findIndex(param.validations, function(validation) { return validation == "^email"; });

    if(indexNotEmail > -1){
      return true;
    }

    // var indexNotExist = _.findIndex(param.validations, function(validation) { return validation == "exist:users,email"; });
    var allActiveUsers = client.querySync("SELECT email FROM users where active = '1'");
    var allNotActiveUsers = client.querySync("SELECT email FROM users where active = '0'");
    var data = client.querySync("SELECT email,active FROM users WHERE email = '"+value+"'");


    client.end()
    if(data.length>0){
      var first = data[0];

      if(first.active === "1" && param.negation === false){
        return true;
      }else if(first.active === "1" && param.negation === true){
        var i = Math.floor(Math.random() * (allNotActiveUsers.length) );
        return allNotActiveUsers[i]['email']
      }else if(first.active === "0" && param.negation === false){
        var i = Math.floor(Math.random() * (allActiveUsers.length) );
        return allActiveUsers[i]['email']
      }else if(first.active === "0" && param.negation === true){
        return true;
      }
    }else{
      if(param.negation === true){
        var i = Math.floor(Math.random() * (allNotActiveUsers.length) );
        return allNotActiveUsers[i]['email']
      }else if(param.negation === false){
        var i = Math.floor(Math.random() * (allActiveUsers.length) );
        return allActiveUsers[i]['email']
      }
    }

  }

  return callback;
}

module.exports = active;
