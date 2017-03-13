var validations = {
  'belongs' : function(input,req,attribute){
    return true
  },
  'required_id' : function(input,req,attribute){
    var str = input.replace("http://todo.app/todo/","")
    var id = str.replace("/detail","")
    if(id){
      return true
    }else {
      return false
    }
  },
  'has_activity' : function(input,req,attribute){
    var str = input.replace("http://todo.app/todo/","")
    var id = parseInt(str.replace("/detail",""))

    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var client = new Client();
    client.connectSync();
     
    if(typeof id != "number" || isNaN(id))
      return false

    var data = client.querySync("SELECT todo_id from activities where todo_id="+id+"")
    // console.log(data);

    if(data.length>0)
      return true
    else
      return false
  },
  'numeric_id' : function(input,req,attribute){
    var str = input.replace("http://todo.app/todo/","")
    var id = str.replace("/detail","")
    regex = new RegExp(/[0-9]/,"g")
    if(regex.test(id)){
      return true
    }else {
      return false
    }
  },
  'valid' : function(input,req,attribute){
    if(!req){
      throw new Error("wrong format parameters")
    }

    var user = req

    var str = input.replace("http://todo.app/todo/","")
    var id = parseInt(str.replace("/detail",""))

    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var client = new Client();
    client.connectSync();
     
    if(typeof id != "number" || isNaN(id))
      return false

    var data = client.querySync("SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"') AND id="+id+"")
    // console.log(data);

    if(data.length>0)
      return true
    else
      return false

  },
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
  }
}

module.exports = validations;
