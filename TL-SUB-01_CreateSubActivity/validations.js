var validations = {
  'date' : function(input,req,attribute){
    var dateArray = input.split("-")

    if(dateArray.length != 3){
      return false
    }
    var dateISO = dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0];
    var tanggal = new Date(dateISO)

    if(tanggal == "Invalid Date"){
      return false
    }
    return true;
  },
  'required_id': function(input,req,attribute){
    return true
  },
  'required_todo': function(input,req,attribute){
    return true
  },
  'is_numeric_todo': function(input,req,attribute){
    return true
  },
  'is_numeric' : function(input,req,attribute){
    ids = input.split('#')

    if(ids.length != 2){
      return false
    }

    if(isNaN(parseInt(ids[0])) || isNaN(parseInt(ids[1]))){
      return false
    }else{
      return true
    }
  },
  'belongs_act': function(input,req,attribute){
    var user = req

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var client = new Client();
    client.connectSync();
     
    //text queries 
    //query masih fail
    ids = input.split('#')

    if(ids.length != 2){
      return false
    }

    if(isNaN(ids[0]) || isNaN(ids[1])){
      return false
    }

    var data = client.querySync("SELECT id,todo_id from activities where id="+ids[0]+" AND todo_id ="+ids[1]+" AND todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"'))")
    client.end()
    if(data.length>0){
      return true;
    }
    return false
  }
}

module.exports = validations;
