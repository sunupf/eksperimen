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

    // var data = client.querySync("SELECT id,todo_id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    var data = client.querySync("SELECT id,todo_id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"')) AND id in (SELECT parent_id FROM activities)")
    var allActNotBelongs = client.querySync("SELECT id from activities where todo_id in (SELECT id FROM todos where user_id not in (SELECT id from users where email='"+user+"')) AND id in (SELECT parent_id FROM activities)")

    client.end()    

    if(data.length){
      var indexValidId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
    }

    var indexNotNumeric = _.findIndex(param.validations, function(validation) { return validation == "^is_numeric"; });
    var indexNotNumericTodo = _.findIndex(param.validations, function(validation) { return validation == "^is_numeric_todo"; });
    var indexNotRequired = _.findIndex(param.validations, function(validation) { return validation == "^required_id"; });
    var indexNotRequiredTodo = _.findIndex(param.validations, function(validation) { return validation == "^required_todo"; });

    if(indexNotNumeric > -1){
      id = value
    }else{
      if(!param.negation){
        var i = Math.floor(Math.random() * (data.length) );
        id = data[i].id
        todoId = data[i].todo_id        
      }else{
        var i = Math.floor(Math.random() * (allActNotBelongs.length) );
        id =  allActNotBelongs[i].id
        todoId = allActNotBelongs[i].todo_id
      }
    }

    // console.log(indexNotNumeric)

    if(indexNotNumericTodo > -1){
      randomChar = ['a','b','c','d','e']
      var i = Math.floor(Math.random() * (randomChar.length) );
      todoId = randomChar[i]
    }

    if(indexNotRequired > -1){
      id = ""
    }
    if(indexNotRequiredTodo > -1){
      todoId = ""
    }

    return id+"#"+todoId

  }

  return callback;
}

module.exports = belongs;
