var valid = function(param){

  var callback = function(param,value){
    var parameters = param.ruleParam.split(",")
    if(parameters.length!=1){
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
    var data = client.querySync("SELECT id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    // var indexValidTodoId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
    var i = Math.floor(Math.random() * (data.length) );
    id = parseInt(data[i].id)

    if(param.negation){
      id="0"
    }

    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs"; });
    if(indexNotBelongs >= 0){
      var notBelongs = client.querySync("SELECT id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email!='"+user+"'))")
      var j = Math.floor(Math.random() * (notBelongs.length) );
      id = parseInt(notBelongs[j].id)
    }

    client.end();

    var indexActNotNumeric = _.findIndex(param.validations, function(validation) { return validation == "^numeric_id"; });
    if(indexActNotNumeric>=0){
      var character = ['a','b','c','d','e']
      var o = Math.floor(Math.random() * (character.length) );
      id = character[o]
    }

    var indexActNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^required_id"; });
    if(indexActNotBelongs >= 0){
      id = ""
    }

    return "http://todo.app/activity/"+id
  }

  return callback;
}

module.exports = valid;
