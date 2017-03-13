var is_email = function(param){
  if(param.negation){
    return "[a-zA-Z0-9]"
  }else{
    return "^[a-z][a-z0-9]{1,20}@[a-z]{1,15}[.]([a-z]{2,6}|[a-z]{2,6}[.][a-z]{2,3})"
  }
}

module.exports = is_email;
