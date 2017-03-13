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
    var data = client.querySync("SELECT todo_id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    // var indexValidTodoId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
    var i = Math.floor(Math.random() * (data.length) );
    todoId = parseInt(data[i].todo_id)

    console.log(todoId);

    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs_parent_id"; });
    if(indexNotBelongs >= 0){
      var notBelongs = client.querySync("SELECT id FROM todos where user_id not in (SELECT id from users where email='"+user+"')")
      var j = Math.floor(Math.random() * (notBelongs.length) );
      todoId = parseInt(notBelongs[j].id)
    }

    var indexNotNumeric = _.findIndex(param.validations, function(validation) { return validation == "^numeric_parent_id"; });
    if(indexNotNumeric>=0){
      var character = ['a','b','c','d','e']
      var k = Math.floor(Math.random() * (character.length) );
      todoId = character[k]
    }

    var indexNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^required_parent_id"; });
    if(indexNotBelongs >= 0){
      todoId = ""
    }

    var dataActivities = {}
    var id = 0;
    var indexActNotBelongsToParentId = _.findIndex(param.validations, function(validation) { return validation == "^belongs_id_to_parent_id"; });
    var indexActNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs_id"; });

    if(typeof todoId === "number"){
      dataActivities = client.querySync("SELECT id from activities where todo_id = "+todoId)
      if(dataActivities.length > 0){
        var l = Math.floor(Math.random() * (dataActivities.length) );
        id = parseInt(dataActivities[l].id);
      }

      if(indexActNotBelongsToParentId >= 0){
        var notBelongsToParentId = client.querySync("SELECT id FROM activities where todo_id != "+todoId)
        if(notBelongsToParentId.length > 0){
          var m = Math.floor(Math.random() * (notBelongsToParentId.length) );
          id = parseInt(notBelongsToParentId[m].id)
        }
      }

      if(indexActNotBelongs >= 0){
        var notBelongsId = client.querySync("SELECT id FROM activities where todo_id not in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
        if(notBelongsId.length > 0){
          var n = Math.floor(Math.random() * (notBelongsId.length) );
          id = parseInt(notBelongsId[n].id)
        }
      }
    }

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

    client.end();
    return "id="+id+"/todo="+todoId;
  }

  return callback;
}

module.exports = valid;
