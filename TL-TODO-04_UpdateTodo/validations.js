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
    return true;
  },
  'is_boolean': function(input,req,attribute){
    return true;
  },
  'belongs': function(input,req,attribute){
    // var user = req
    //
    // inputSplit = input.split("/")
    // id = parseInt(inputSplit[inputSplit.length-1]);
    // if(isNaN(id)){
    //   return false
    // }
    // // require pg
    // var dotenv = require('dotenv').config({'path':'../.env'});
    // var Client = require('pg-native');
    // var _ = require('lodash');
    //
    // var client = new Client();
    // client.connectSync();
    //  
    // //text queries 
    // //query masih fail
    // console.log(req);
    // console.log("SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"') AND id="+id);
    // var data = client.querySync("SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"') AND id="+id)
    // console.log(data);
    // if(data.length>0){
    //   return true;
    // }
    // return false
    return true
  },
  'is_numeric': function(input,req,attribute){
    inputSplit = input.split("/")
    id = parseInt(inputSplit[inputSplit.length-1]);
    if(isNaN(id)){
      return false
    }else{
      return true
    }
  },
  'valid': function(input,req,attribute){
    var user = req

    inputSplit = input.split("/")
    id = parseInt(inputSplit[inputSplit.length-1]);
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
    if(data.length>0){
      return true;
    }
    return false
  }
}

module.exports = validations;
