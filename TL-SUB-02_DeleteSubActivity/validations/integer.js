var integer = function(param){
  var callback = function(param,value){
    var parameters = param.ruleParam.split(",")
    if(parameters.length!=1
    ){
      throw new Error("wrong format parameters")
    }

    var length = parameters[0]
  }
  return callback
}
module.exports = integer;
