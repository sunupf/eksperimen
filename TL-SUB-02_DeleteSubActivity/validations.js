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

    var url = input.replace("http://todo.app/subactivity/","")
    var params = url.split("#")
    var id = params[0]
    console.log(id)

    var client = new Client();
    client.connectSync();

    try {
      // var data = client.querySync("SELECT id from activities where id="+id+" AND todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
      var data = client.querySync("SELECT id from activities where id="+id+" AND parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email = '"+user+"' )))");    
    } catch (e) {
      return false
    }
    client.end();

    if(data.length>0){
      return true
    }
    return false
  }
}

module.exports = validations;
