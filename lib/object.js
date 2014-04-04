Object.defineProperty(Object.prototype, 'filter', {
  value: function(){
    var result = {};
    for (var i = 0; i < arguments.length; i++){
      if (Object.keys(this).indexOf(arguments[i]) != -1) result[arguments[i]] = this[arguments[i]]
    }
    return result;
  }
});

