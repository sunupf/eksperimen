var validations = {
  'unique' : function(value,req,attribute){
    var unique = require(process.cwd()+'/validations/unique')();
    var param = {
      'negation':false,
      'ruleParam' : "users,email"
    }
    return unique(param,value)
  },
  'joss' : function(value,req,attribute){
    console.log(value.length);
    return value.length > 100
  }
}

module.exports = validations;
