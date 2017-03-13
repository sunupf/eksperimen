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
  'is_numeric' : function(input,req,attribute){
    id = parseInt(input);
    if(isNaN(id)){
      return false
    }else{
      return true
    }
  },
  'belongs': function(input,req,attribute){
    var user = req

    id = parseInt(input);
    if(isNaN(id)){
      return false
    }
    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    var client = new Client();
    client.connectSync();
     
    //text queries 
    //query masih fail
    var data = client.querySync("SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"') AND id="+id+"")
    client.end()
    if(data.length>0){
      return true;
    }
    return false
  }
}

module.exports = validations;
