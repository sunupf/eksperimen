var belongs = function(param){

  var callback = function(param,value){
    var parameters = param.ruleParam.split(",")
    if(parameters.length!=1
    ){
      throw new Error("wrong format parameters")
    }

    var user = parameters[0]

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var id = ""

    var client = new Client();
    client.connectSync();
     
    //text queries 
    //query masih fail
    var data = client.querySync("SELECT id from todos where user_id in (SELECT id FROM users where email='"+user+"')")
    var allTodoNotBelongs = client.querySync("SELECT id from todos where user_id not in (SELECT id FROM users where email='"+user+"')");

    if(data.length){
      var indexValidId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
    }

    if(!param.negation){
      console.log(indexValidId);
      if(indexValidId<0){
        var i = Math.floor(Math.random() * (data.length) );
        return data[i].id
      }else{
        return true;
      }
    }else{
      if(indexValidId>=0){
        var i = Math.floor(Math.random() * (allTodoNotBelongs.length) );
        return allTodoNotBelongs[i].id
      }else{
        return true;
      }
    }
  }

  return callback;
}

module.exports = belongs;
