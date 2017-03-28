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
    // var data = client.querySync("SELECT id,todo_id from activities where activities.check='0' AND todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    var data = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where a.check='0' AND parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email = '"+user+"' )))");    

    // var indexValidTodoId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
    var i = Math.floor(Math.random() * (data.length) );
    id = parseInt(data[i].id)
    todoId = parseInt(data[i].todo_id)
    parentId = parseInt(data[i].parent_id)
    check = "check"

    var indexActCheck = _.findIndex(param.validations, function(validation) { return validation == "^check"; });
    if(indexActCheck >= 0){
      // var data = client.querySync("SELECT id,todo_id from activities where activities.check='1' AND todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
      // var indexValidTodoId = _.findIndex(data, function(datum) { return datum.todo_id == value; });
      var data = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where a.check='1' AND parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email = '"+user+"' )))");          
      var i = Math.floor(Math.random() * (data.length) );
      id = parseInt(data[i].id)
      todoId = parseInt(data[i].todo_id)
      parentId = parseInt(data[i].parent_id)      
      check = "uncheck"
    }

    var indexActNotBelongs = _.findIndex(param.validations, function(validation) { return validation == "^belongs_id"; });
    if(indexActNotBelongs>=0){
      // var data = client.querySync("SELECT id,todo_id from activities where todo_id not in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
      var data = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email != '"+user+"' )))");                
      var i = Math.floor(Math.random() * (data.length) );
      id = parseInt(data[i].id)
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
    // return "http://todo.app/activity/"+id+"/check#"+todoId+"#"+check;
    return "http://todo.app/subactivity/"+id+"/check#"+parentId+"/"+todoId;
  }

  return callback;
}

module.exports = valid;
