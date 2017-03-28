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
     
    var data = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email = '"+user+"' )))");    
    var i = Math.floor(Math.random() * (data.length) );
    id = parseInt(data[i].id)
    parent =  parseInt(data[i].parent_id)
    todo =  parseInt(data[i].todo_id)

    console.log(data[i])

    if(param.negation){
      id ="0"
    }
    

    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs"; });
    if(indexNotBelongs >= 0){
      var notBelongs = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email != '"+user+"' )))");    
      var j = Math.floor(Math.random() * (notBelongs.length));
      id = parseInt(notBelongs[j].id)
      parent =  parseInt(notBelongs[i].parent_id)
      todo =  parseInt(notBelongs[i].todo_id)
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

    // console.log("target = "+"http://todo.app/activity/"+id+"#"+parent+"/"+todo)    
    return "http://todo.app/subactivity/"+id+"#"+parent+"/"+todo
  }

  return callback;
}

module.exports = valid;
