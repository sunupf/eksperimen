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

    value = value.replace(/[/\?]/g,"a")

    var client = new Client();
    client.connectSync();
     
    //text queries 
    //query masih fail
    var data = client.querySync("SELECT todo_id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")

    var indexValidId = _.findIndex(data, function(datum) { return datum.todo_id == value; });

    if(!param.negation){
      console.log(indexValidId);
      if(indexValidId<0){
        var i = Math.floor(Math.random() * (data.length) );
        id = data[i].todo_id
      }else{
        id = value;
      }
      var indexHasnt = _.findIndex(param.validations, function(validation) { return validation == "^has_activity"; });
      if(indexHasnt >= 0){
        var hasnt = client.querySync("SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"')")
        var j = Math.floor(Math.random() * (hasnt.length) );
        id = parseInt(hasnt[j].id)
      }
    }else{
      if(indexValidId>=0){
        id = parseInt(value) * 99999;
      }else{
        id = value;
      }
    }


    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs"; });
    if(indexNotBelongs >= 0){
      var notBelongs = client.querySync("SELECT id FROM todos where user_id not in (SELECT id from users where email='"+user+"')")
      var j = Math.floor(Math.random() * (notBelongs.length) );
      id = parseInt(notBelongs[j].id)
    }

    var indexNotNumeric = _.findIndex(param.validations, function(validation) { return validation == "^numeric_id"; });
    if(indexNotNumeric>=0){
      var character = ['a','b','c','d','e']
      var k = Math.floor(Math.random() * (character.length) );
      id = character[k]
    }

    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^required_id"; });
    if(indexNotBelongs >= 0){
      id = ""
    }

    return "http://todo.app/todo/"+id+"/detail";
  }

  return callback;
}

module.exports = valid;
