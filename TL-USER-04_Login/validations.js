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
  'active' : function(value,req,attribute){
    var active = require(process.cwd()+'/validations/active')();
    var param = {
      'negation':false,
      'ruleParam' : "users,email"
    }
    var result = active(param,value)
    if(result === true){
      return true
    }
    return false;
  }
}

module.exports = validations;
