var is_boolean = function(param){
  // just return your string patter if this custom rule is regex pattern
  // ex: return "[0-9]"
  // you can return function so we can call it back when the value has been generated to check it.
  /*
    Here and Example to create validation alpha_space_numeric and ^alpha_space_numeric in one file
  */
    if(param.negation){
      return "[0]"
    }else{
      return "[1]"
    }

}

module.exports = is_boolean;
