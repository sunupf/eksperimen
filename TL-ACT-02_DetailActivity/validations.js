var validations = {
  'required_id' : function(input,req,attribute){
    return true;
  },
  'numeric_id' : function(input,req,attribute){
    return true;
  },
  'belongs' : function(input,req,attribute){
    return true;
  },
  'valid' : function(input,req,attribute){
    var user = req

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var url = input.replace("http://todo.app/activity/","")
    var params = url.split("/")
    var id = params[0]

    var client = new Client();
    client.connectSync();

    var data = client.querySync("SELECT id from activities where id="+id+" AND todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    client.end();

    if(data.length>0){
      return true
    }
    return false
  }
}

module.exports = validations;
