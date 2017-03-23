var date = function(param){
  var callback = function(param,value){
    var day = Math.floor(Math.random() * 31) + 1;
    var month = Math.floor(Math.random() * 11) + 1;
    var year = Math.floor(Math.random() * (2000-1960+1)) + 1960;

    var date = new Date();

    date.setFullYear(year,month,day)

    var dateString = date.getDate()+"-"+ (date.getMonth()+1) +"-"+date.getFullYear()

    if(!param.negation){
      return dateString;
    }else{
      return "Date"+dateString;
    }
  }

  return callback
}

module.exports = date;
