var unique = function(param){

  var callback = function(param,value){
    var parameters = param.ruleParam.split(",")
    if(parameters.length!=2){
      throw new Error("wrong format parameters")
    }

    var table = parameters[0]
    var column = parameters[1]

    // require pg
    var dotenv = require('dotenv').config({'path':'../.env'});
    var Client = require('pg-native');
    var _ = require('lodash');

    // var connectionStr = "postgresql://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.DB_HOST+":"+process.env.DB_PORT;

    var client = new Client();
    client.connectSync();
     
    //text queries 
    //query masih fail
    var data = client.querySync("SELECT "+column+" FROM "+table)
    var index = _.findIndex(data, function(datum) { return datum.email == value; });

    // check apakah perlu kembalian unik
    if(!param.negation){
      // kalau unik seharusnya index < 0
      if(index<0){
        return true;
      }else{
        return false;
      }
    }else{
      // butuh yang tidak unik
      if(index<0){
        // tidak ketemu , berarti ambil saja dari db
        var i = Math.floor(Math.random() * (data.length) );
        return data[i].email
      }else{
        // ketemu yang sama, ya sudah berarti malah juoss
        return true;
      }
    }
  }

  return callback;
}

module.exports = unique;
