var validations = {
  'is_email' : function(value,req,attribute){
    return true;
  },
  'required_email' : function(value,req,attribute){
    return true;
  },
  'required_code' : function(value,req,attribute){
    return true;
  },
  'urlencoded' : function(value,req,attribute){
    return true;
  },
  'exist' : function(value,req,attribute){
    input = value.replace("http://todo.app/useractivation/","")
    splitInput = input.split("/code/")

    if(splitInput.length != 2){
      return false
    }else{
      var dotenv = require('dotenv').config({'path':'../.env'});
      var Client = require('pg-native');
      var client = new Client();
      client.connectSync();

      var data = client.querySync("SELECT email FROM users WHERE email = '"+splitInput[0]+"'")
      client.end()
      if(data.length > 0){
        return true;
      }else{
        return false;
      }
    }
  },
  "match":function(value,req,attribute){
    input = value.replace("http://todo.app/useractivation/","")
    splitInput = input.split("/code/")
    if(splitInput.length != 2){
      return false
    }else{
      var dotenv = require('dotenv').config({'path':'../.env'});
      var Client = require('pg-native');
      var client = new Client();
      client.connectSync();

      var data = client.querySync("SELECT email FROM users WHERE email = '"+splitInput[0]+"' and activation_code = '"+decodeURIComponent(splitInput[1])+"'")
      client.end()
      if(data.length > 0){
        return true;
      }else{
        return false;
      }
    }
  },
  "not_active":function(value,req,attribute){
    input = value.replace("http://todo.app/useractivation/","")
    splitInput = input.split("/code/")

    if(splitInput.length != 2){
      return false
    }else{
      var dotenv = require('dotenv').config({'path':'../.env'});
      var Client = require('pg-native');
      var client = new Client();
      client.connectSync();

      var data = client.querySync("SELECT email FROM users WHERE email = '"+splitInput[0]+"' and active = '0'")
      client.end()
      if(data.length > 0){
        return true;
      }else{
        return false;
      }
    }
  }
}

module.exports = validations;
