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
  'numeric_id' : function(input,req,attribute){
    return true
  },
  'required_id' : function(input,req,attribute){
    return true
  },
  'belongs_id' : function(input,req,attribute){
    return true
  },
  'check' : function(input,req,attribute){
    return true
  },
  'valid': function(input,req,attribute){
    var user = req

    spliting = (input.split("/check#"));

    
    ids = (spliting[0].split("/"));
    id = parseInt(ids[ids.length-1]);
    console.log(id);
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
    // var data = client.querySync("SELECT id from activities where todo_id in (SELECT id FROM todos where user_id in (SELECT id from users where email='"+user+"')) AND id="+id)
    var data = client.querySync("SELECT id ,parent_id,(SELECT todo_id from activities b where b.id = a.parent_id) as todo_id from activities a where id="+id+" AND parent_id is not NULL AND parent_id in (SELECT id from activities where todo_id in (SELECT id from todos where user_id in (SELECT id from users where email = '"+user+"' )))");          

    client.end()
    if(data.length>0){
      return true;
    }
    return false
  }
}

module.exports = validations;
