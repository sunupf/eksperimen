var validations = {
  'exist' : function(value,req,attribute){
    var exist = require(process.cwd()+'/validations/exist')();
    var param = {
      'negation':false,
      'ruleParam' : "users,email"
    }
    var result = exist(param,value)
    if(result === true){
      return true
    }
    return false;
  },
  'not_active' : function(value,req,attribute){
    var not_active = require(process.cwd()+'/validations/not_active')();
    var param = {
      'negation':false,
      'ruleParam' : "users,email",
      'validations' : ["required","email","exist:users,email","not_active"]
    }
    var result = not_active(param,value)
    if(result === true){
      return true
    }
    return false;
  }
}

module.exports = validations;
